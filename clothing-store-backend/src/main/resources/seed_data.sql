-- =============================================================
-- DATOS DE PRUEBA — clothing_store
-- Ejecutar sobre una DB ya inicializada con schema.sql.
-- Genera: 8 categorías, 50 productos, 150 variantes, 40 ventas.
-- =============================================================

USE clothing_store;

-- =============================================================
-- CATEGORÍAS (id 1-8)
-- =============================================================
INSERT INTO categories (name) VALUES
('Remeras'),        -- 1
('Pantalones'),     -- 2
('Vestidos'),       -- 3
('Camperas'),       -- 4
('Calzado'),        -- 5
('Accesorios'),     -- 6
('Ropa Interior'),  -- 7
('Buzos y Hoodies');-- 8

-- =============================================================
-- PRODUCTOS (id 1-50)
-- Cada fila: name, cost_price, sale_price, category_id, entry_date, qr_code
-- =============================================================
INSERT INTO products (name, cost_price, sale_price, category_id, entry_date, qr_code) VALUES
-- Remeras (cat 1) — id 1-10
('Remera básica algodón',        3200.00,  6500.00, 1, '2024-03-10', 'a1b2c3d4-0001'),
('Remera oversize',              4100.00,  8200.00, 1, '2024-04-15', 'a1b2c3d4-0002'),
('Remera estampada floral',      3500.00,  7000.00, 1, '2024-05-20', 'a1b2c3d4-0003'),
('Remera manga larga rayas',     3800.00,  7600.00, 1, '2024-06-01', 'a1b2c3d4-0004'),
('Remera polo piqué',            4500.00,  9000.00, 1, '2024-07-12', 'a1b2c3d4-0005'),
('Remera deportiva dry fit',     3600.00,  7200.00, 1, '2024-08-05', 'a1b2c3d4-0006'),
('Remera cuello V modal',        3300.00,  6600.00, 1, '2024-09-18', 'a1b2c3d4-0007'),
('Remera crop',                  2900.00,  5800.00, 1, '2024-10-22', 'a1b2c3d4-0008'),
('Remera tie dye',               4200.00,  8400.00, 1, '2024-11-08', 'a1b2c3d4-0009'),
('Remera oversize estampada',    4800.00,  9600.00, 1, '2025-01-15', 'a1b2c3d4-0010'),
-- Pantalones (cat 2) — id 11-18
('Jean skinny tiro alto',        7500.00, 14900.00, 2, '2024-03-22', 'a1b2c3d4-0011'),
('Jean wide leg',                8200.00, 16500.00, 2, '2024-05-10', 'a1b2c3d4-0012'),
('Pantalón cargo',               6800.00, 13600.00, 2, '2024-06-15', 'a1b2c3d4-0013'),
('Pantalón palazzo',             5500.00, 11000.00, 2, '2024-07-20', 'a1b2c3d4-0014'),
('Jean recto clásico',           7000.00, 14000.00, 2, '2024-08-30', 'a1b2c3d4-0015'),
('Pantalón chino slim',          6200.00, 12400.00, 2, '2024-09-05', 'a1b2c3d4-0016'),
('Jean mom',                     7800.00, 15600.00, 2, '2024-10-18', 'a1b2c3d4-0017'),
('Pantalón jogger felpa',        5200.00, 10400.00, 2, '2025-02-01', 'a1b2c3d4-0018'),
-- Vestidos (cat 3) — id 19-25
('Vestido midi floral',          8500.00, 17000.00, 3, '2024-04-08', 'a1b2c3d4-0019'),
('Vestido camisero denim',       7200.00, 14400.00, 3, '2024-06-22', 'a1b2c3d4-0020'),
('Vestido de fiesta',           12000.00, 24000.00, 3, '2024-07-30', 'a1b2c3d4-0021'),
('Vestido playero lino',         6500.00, 13000.00, 3, '2024-08-14', 'a1b2c3d4-0022'),
('Vestido lencero satinado',     9000.00, 18000.00, 3, '2024-09-25', 'a1b2c3d4-0023'),
('Vestido blazer',              10500.00, 21000.00, 3, '2024-11-12', 'a1b2c3d4-0024'),
('Vestido mini rayas',           7800.00, 15600.00, 3, '2025-01-28', 'a1b2c3d4-0025'),
-- Camperas (cat 4) — id 26-31
('Campera bomber satinada',     12000.00, 24000.00, 4, '2024-03-15', 'a1b2c3d4-0026'),
('Campera denim',                9500.00, 19000.00, 4, '2024-05-28', 'a1b2c3d4-0027'),
('Campera cuero ecológico',     15000.00, 30000.00, 4, '2024-07-10', 'a1b2c3d4-0028'),
('Campera rompevientos',         8000.00, 16000.00, 4, '2024-08-20', 'a1b2c3d4-0029'),
('Campera puffer',              13500.00, 27000.00, 4, '2024-09-15', 'a1b2c3d4-0030'),
('Campera collegiate',          11000.00, 22000.00, 4, '2024-10-05', 'a1b2c3d4-0031'),
-- Calzado (cat 5) — id 32-36
('Zapatillas urbanas',          15000.00, 30000.00, 5, '2024-04-20', 'a1b2c3d4-0032'),
('Botas de cuero',              18000.00, 36000.00, 5, '2024-06-08', 'a1b2c3d4-0033'),
('Sandalias plataforma',         9000.00, 18000.00, 5, '2024-07-25', 'a1b2c3d4-0034'),
('Sneakers retro',              14000.00, 28000.00, 5, '2024-09-10', 'a1b2c3d4-0035'),
('Mocasines de cuero',          12500.00, 25000.00, 5, '2024-11-20', 'a1b2c3d4-0036'),
-- Accesorios (cat 6) — id 37-41
('Cartera de cuero mediana',     9500.00, 19000.00, 6, '2024-05-15', 'a1b2c3d4-0037'),
('Cinturón trenzado cuero',      3500.00,  7000.00, 6, '2024-07-01', 'a1b2c3d4-0038'),
('Gorro tejido invierno',        2800.00,  5600.00, 6, '2024-08-10', 'a1b2c3d4-0039'),
('Bufanda de lana',              3200.00,  6400.00, 6, '2024-09-20', 'a1b2c3d4-0040'),
('Bolso tote canvas',            5500.00, 11000.00, 6, '2025-01-10', 'a1b2c3d4-0041'),
-- Ropa Interior (cat 7) — id 42-45
('Pack 3 bombachas algodón',     4500.00,  9000.00, 7, '2024-06-10', 'a1b2c3d4-0042'),
('Pack 3 corpiños sin arco',     5200.00, 10400.00, 7, '2024-07-15', 'a1b2c3d4-0043'),
('Calzoncillo algodón pack 3',   4000.00,  8000.00, 7, '2024-08-25', 'a1b2c3d4-0044'),
('Conjunto lencero',             6800.00, 13600.00, 7, '2024-10-30', 'a1b2c3d4-0045'),
-- Buzos y Hoodies (cat 8) — id 46-50
('Hoodie oversize',              8500.00, 17000.00, 8, '2024-05-05', 'a1b2c3d4-0046'),
('Buzo universitario',           7200.00, 14400.00, 8, '2024-06-20', 'a1b2c3d4-0047'),
('Buzo cropped',                 6500.00, 13000.00, 8, '2024-08-15', 'a1b2c3d4-0048'),
('Hoodie tie dye',               9000.00, 18000.00, 8, '2024-10-01', 'a1b2c3d4-0049'),
('Buzo deportivo',               7800.00, 15600.00, 8, '2025-02-15', 'a1b2c3d4-0050');

