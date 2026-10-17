CREATE DATABASE IF NOT EXISTS navro_living
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE navro_living;

CREATE TABLE IF NOT EXISTS product_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_categories_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(180) NOT NULL,
  name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  care_instructions TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY ix_products_category_active (category_id, is_active),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES product_categories (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_products_price CHECK (price >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(240) NOT NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY ix_product_images_product (product_id, sort_order),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS plant_categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_plant_categories_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS plant_guides (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  slug VARCHAR(180) NOT NULL,
  title VARCHAR(200) NOT NULL,
  summary VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(500) NULL,
  featured_image_alt VARCHAR(240) NULL,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_plant_guides_slug (slug),
  KEY ix_plant_guides_published (is_published, published_at),
  CONSTRAINT fk_plant_guides_category FOREIGN KEY (category_id)
    REFERENCES plant_categories (id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enquiries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(40) NULL,
  service_interest VARCHAR(100) NULL,
  locality VARCHAR(160) NULL,
  garden_type VARCHAR(80) NULL,
  garden_size VARCHAR(80) NULL,
  budget_range VARCHAR(80) NULL,
  preferred_contact VARCHAR(40) NOT NULL DEFAULT 'No preference',
  message TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  status ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_enquiries_status_created (status, created_at),
  KEY ix_enquiries_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  delivery_address VARCHAR(300) NOT NULL,
  city VARCHAR(120) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','fulfilled','cancelled') NOT NULL DEFAULT 'pending',
  payment_status ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_orders_status_created (status, created_at),
  KEY ix_orders_email (email),
  CONSTRAINT chk_orders_total CHECK (total_amount >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_name_snapshot VARCHAR(180) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_order_items_order (order_id),
  KEY ix_order_items_product (product_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
    REFERENCES orders (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
    REFERENCES products (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
  CONSTRAINT chk_order_items_price CHECK (unit_price >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB;
