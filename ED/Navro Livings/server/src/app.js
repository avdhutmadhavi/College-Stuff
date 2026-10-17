require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const pool = require("./config/database");
const { z } = require("zod");

const app = express();
const api = express.Router();
const frontendOrigin = process.env.FRONTEND_URL || "http://127.0.0.1:5173";

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: frontendOrigin }));
app.use(express.json({ limit: "32kb" }));

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many enquiries from this connection. Please try again later." },
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many checkout requests from this connection. Please try again later." },
});

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  service: z.string().trim().max(100).optional().default(""),
  locality: z.string().trim().max(160).optional().default(""),
  gardenType: z.string().trim().max(80).optional().default(""),
  gardenSize: z.string().trim().max(80).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  contactMethod: z.enum(["Email", "Phone", "WhatsApp", "No preference"]).optional().default("No preference"),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
});

const orderSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().min(8).max(300),
  city: z.string().trim().min(2).max(120),
  postalCode: z.string().trim().min(3).max(20),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(50),
}).superRefine((order, context) => {
  const quantities = new Map();
  for (const item of order.items) {
    const quantity = (quantities.get(item.productId) || 0) + item.quantity;
    quantities.set(item.productId, quantity);
    if (quantity > 20) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["items"],
        message: "The total quantity for a product cannot exceed 20.",
      });
      return;
    }
  }
});

