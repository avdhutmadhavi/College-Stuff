USE navro_living;

INSERT INTO product_categories (name, slug) VALUES
  ('Plants', 'plants'),
  ('Planters', 'planters'),
  ('Garden kits', 'garden-kits'),
  ('Tools', 'tools')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO plant_categories (name, slug) VALUES
  ('Beginner-friendly plants', 'beginner-friendly-plants'),
  ('Balcony gardening', 'balcony-gardening'),
  ('Rooftop gardening', 'rooftop-gardening'),
  ('Kitchen gardening', 'kitchen-gardening'),
  ('Indoor plants', 'indoor-plants'),
  ('Plant care', 'plant-care'),
  ('Watering & sunlight', 'watering-sunlight'),
  ('Soil & compost', 'soil-compost'),
  ('Plant pests & maintenance', 'plant-pests-maintenance')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (category_id, slug, name, description, care_instructions, price, stock_quantity, is_demo)
SELECT c.id, demo.slug, demo.name, demo.description, demo.care_instructions, demo.price, 0, TRUE
FROM (
  SELECT 'starter-herb-planter' AS slug, 'Starter Herb Planter' AS name,
    'A sample listing for a sunny-window herb planter. Demonstration content; not available to purchase.' AS description,
    'Check local growing conditions and the light and watering needs of each herb.' AS care_instructions,
    799.00 AS price, 'garden-kits' AS category_slug
  UNION ALL SELECT 'minimal-planter', 'Minimal Planter',
    'A sample listing for a simple indoor planter. Demonstration content; not available to purchase.',
    'Choose pots with drainage suited to the plants and the intended location.',
    999.00, 'planters'
  UNION ALL SELECT 'easy-care-indoor-plant', 'Easy-care Indoor Plant',
    'A sample listing for a foliage plant. Demonstration content; not available to purchase.',
    'Light and watering needs vary by species and room conditions.',
    499.00, 'plants'
  UNION ALL SELECT 'balcony-garden-tool-kit', 'Balcony Garden Tool Kit',
    'A sample listing for a small-space gardening tool kit. Demonstration content; not available to purchase.',
    'Keep tools clean and dry between uses.',
    649.00, 'tools'
) AS demo
JOIN product_categories c ON c.slug = demo.category_slug
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  name = VALUES(name),
  description = VALUES(description),
  care_instructions = VALUES(care_instructions),
  price = VALUES(price),
  is_demo = TRUE,
  stock_quantity = 0;

INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
SELECT p.id,
  CASE p.slug
    WHEN 'starter-herb-planter' THEN '/rooftop.jpg'
    WHEN 'minimal-planter' THEN '/plants.jpg'
    WHEN 'easy-care-indoor-plant' THEN '/plants.jpg'
    ELSE '/garden-main.jpg'
  END,
  CASE p.slug
    WHEN 'starter-herb-planter' THEN 'Young seedlings growing in a tray (sample image)'
    WHEN 'minimal-planter' THEN 'A succulent in a pale blue-green pot (sample image)'
    WHEN 'easy-care-indoor-plant' THEN 'A small aloe plant (sample image)'
    ELSE 'Gardening tools and potting soil ready for planting (sample image)'
  END,
  0
FROM products p
WHERE p.slug IN ('starter-herb-planter','minimal-planter','easy-care-indoor-plant','balcony-garden-tool-kit')
  AND NOT EXISTS (SELECT 1 FROM product_images i WHERE i.product_id = p.id);

INSERT INTO plant_guides (category_id, slug, title, summary, content, featured_image, featured_image_alt, is_demo, is_published, published_at)
SELECT c.id, demo.slug, demo.title, demo.summary, demo.content, demo.image, demo.image_alt, TRUE, TRUE, CURRENT_TIMESTAMP
FROM (
  SELECT 'balcony-gardening' AS category_slug, 'A gentler start to balcony gardening' AS title,
    'A practical starting point for choosing plants for an urban balcony.' AS summary,
    'Begin by observing your balcony at different times of day: note direct sun, shade, wind, and how rain reaches the space. Choose a few plants suited to those conditions rather than buying a large collection at once. Use containers with drainage appropriate to the location, and check them regularly because small pots can dry faster than garden beds. Local climate and the particular plant variety matter, so treat labels and general advice as a starting point.' AS content,
    '/balcony.jpg' AS image, 'balcony-first-steps' AS slug,
    'Close-up of dense green fern foliage' AS image_alt
  UNION ALL SELECT 'kitchen-gardening', 'Growing herbs in a small kitchen garden',
    'A flexible guide to growing a few useful herbs in containers.',
    'Pick a bright spot and start with one or two herbs that suit its light. Containers need suitable drainage, and potting mix should match the plants you choose. Water when the growing medium needs it rather than following a fixed schedule: temperature, pot size, and airflow all affect how quickly it dries. Harvest modestly so plants can keep growing. Results vary by season and local conditions.',
    '/rooftop.jpg', 'small-space-herbs', 'Young seedlings growing in a tray'
  UNION ALL SELECT 'plant-care', 'Reading the light in your home',
    'Learn to notice changing light before choosing a spot for a plant.',
    'Notice how bright a spot is through the day, whether sun falls directly on it, and how nearby windows or buildings change the light. Rotate a plant only when that suits its needs, and watch for signs of stress after moving it. Plant labels and local expertise are useful because light requirements differ by species and indoor conditions.',
    '/care.jpg', 'reading-home-light', 'A rubber plant in a pale pot against a light background'
) AS demo
JOIN plant_categories c ON c.slug = demo.category_slug
ON DUPLICATE KEY UPDATE title = VALUES(title), summary = VALUES(summary),
  content = VALUES(content), featured_image = VALUES(featured_image),
  featured_image_alt = VALUES(featured_image_alt), is_demo = TRUE,
  is_published = TRUE;
