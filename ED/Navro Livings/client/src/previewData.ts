import type { PlantGuide, Product } from "./types";
import type { Category, GuideList, ProductList } from "./api";

export const previewProductCategories: Category[] = [
  { id: 1, name: "Garden kits", slug: "garden-kits" },
  { id: 2, name: "Plants", slug: "plants" },
  { id: 3, name: "Planters", slug: "planters" },
  { id: 4, name: "Tools", slug: "tools" },
];

export const previewGuideCategories: Category[] = [
  { id: 1, name: "Balcony gardening", slug: "balcony-gardening" },
  { id: 2, name: "Beginner-friendly plants", slug: "beginner-friendly-plants" },
  { id: 3, name: "Indoor plants", slug: "indoor-plants" },
  { id: 4, name: "Kitchen gardening", slug: "kitchen-gardening" },
  { id: 5, name: "Plant care", slug: "plant-care" },
  { id: 6, name: "Plant pests & maintenance", slug: "plant-pests-maintenance" },
  { id: 7, name: "Rooftop gardening", slug: "rooftop-gardening" },
  { id: 8, name: "Soil & compost", slug: "soil-compost" },
  { id: 9, name: "Watering & sunlight", slug: "watering-sunlight" },
];

export const previewProducts: Product[] = [
  {
    id: 1,
    slug: "balcony-garden-tool-kit",
    name: "Balcony Garden Tool Kit",
    description: "A sample listing for a small-space gardening tool kit. Demonstration content; not available to purchase.",
    care_instructions: "Keep tools clean and dry between uses.",
    price: 649,
    stock_quantity: 0,
    is_demo: true,
    category: "Tools",
    category_slug: "tools",
    image: "/garden-main.jpg",
    images: [{ image_url: "/garden-main.jpg", alt_text: "Gardening tools and potting soil ready for planting (sample image)" }],
  },
  {
    id: 2,
    slug: "easy-care-indoor-plant",
    name: "Easy-care Indoor Plant",
    description: "A sample listing for a foliage plant. Demonstration content; not available to purchase.",
    care_instructions: "Light and watering needs vary by species and room conditions.",
    price: 499,
    stock_quantity: 0,
    is_demo: true,
    category: "Plants",
    category_slug: "plants",
    image: "/plants.jpg",
    images: [{ image_url: "/plants.jpg", alt_text: "A small aloe plant (sample image)" }],
  },
  {
    id: 3,
    slug: "minimal-planter",
    name: "Minimal Planter",
    description: "A sample listing for a simple indoor planter. Demonstration content; not available to purchase.",
    care_instructions: "Choose pots with drainage suited to the plants and the intended location.",
    price: 999,
    stock_quantity: 0,
    is_demo: true,
    category: "Planters",
    category_slug: "planters",
    image: "/plants.jpg",
    images: [{ image_url: "/plants.jpg", alt_text: "A succulent in a pale blue-green pot (sample image)" }],
  },
  {
    id: 4,
    slug: "starter-herb-planter",
    name: "Starter Herb Planter",
    description: "A sample listing for a sunny-window herb planter. Demonstration content; not available to purchase.",
    care_instructions: "Check local growing conditions and the light and watering needs of each herb.",
    price: 799,
    stock_quantity: 0,
    is_demo: true,
    category: "Garden kits",
    category_slug: "garden-kits",
    image: "/rooftop.jpg",
    images: [{ image_url: "/rooftop.jpg", alt_text: "Young seedlings growing in a tray (sample image)" }],
  },
];

export const previewGuides: PlantGuide[] = [
  {
    slug: "balcony-first-steps",
    title: "A gentler start to balcony gardening",
    summary: "A practical starting point for choosing plants for an urban balcony.",
    content: "Begin by observing your balcony at different times of day: note direct sun, shade, wind, and how rain reaches the space. Choose a few plants suited to those conditions rather than buying a large collection at once. Use containers with drainage appropriate to the location, and check them regularly because small pots can dry faster than garden beds. Local climate and the particular plant variety matter, so treat labels and general advice as a starting point.",
    featured_image: "/balcony.jpg",
    featured_image_alt: "Close-up of dense green fern foliage",
    published_at: "2026-01-03T00:00:00.000Z",
    category: "Balcony gardening",
    category_slug: "balcony-gardening",
    is_demo: true,
  },
  {
    slug: "small-space-herbs",
    title: "Growing herbs in a small kitchen garden",
    summary: "A flexible guide to growing a few useful herbs in containers.",
    content: "Pick a bright spot and start with one or two herbs that suit its light. Containers need suitable drainage, and potting mix should match the plants you choose. Water when the growing medium needs it rather than following a fixed schedule: temperature, pot size, and airflow all affect how quickly it dries. Harvest modestly so plants can keep growing. Results vary by season and local conditions.",
    featured_image: "/rooftop.jpg",
    featured_image_alt: "Young seedlings growing in a tray",
    published_at: "2026-01-02T00:00:00.000Z",
    category: "Kitchen gardening",
    category_slug: "kitchen-gardening",
    is_demo: true,
  },
  {
    slug: "reading-home-light",
    title: "Reading the light in your home",
    summary: "Learn to notice changing light before choosing a spot for a plant.",
    content: "Notice how bright a spot is through the day, whether sun falls directly on it, and how nearby windows or buildings change the light. Rotate a plant only when that suits its needs, and watch for signs of stress after moving it. Plant labels and local expertise are useful because light requirements differ by species and indoor conditions.",
    featured_image: "/care.jpg",
    featured_image_alt: "A rubber plant in a pale pot against a light background",
    published_at: "2026-01-01T00:00:00.000Z",
    category: "Plant care",
    category_slug: "plant-care",
    is_demo: true,
  },
];

function readPage<T>(items: T[], query: string): { items: T[]; page: number; limit: number; total: number } {
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const page = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
  const limit = Math.min(48, Math.max(1, Number.parseInt(params.get("limit") || "24", 10) || 24));
  const start = (page - 1) * limit;
  return { items: items.slice(start, start + limit), page, limit, total: items.length };
}

export function findPreviewProducts(query = ""): ProductList {
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const search = (params.get("search") || "").trim().toLocaleLowerCase();
  const category = params.get("category") || "";
  const sort = params.get("sort");
  let products = previewProducts.filter((product) =>
    (!category || product.category_slug === category) &&
    (!search || `${product.name} ${product.description}`.toLocaleLowerCase().includes(search)),
  );
  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  else products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  return readPage(products, query);
}

export function findPreviewGuides(query = ""): GuideList {
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const search = (params.get("search") || "").trim().toLocaleLowerCase();
  const category = params.get("category") || "";
  const guides = previewGuides.filter((guide) =>
    (!category || guide.category_slug === category) &&
    (!search || `${guide.title} ${guide.summary}`.toLocaleLowerCase().includes(search)),
  );
  return readPage(guides, query);
}
