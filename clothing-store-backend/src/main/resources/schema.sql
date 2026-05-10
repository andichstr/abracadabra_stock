CREATE DATABASE IF NOT EXISTS clothing_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clothing_store;

CREATE TABLE IF NOT EXISTS categories (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    cost_price     DECIMAL(10,2) NOT NULL,
    sale_price     DECIMAL(10,2) NOT NULL,
    category_id    BIGINT,
    entry_date     DATE NOT NULL,
    qr_code        VARCHAR(255) UNIQUE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_variants (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id     BIGINT NOT NULL,
    size           VARCHAR(10),
    color          VARCHAR(50),
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url      VARCHAR(500),
    CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS sales (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_items (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_id            BIGINT NOT NULL,
    product_variant_id BIGINT NOT NULL,
    quantity           INT NOT NULL,
    unit_price         DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_sale    FOREIGN KEY (sale_id)            REFERENCES sales(id),
    CONSTRAINT fk_item_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)
);

CREATE INDEX idx_product_category    ON products(category_id);
CREATE INDEX idx_product_entry_date  ON products(entry_date);
CREATE INDEX idx_product_sale_price  ON products(sale_price);
CREATE INDEX idx_variant_product     ON product_variants(product_id);
CREATE INDEX idx_variant_size        ON product_variants(size);
CREATE INDEX idx_variant_color       ON product_variants(color);
CREATE INDEX idx_sale_date           ON sales(sale_date);
CREATE INDEX idx_sale_total          ON sales(total_amount);