-- =============================================================
-- VARIANTES (3 por producto → id 1-150)
-- Formato: product_id, size, color, stock_quantity, image_url
-- Variante de producto P → ids (3P-2), (3P-1), (3P)
-- =============================================================
INSERT INTO product_variants (product_id, size, color, stock_quantity, image_url) VALUES
-- Producto 1 — Remera básica algodón  (variants 1-3)
(1,  'S', 'Negro',    12, NULL),
(1,  'M', 'Negro',    18, NULL),
(1,  'M', 'Blanco',   10, NULL),
-- Producto 2 — Remera oversize  (variants 4-6)
(2,  'S', 'Gris',      8, NULL),
(2,  'M', 'Gris',     14, NULL),
(2,  'M', 'Celeste',   6, NULL),
-- Producto 3 — Remera estampada floral  (variants 7-9)
(3,  'S', 'Blanco',   15, NULL),
(3,  'M', 'Blanco',   20, NULL),
(3,  'S', 'Rosa',      9, NULL),
-- Producto 4 — Remera manga larga rayas  (variants 10-12)
(4,  'S', 'Azul',     11, NULL),
(4,  'M', 'Azul',     17, NULL),
(4,  'S', 'Blanco',    5, NULL),
-- Producto 5 — Remera polo piqué  (variants 13-15)
(5,  'S', 'Blanco',   10, NULL),
(5,  'M', 'Blanco',   13, NULL),
(5,  'M', 'Negro',     7, NULL),
-- Producto 6 — Remera deportiva dry fit  (variants 16-18)
(6,  'S', 'Negro',    16, NULL),
(6,  'M', 'Negro',    22, NULL),
(6,  'L', 'Negro',     8, NULL),
-- Producto 7 — Remera cuello V modal  (variants 19-21)
(7,  'S', 'Blanco',   14, NULL),
(7,  'M', 'Blanco',   19, NULL),
(7,  'L', 'Blanco',    6, NULL),
-- Producto 8 — Remera crop  (variants 22-24)
(8,  'XS', 'Negro',   10, NULL),
(8,  'S',  'Negro',   15, NULL),
(8,  'XS', 'Rosa',     8, NULL),
-- Producto 9 — Remera tie dye  (variants 25-27)
(9,  'S', 'Multicolor', 7, NULL),
(9,  'M', 'Multicolor', 12, NULL),
(9,  'L', 'Multicolor',  5, NULL),
-- Producto 10 — Remera oversize estampada  (variants 28-30)
(10, 'S', 'Negro',     9, NULL),
(10, 'M', 'Negro',    11, NULL),
(10, 'M', 'Blanco',    4, NULL),
-- Producto 11 — Jean skinny tiro alto  (variants 31-33)
(11, '38', 'Azul oscuro', 8,  NULL),
(11, '40', 'Azul oscuro', 10, NULL),
(11, '40', 'Negro',        6, NULL),
-- Producto 12 — Jean wide leg  (variants 34-36)
(12, '38', 'Azul claro', 7,  NULL),
(12, '40', 'Azul claro', 9,  NULL),
(12, '42', 'Azul claro', 4,  NULL),
-- Producto 13 — Pantalón cargo  (variants 37-39)
(13, '38', 'Verde',  11, NULL),
(13, '40', 'Verde',  14, NULL),
(13, '38', 'Negro',   8, NULL),
-- Producto 14 — Pantalón palazzo  (variants 40-42)
(14, 'S', 'Negro',  13, NULL),
(14, 'M', 'Negro',  17, NULL),
(14, 'M', 'Camel',   6, NULL),
-- Producto 15 — Jean recto clásico  (variants 43-45)
(15, '38', 'Azul oscuro', 9,  NULL),
(15, '40', 'Azul oscuro', 12, NULL),
(15, '42', 'Azul oscuro',  5, NULL),
-- Producto 16 — Pantalón chino slim  (variants 46-48)
(16, '38', 'Beige', 10, NULL),
(16, '40', 'Beige', 13, NULL),
(16, '38', 'Gris',   7, NULL),
-- Producto 17 — Jean mom  (variants 49-51)
(17, '38', 'Azul',  8, NULL),
(17, '40', 'Azul', 11, NULL),
(17, '38', 'Negro',  6, NULL),
-- Producto 18 — Pantalón jogger felpa  (variants 52-54)
(18, 'S', 'Gris',  15, NULL),
(18, 'M', 'Gris',  20, NULL),
(18, 'M', 'Negro',  9, NULL),
-- Producto 19 — Vestido midi floral  (variants 55-57)
(19, 'S', 'Blanco', 8,  NULL),
(19, 'M', 'Blanco', 12, NULL),
(19, 'S', 'Rosa',    5, NULL),
-- Producto 20 — Vestido camisero denim  (variants 58-60)
(20, 'S', 'Azul',  9, NULL),
(20, 'M', 'Azul', 14, NULL),
(20, 'M', 'Negro',  6, NULL),
-- Producto 21 — Vestido de fiesta  (variants 61-63)
(21, 'S', 'Negro', 6,  NULL),
(21, 'M', 'Negro', 10, NULL),
(21, 'S', 'Rojo',   3, NULL),
-- Producto 22 — Vestido playero lino  (variants 64-66)
(22, 'S', 'Blanco', 14, NULL),
(22, 'M', 'Blanco', 18, NULL),
(22, 'L', 'Blanco',  7, NULL),
-- Producto 23 — Vestido lencero satinado  (variants 67-69)
(23, 'S', 'Beige', 7,  NULL),
(23, 'M', 'Beige', 10, NULL),
(23, 'S', 'Negro',  5, NULL),
-- Producto 24 — Vestido blazer  (variants 70-72)
(24, 'S', 'Negro', 6,  NULL),
(24, 'M', 'Negro', 9,  NULL),
(24, 'M', 'Gris',  4,  NULL),
-- Producto 25 — Vestido mini rayas  (variants 73-75)
(25, 'S', 'Blanco', 11, NULL),
(25, 'M', 'Blanco', 15, NULL),
(25, 'M', 'Azul',    7, NULL),
-- Producto 26 — Campera bomber satinada  (variants 76-78)
(26, 'S', 'Negro',  7, NULL),
(26, 'M', 'Negro', 10, NULL),
(26, 'S', 'Verde',  4, NULL),
-- Producto 27 — Campera denim  (variants 79-81)
(27, 'S', 'Azul',  8, NULL),
(27, 'M', 'Azul', 11, NULL),
(27, 'M', 'Negro',  5, NULL),
-- Producto 28 — Campera cuero ecológico  (variants 82-84)
(28, 'S', 'Negro',  5, NULL),
(28, 'M', 'Negro',  8, NULL),
(28, 'M', 'Marrón', 3, NULL),
-- Producto 29 — Campera rompevientos  (variants 85-87)
(29, 'S', 'Negro',  12, NULL),
(29, 'M', 'Negro',  16, NULL),
(29, 'S', 'Verde',   6, NULL),
-- Producto 30 — Campera puffer  (variants 88-90)
(30, 'S', 'Negro',   6, NULL),
(30, 'M', 'Negro',   9, NULL),
(30, 'M', 'Burdeos', 4, NULL),
-- Producto 31 — Campera collegiate  (variants 91-93)
(31, 'S', 'Gris',  8,  NULL),
(31, 'M', 'Gris',  11, NULL),
(31, 'M', 'Azul',   5, NULL),
-- Producto 32 — Zapatillas urbanas  (variants 94-96)
(32, '37', 'Blanco', 6, NULL),
(32, '38', 'Blanco', 9, NULL),
(32, '39', 'Blanco', 5, NULL),
-- Producto 33 — Botas de cuero  (variants 97-99)
(33, '37', 'Marrón', 4, NULL),
(33, '38', 'Marrón', 7, NULL),
(33, '38', 'Negro',  3, NULL),
-- Producto 34 — Sandalias plataforma  (variants 100-102)
(34, '37', 'Negro', 10, NULL),
(34, '38', 'Negro', 13, NULL),
(34, '37', 'Beige',  6, NULL),
-- Producto 35 — Sneakers retro  (variants 103-105)
(35, '37', 'Blanco', 7, NULL),
(35, '38', 'Blanco', 10, NULL),
(35, '38', 'Gris',   5, NULL),
-- Producto 36 — Mocasines de cuero  (variants 106-108)
(36, '37', 'Negro',  6, NULL),
(36, '38', 'Negro',  9, NULL),
(36, '37', 'Marrón', 4, NULL),
-- Producto 37 — Cartera de cuero mediana  (variants 109-111)
(37, 'Único', 'Camel', 8, NULL),
(37, 'Único', 'Negro',  6, NULL),
(37, 'Único', 'Rojo',   3, NULL),
-- Producto 38 — Cinturón trenzado cuero  (variants 112-114)
(38, 'Único', 'Marrón', 15, NULL),
(38, 'Único', 'Negro',  18, NULL),
(38, 'Único', 'Beige',   7, NULL),
-- Producto 39 — Gorro tejido invierno  (variants 115-117)
(39, 'Único', 'Gris',    12, NULL),
(39, 'Único', 'Negro',   14, NULL),
(39, 'Único', 'Burdeos',  8, NULL),
-- Producto 40 — Bufanda de lana  (variants 118-120)
(40, 'Único', 'Gris',    10, NULL),
(40, 'Único', 'Negro',   12, NULL),
(40, 'Único', 'Burdeos',  6, NULL),
-- Producto 41 — Bolso tote canvas  (variants 121-123)
(41, 'Único', 'Natural', 9, NULL),
(41, 'Único', 'Negro',   7, NULL),
(41, 'Único', 'Azul',    5, NULL),
-- Producto 42 — Pack 3 bombachas algodón  (variants 124-126)
(42, 'S', 'Nude',  10, NULL),
(42, 'M', 'Nude',  14, NULL),
(42, 'M', 'Negro',  8, NULL),
-- Producto 43 — Pack 3 corpiños sin arco  (variants 127-129)
(43, 'S', 'Nude',  9,  NULL),
(43, 'M', 'Nude',  13, NULL),
(43, 'M', 'Negro',  6, NULL),
-- Producto 44 — Calzoncillo algodón pack 3  (variants 130-132)
(44, 'S', 'Blanco', 12, NULL),
(44, 'M', 'Blanco', 16, NULL),
(44, 'M', 'Negro',   9, NULL),
-- Producto 45 — Conjunto lencero  (variants 133-135)
(45, 'S', 'Negro', 7,  NULL),
(45, 'M', 'Negro', 10, NULL),
(45, 'M', 'Rosa',   4, NULL),
-- Producto 46 — Hoodie oversize  (variants 136-138)
(46, 'S', 'Negro', 10, NULL),
(46, 'M', 'Negro', 15, NULL),
(46, 'M', 'Gris',   8, NULL),
-- Producto 47 — Buzo universitario  (variants 139-141)
(47, 'S', 'Azul',  9, NULL),
(47, 'M', 'Azul', 13, NULL),
(47, 'M', 'Gris',  6, NULL),
-- Producto 48 — Buzo cropped  (variants 142-144)
(48, 'XS', 'Negro', 8,  NULL),
(48, 'S',  'Negro', 12, NULL),
(48, 'XS', 'Rosa',   5, NULL),
-- Producto 49 — Hoodie tie dye  (variants 145-147)
(49, 'S', 'Multicolor', 7,  NULL),
(49, 'M', 'Multicolor', 11, NULL),
(49, 'L', 'Multicolor',  5, NULL),
-- Producto 50 — Buzo deportivo  (variants 148-150)
(50, 'S', 'Negro', 11, NULL),
(50, 'M', 'Negro', 16, NULL),
(50, 'M', 'Azul',   7, NULL);

