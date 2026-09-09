INSERT INTO municipio (nombre, slug) VALUES ('Municipio de prueba', 'otro');
INSERT INTO comercio (municipio_id, categoria_id, nombre, slug, destacado, verificado, fecha_verificacion, demo)
SELECT m.id, c.id, 'Café de prueba', 'cafe-prueba', TRUE, TRUE, DATE '2026-01-15', TRUE
FROM municipio m, categoria c WHERE m.slug='el-molar' AND c.slug='restauracion';
INSERT INTO comercio (municipio_id, categoria_id, nombre, slug, demo)
SELECT m.id, c.id, 'Salud de prueba', 'compartido', TRUE
FROM municipio m, categoria c WHERE m.slug='el-molar' AND c.slug='salud';
INSERT INTO comercio (municipio_id, categoria_id, nombre, slug, demo)
SELECT m.id, c.id, 'Tienda de prueba', 'compartido', TRUE
FROM municipio m, categoria c WHERE m.slug='otro' AND c.slug='tiendas';
INSERT INTO comercio (municipio_id, categoria_id, nombre, slug, activo, demo)
SELECT m.id, c.id, 'Oculto', 'oculto', FALSE, TRUE
FROM municipio m, categoria c WHERE m.slug='el-molar' AND c.slug='tiendas';
INSERT INTO horario_comercio (comercio_id, dia_semana, hora_apertura, hora_cierre)
SELECT id, 1, TIME '09:00', TIME '14:00' FROM comercio WHERE slug='cafe-prueba';
INSERT INTO imagen_comercio (comercio_id, url, texto_alternativo)
SELECT id, '/images/restaurante.svg', 'Ilustración de prueba' FROM comercio WHERE slug='cafe-prueba';
INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'OTRO', 'https://example.com/datos-de-test', DATE '2026-01-15' FROM comercio WHERE slug='cafe-prueba';