api.get("/health", async (_request, response, next) => {
  try {
    await pool.query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

api.get("/categories", async (_request, response, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, slug FROM product_categories ORDER BY name",
    );
    response.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get("/guide-categories", async (_request, response, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, slug FROM plant_categories ORDER BY name",
    );
    response.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get("/products", async (request, response, next) => {
  try {
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);
    const limit = Math.min(48, Math.max(1, Number.parseInt(request.query.limit, 10) || 24));
    const search = typeof request.query.search === "string" ? request.query.search.trim().slice(0, 100) : "";
    const category = typeof request.query.category === "string" ? request.query.category.trim().slice(0, 80) : "";
    const sortOrder = request.query.sort === "price-asc" ? "p.price ASC" :
      request.query.sort === "price-desc" ? "p.price DESC" : "p.name ASC";
    const conditions = ["p.is_active = 1"];
    const parameters = [];
    if (search) {
      conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
      parameters.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push("c.slug = ?");
      parameters.push(category);
    }
    const where = conditions.join(" AND ");
    const [rows] = await pool.execute(
      `SELECT p.id, p.slug, p.name, p.description, p.price, p.stock_quantity, p.is_demo,
              c.name AS category, c.slug AS category_slug,
              (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) AS image
       FROM products p JOIN product_categories c ON c.id = p.category_id
       WHERE ${where} ORDER BY ${sortOrder} LIMIT ? OFFSET ?`,
      [...parameters, limit, (page - 1) * limit],
    );
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM products p JOIN product_categories c ON c.id = p.category_id WHERE ${where}`,
      parameters,
    );
    response.json({ items: rows, page, limit, total: countRows[0].total });
  } catch (error) {
    next(error);
  }
});

api.get("/products/:slug", async (request, response, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.id, p.slug, p.name, p.description, p.care_instructions, p.price,
              p.stock_quantity, p.is_demo, c.name AS category, c.slug AS category_slug
       FROM products p JOIN product_categories c ON c.id = p.category_id
       WHERE p.slug = ? AND p.is_active = 1 LIMIT 1`,
      [request.params.slug],
    );
    if (rows.length === 0) return response.status(404).json({ error: "Product not found." });
    const [images] = await pool.execute(
      "SELECT image_url, alt_text FROM product_images WHERE product_id = ? ORDER BY sort_order",
      [rows[0].id],
    );
    response.json({ ...rows[0], images });
  } catch (error) {
    next(error);
  }
});

api.get("/guides", async (request, response, next) => {
  try {
    const page = Math.max(1, Number.parseInt(request.query.page, 10) || 1);
    const limit = Math.min(48, Math.max(1, Number.parseInt(request.query.limit, 10) || 24));
    const search = typeof request.query.search === "string" ? request.query.search.trim().slice(0, 100) : "";
    const category = typeof request.query.category === "string" ? request.query.category.trim().slice(0, 80) : "";
    const conditions = ["g.is_published = 1"];
    const parameters = [];
    if (search) {
      conditions.push("(g.title LIKE ? OR g.summary LIKE ?)");
      parameters.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push("c.slug = ?");
      parameters.push(category);
    }
    const where = conditions.join(" AND ");
    const [rows] = await pool.execute(
      `SELECT g.slug, g.title, g.summary, g.featured_image, g.featured_image_alt,
              g.published_at, g.is_demo, c.name AS category, c.slug AS category_slug
       FROM plant_guides g JOIN plant_categories c ON c.id = g.category_id
       WHERE ${where} ORDER BY g.published_at DESC, g.title LIMIT ? OFFSET ?`,
      [...parameters, limit, (page - 1) * limit],
    );
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM plant_guides g JOIN plant_categories c ON c.id = g.category_id WHERE ${where}`,
      parameters,
    );
    response.json({ items: rows, page, limit, total: countRows[0].total });
  } catch (error) {
    next(error);
  }
});

api.get("/guides/:slug", async (request, response, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT g.slug, g.title, g.summary, g.content, g.featured_image, g.featured_image_alt,
              g.published_at, g.is_demo,
              c.name AS category, c.slug AS category_slug
       FROM plant_guides g JOIN plant_categories c ON c.id = g.category_id
       WHERE g.slug = ? AND g.is_published = 1 LIMIT 1`,
      [request.params.slug],
    );
    if (rows.length === 0) return response.status(404).json({ error: "Plant guide not found." });
    response.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.post("/enquiries", enquiryLimiter, async (request, response, next) => {
  const result = enquirySchema.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({
      error: "Please check the form and try again.",
      details: result.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
    });
  }
  try {
    const enquiry = result.data;
    const [insert] = await pool.execute(
      `INSERT INTO enquiries
       (name, email, phone, service_interest, locality, garden_type, garden_size, budget_range, preferred_contact, message, consent_given)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        enquiry.name, enquiry.email, enquiry.phone || null, enquiry.service || null,
        enquiry.locality || null, enquiry.gardenType || null, enquiry.gardenSize || null,
        enquiry.budget || null, enquiry.contactMethod, enquiry.message, enquiry.consent,
      ],
    );
    response.status(201).json({ id: insert.insertId, message: "Your enquiry has been received." });
  } catch (error) {
    next(error);
  }
});

api.post("/orders", orderLimiter, async (request, response, next) => {
  const result = orderSchema.safeParse(request.body);
  if (!result.success) {
    return response.status(400).json({
      error: "Please check the checkout details and try again.",
      details: result.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
    });
  }
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const order = result.data;
    const quantities = new Map();
    for (const item of order.items) {
      quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    }
    const productIds = [...quantities.keys()];
    const placeholders = productIds.map(() => "?").join(",");
    const [products] = await connection.execute(
      `SELECT id, name, price, stock_quantity, is_demo FROM products
       WHERE id IN (${placeholders}) AND is_active = 1 FOR UPDATE`,
      productIds,
    );
    if (products.length !== productIds.length) {
      await connection.rollback();
      return response.status(400).json({ error: "One or more products are no longer available." });
    }
    let total = 0;
    const orderItems = [];
    for (const product of products) {
      const quantity = quantities.get(product.id);
      if (product.is_demo) {
        await connection.rollback();
        return response.status(400).json({ error: "Demonstration products cannot be ordered. Please contact NAVRO Living for current product availability." });
      }
      if (product.stock_quantity < quantity) {
        await connection.rollback();
        return response.status(400).json({ error: `${product.name} does not have enough stock for this quantity.` });
      }
      const lineTotal = Number(product.price) * quantity;
      total += lineTotal;
      orderItems.push({ productId: product.id, name: product.name, quantity, price: product.price });
    }
    const [insert] = await connection.execute(
      `INSERT INTO orders (customer_name, email, phone, delivery_address, city, postal_code, total_amount, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [order.name, order.email, order.phone, order.address, order.city, order.postalCode, total.toFixed(2)],
    );
    for (const item of orderItems) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, product_name_snapshot, quantity, unit_price) VALUES (?, ?, ?, ?, ?)",
        [insert.insertId, item.productId, item.name, item.quantity, item.price],
      );
      await connection.execute(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
        [item.quantity, item.productId],
      );
    }
    await connection.commit();
    response.status(201).json({ id: insert.insertId, total: Number(total.toFixed(2)), status: "pending", paymentStatus: "pending" });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Order rollback failed:", rollbackError.code || rollbackError.name || "Unknown error");
      }
    }
    next(error);
  } finally {
    if (connection) connection.release();
  }
});

app.use("/api", api);
app.use((_request, response) => response.status(404).json({ error: "Route not found." }));
app.use((error, _request, response, _next) => {
  console.error("Request failed:", error.code || error.name || "Unknown error");
  if (response.headersSent) return;
  response.status(500).json({ error: "The request could not be completed. Please try again later." });
});

module.exports = app;