-- =============================================================
-- VENTAS (id 1-40) + ITEMS
-- Regla: total_amount = SUM(quantity * unit_price) por venta
-- unit_price = sale_price del producto al momento de la venta
-- =============================================================

-- Venta 1 — 2024-03-25 | total: 2×6500 + 1×14900 = 27900
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-03-25 10:15:00', 27900.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(1, 2,  2,  6500.00),  -- Remera básica negro M
(1, 31, 1, 14900.00);  -- Jean skinny azul 38

-- Venta 2 — 2024-04-05 | total: 1×17000 = 17000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-04-05 14:30:00', 17000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(2, 55, 1, 17000.00);  -- Vestido midi floral blanco S

-- Venta 3 — 2024-04-18 | total: 1×8200 + 1×7000 = 15200
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-04-18 11:00:00', 15200.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(3, 4,   1,  8200.00),  -- Remera oversize gris S
(3, 112, 1,  7000.00);  -- Cinturón marrón

-- Venta 4 — 2024-05-02 | total: 1×24000 = 24000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-05-02 16:45:00', 24000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(4, 76, 1, 24000.00);  -- Campera bomber negro S

-- Venta 5 — 2024-05-15 | total: 1×36000 + 1×19000 = 55000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-05-15 12:00:00', 55000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(5, 97,  1, 36000.00),  -- Botas cuero marrón 37
(5, 109, 1, 19000.00);  -- Cartera camel

