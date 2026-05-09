CREATE DATABASE IF NOT EXISTS clothing_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clothing_store;

CREATE TABLE IF NOT EXISTS category (
    id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS product (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    cost_price     DECIMAL(10,2) NOT NULL,
    sale_price     DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id    BIGINT,
    size           VARCHAR(10),
    color          VARCHAR(50),
    entry_date     DATE NOT NULL,
    image_url      VARCHAR(500),
    qr_code        VARCHAR(255) UNIQUE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS sale (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_date    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_item (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_id    BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity   INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_item_sale    FOREIGN KEY (sale_id)    REFERENCES sale(id),
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE INDEX idx_product_category   ON product(category_id);
CREATE INDEX idx_product_entry_date ON product(entry_date);
CREATE INDEX idx_product_size       ON product(size);
CREATE INDEX idx_product_color      ON product(color);
CREATE INDEX idx_product_sale_price ON product(sale_price);
CREATE INDEX idx_sale_date          ON sale(sale_date);
CREATE INDEX idx_sale_total         ON sale(total_amount);