-- Venta 6 — 2024-06-03 | total: 2×7000 + 1×13000 = 27000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-06-03 10:30:00', 27000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(6, 7,  2,  7000.00),  -- Remera estampada blanco S
(6, 64, 1, 13000.00);  -- Vestido playero blanco S

-- Venta 7 — 2024-06-20 | total: 1×17000 + 1×5600 = 22600
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-06-20 15:15:00', 22600.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(7, 136, 1, 17000.00),  -- Hoodie negro S
(7, 115, 1,  5600.00);  -- Gorro gris

-- Venta 8 — 2024-07-01 | total: 1×16500 = 16500
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-07-01 09:00:00', 16500.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(8, 34, 1, 16500.00);  -- Jean wide leg azul 38

-- Venta 9 — 2024-07-14 | total: 1×24000 + 1×19000 = 43000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-07-14 18:00:00', 43000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(9, 61,  1, 24000.00),  -- Vestido fiesta negro S
(9, 110, 1, 19000.00);  -- Cartera negro

-- Venta 10 — 2024-07-28 | total: 3×9000 = 27000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-07-28 11:45:00', 27000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(10, 13, 3, 9000.00);  -- Remera polo blanco S

-- Venta 11 — 2024-08-05 | total: 1×30000 = 30000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-08-05 14:00:00', 30000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(11, 82, 1, 30000.00);  -- Campera cuero negro S

-- Venta 12 — 2024-08-19 | total: 2×6500 + 2×5800 + 1×6400 = 31400
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-08-19 10:00:00', 31400.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(12, 1,   2,  6500.00),  -- Remera básica negro S
(12, 22,  2,  5800.00),  -- Remera crop negro XS
(12, 118, 1,  6400.00);  -- Bufanda gris

-- Venta 13 — 2024-09-02 | total: 1×30000 + 1×28000 = 58000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-09-02 16:30:00', 58000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(13, 94,  1, 30000.00),  -- Zapatillas blanco 37
(13, 103, 1, 28000.00);  -- Sneakers blanco 37

-- Venta 14 — 2024-09-16 | total: 1×11000 + 1×7000 = 18000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-09-16 12:30:00', 18000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(14, 40, 1, 11000.00),  -- Pantalón palazzo negro S
(14, 7,  1,  7000.00);  -- Remera estampada blanco S

-- Venta 15 — 2024-09-30 | total: 1×27000 = 27000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-09-30 17:00:00', 27000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(15, 88, 1, 27000.00);  -- Campera puffer negro S

-- Venta 16 — 2024-10-08 | total: 2×9000 + 2×10400 = 38800
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-10-08 11:15:00', 38800.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(16, 124, 2,  9000.00),  -- Pack bombachas nude S
(16, 127, 2, 10400.00);  -- Pack corpiños nude S

-- Venta 17 — 2024-10-22 | total: 1×15600 + 1×14400 = 30000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-10-22 14:00:00', 30000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(17, 49,  1, 15600.00),  -- Jean mom azul 38
(17, 139, 1, 14400.00);  -- Buzo universitario azul S

-- Venta 18 — 2024-11-04 | total: 1×21000 = 21000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-11-04 10:00:00', 21000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(18, 70, 1, 21000.00);  -- Vestido blazer negro S

-- Venta 19 — 2024-11-18 | total: 2×9600 + 1×16000 = 35200
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-11-18 15:30:00', 35200.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(19, 28, 2,  9600.00),  -- Remera oversize estampada negro S
(19, 85, 1, 16000.00);  -- Campera rompevientos negro S

-- Venta 20 — 2024-12-02 | total: 1×36000 + 1×30000 = 66000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-12-02 13:00:00', 66000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(20, 97, 1, 36000.00),  -- Botas cuero marrón 37
(20, 82, 1, 30000.00);  -- Campera cuero negro S

-- Venta 21 — 2024-12-16 | total: 2×24000 + 2×19000 = 86000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-12-16 19:00:00', 86000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(21, 61,  2, 24000.00),  -- Vestido fiesta negro S
(21, 109, 2, 19000.00);  -- Cartera camel

-- Venta 22 — 2024-12-28 | total: 1×17000 + 1×13000 + 1×18000 = 48000
INSERT INTO sales (sale_date, total_amount) VALUES ('2024-12-28 12:30:00', 48000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(22, 136, 1, 17000.00),  -- Hoodie negro S
(22, 142, 1, 13000.00),  -- Buzo cropped negro XS
(22, 145, 1, 18000.00);  -- Hoodie tie dye multicolor S

-- Venta 23 — 2025-01-10 | total: 2×8200 = 16400
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-01-10 10:00:00', 16400.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(23, 4, 2, 8200.00);  -- Remera oversize gris S

-- Venta 24 — 2025-01-24 | total: 1×19000 + 1×14000 = 33000
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-01-24 15:00:00', 33000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(24, 79, 1, 19000.00),  -- Campera denim azul S
(24, 43, 1, 14000.00);  -- Jean recto azul 38

-- Venta 25 — 2025-02-07 | total: 1×18000 + 1×13000 = 31000
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-02-07 11:30:00', 31000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(25, 100, 1, 18000.00),  -- Sandalias negro 37
(25, 64,  1, 13000.00);  -- Vestido playero blanco S

-- Venta 26 — 2025-02-21 | total: 3×8000 = 24000
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-02-21 09:30:00', 24000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(26, 130, 3, 8000.00);  -- Calzoncillo blanco S

-- Venta 27 — 2025-03-07 | total: 1×22000 + 1×10400 = 32400
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-03-07 14:15:00', 32400.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(27, 91, 1, 22000.00),  -- Campera collegiate gris S
(27, 52, 1, 10400.00);  -- Jogger felpa gris S

-- Venta 28 — 2025-03-21 | total: 2×8400 + 1×18000 = 34800
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-03-21 16:00:00', 34800.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(28, 25, 2,  8400.00),  -- Remera tie dye multicolor S
(28, 67, 1, 18000.00);  -- Vestido lencero beige S

-- Venta 29 — 2025-04-04 | total: 1×25000 + 1×7000 = 32000
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-04-04 10:45:00', 32000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(29, 106, 1, 25000.00),  -- Mocasines negro 37
(29, 112, 1,  7000.00);  -- Cinturón marrón

-- Venta 30 — 2025-04-18 | total: 1×15600 + 2×7200 = 30000
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-04-18 12:00:00', 30000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(30, 148, 1, 15600.00),  -- Buzo deportivo negro S
(30, 16,  2,  7200.00);  -- Remera deportiva negro S

-- Venta 31 — 2025-05-02 | total: 1×13600 + 1×8200 = 21800
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-05-02 13:30:00', 21800.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(31, 37, 1, 13600.00),  -- Pantalón cargo verde 38
(31, 4,  1,  8200.00);  -- Remera oversize gris S

-- Venta 32 — 2025-06-15 | total: 1×14400 + 1×11000 = 25400
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-06-15 17:00:00', 25400.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(32, 58,  1, 14400.00),  -- Vestido camisero azul S
(32, 121, 1, 11000.00);  -- Bolso tote natural

-- Venta 33 — 2025-08-20 | total: 1×27000 = 27000
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-08-20 10:00:00', 27000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(33, 88, 1, 27000.00);  -- Campera puffer negro S

-- Venta 34 — 2025-11-10 | total: 3×6500 + 2×14900 = 49300
INSERT INTO sales (sale_date, total_amount) VALUES ('2025-11-10 14:30:00', 49300.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(34, 1,  3,  6500.00),  -- Remera básica negro S
(34, 31, 2, 14900.00);  -- Jean skinny azul 38

-- Venta 35 — 2026-01-15 | total: 2×17000 + 1×28000 = 62000
INSERT INTO sales (sale_date, total_amount) VALUES ('2026-01-15 11:00:00', 62000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(35, 136, 2, 17000.00),  -- Hoodie negro S
(35, 103, 1, 28000.00);  -- Sneakers blanco 37

-- Venta 36 — 2026-02-28 | total: 1×24000 + 1×30000 = 54000
INSERT INTO sales (sale_date, total_amount) VALUES ('2026-02-28 15:30:00', 54000.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(36, 61, 1, 24000.00),  -- Vestido fiesta negro S
(36, 82, 1, 30000.00);  -- Campera cuero negro S

-- Venta 37 — 2026-03-15 | total: 1×12400 + 2×7000 = 26400
INSERT INTO sales (sale_date, total_amount) VALUES ('2026-03-15 10:15:00', 26400.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(37, 46, 1, 12400.00),  -- Pantalón chino beige 38
(37, 7,  2,  7000.00);  -- Remera estampada blanco S

-- Venta 38 — 2026-04-01 | total: 1×30000 + 1×5600 = 35600
INSERT INTO sales (sale_date, total_amount) VALUES ('2026-04-01 12:00:00', 35600.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(38, 94,  1, 30000.00),  -- Zapatillas blanco 37
(38, 115, 1,  5600.00);  -- Gorro gris

-- Venta 39 — 2026-04-20 | total: 1×18000 + 1×15600 = 33600
INSERT INTO sales (sale_date, total_amount) VALUES ('2026-04-20 16:00:00', 33600.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(39, 145, 1, 18000.00),  -- Hoodie tie dye multicolor S
(39, 73,  1, 15600.00);  -- Vestido mini rayas blanco S

-- Venta 40 — 2026-05-05 | total: 1×16500 + 1×19000 + 2×6500 = 48500
INSERT INTO sales (sale_date, total_amount) VALUES ('2026-05-05 11:30:00', 48500.00);
INSERT INTO sale_items (sale_id, product_variant_id, quantity, unit_price) VALUES
(40, 34,  1, 16500.00),  -- Jean wide leg azul 38
(40, 109, 1, 19000.00),  -- Cartera camel
(40, 1,   2,  6500.00);  -- Remera básica negro S
