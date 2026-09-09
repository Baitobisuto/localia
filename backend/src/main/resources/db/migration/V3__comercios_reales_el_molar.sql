-- V3__comercios_reales_el_molar.sql
-- Primer lote de comercios reales de El Molar.
-- Datos consultados/revisados el 2026-09-09.
-- No se incluyen fotografías ni horarios en esta migración.
-- Los textos descriptivos son propios y deliberadamente neutros.
-- Las fuentes se guardan en fuente_comercio para mantener trazabilidad.

-- Oculta los comercios de demostración sin borrar el histórico.
UPDATE comercio
SET activo = FALSE
WHERE demo = TRUE;

-- 1. Aerenisa Salón de Belleza
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Aerenisa Salón de Belleza',
    'aerenisa-salon-de-belleza',
    'Salón de peluquería y estética ubicado en El Molar.',
    'C/ Real, 15',
    '28710',
    '918411836',
    NULL,
    'aerenisa@aerenisa.es',
    'https://www.aerenisa.es/',
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Aerenisa%20Salon%20de%20Belleza%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'belleza'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'AYUNTAMIENTO',
       'https://elmolar.org/noticias/comercios-este-verano-comprar-en-el-molar-tiene-premio/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'aerenisa-salon-de-belleza'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'WEB_OFICIAL',
       'https://www.aerenisa.es/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'aerenisa-salon-de-belleza'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 2. Autorecambios Hernández S.L.
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Autorecambios Hernández S.L.',
    'autorecambios-hernandez',
    'Establecimiento de recambios y accesorios para automóvil en El Molar.',
    'Av. de España, 44',
    '28710',
    '918440357',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Autorecambios%20Hernandez%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'motor'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'AYUNTAMIENTO',
       'https://elmolar.org/noticias/comercios-este-verano-comprar-en-el-molar-tiene-premio/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'autorecambios-hernandez'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'OTRO',
       'https://www.paginasamarillas.es/f/el-molar/autorecambios-hernandez-s-l-_234698074_000000001.html',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'autorecambios-hernandez'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 3. Farmacia Real
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Farmacia Real',
    'farmacia-real',
    'Farmacia situada en el centro de El Molar.',
    'C/ Real, 20',
    '28710',
    '918412226',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Farmacia%20Real%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'salud'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'AYUNTAMIENTO',
       'https://elmolar.org/noticias/comercios-este-verano-comprar-en-el-molar-tiene-premio/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'farmacia-real'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'GOOGLE_MAPS',
       'https://www.google.com/maps/search/?api=1&query=Farmacia%20Real%20El%20Molar',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'farmacia-real'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 4. Mesón Elcano
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Mesón Elcano',
    'meson-elcano',
    'Restaurante y bar situado en la Plaza Mayor de El Molar.',
    'Pl. Mayor, 5',
    '28710',
    '918440333',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Meson%20Elcano%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'restauracion'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'AYUNTAMIENTO',
       'https://elmolar.org/noticias/comercios-este-verano-comprar-en-el-molar-tiene-premio/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'meson-elcano'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'GOOGLE_MAPS',
       'https://www.google.com/maps/search/?api=1&query=Meson%20Elcano%20El%20Molar',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'meson-elcano'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 5. Restaurante El Puntito
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Restaurante El Puntito',
    'restaurante-el-puntito',
    'Restaurante ubicado en El Molar.',
    'C/ la Salud, 1',
    '28710',
    '918412086',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Restaurante%20El%20Puntito%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'restauracion'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'GOOGLE_MAPS',
       'https://www.google.com/maps/search/?api=1&query=Restaurante%20El%20Puntito%20El%20Molar',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'restaurante-el-puntito'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 6. Ferretería El Molar
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Ferretería El Molar',
    'ferreteria-el-molar',
    'Ferretería local situada en la Avenida de España.',
    'Av. de España, 50',
    '28710',
    '918410580',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Ferreteria%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'hogar-y-reparaciones'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'GOOGLE_MAPS',
       'https://www.google.com/maps/search/?api=1&query=Ferreteria%20El%20Molar',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'ferreteria-el-molar'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 7. Taller Ruedas
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Taller Ruedas',
    'taller-ruedas',
    'Taller del sector del automóvil ubicado en El Molar.',
    'Av. de Madrid, 66',
    '28710',
    '660968472',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Taller%20Ruedas%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'motor'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'GOOGLE_MAPS',
       'https://www.google.com/maps/search/?api=1&query=Taller%20Ruedas%20El%20Molar',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'taller-ruedas'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 8. Taller Miguel
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Taller Miguel',
    'taller-miguel',
    'Taller mecánico ubicado en El Molar.',
    'C/ Tejera Vieja, 11',
    '28710',
    '918410691',
    NULL,
    NULL,
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Taller%20Miguel%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'motor'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'GOOGLE_MAPS',
       'https://www.google.com/maps/search/?api=1&query=Taller%20Miguel%20El%20Molar',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'taller-miguel'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 9. Peluquería Roxy
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Peluquería Roxy',
    'peluqueria-roxy',
    'Peluquería y centro de cuidado capilar situado en El Molar.',
    'Av. de España, 4',
    '28710',
    '682515520',
    NULL,
    'omarroxy@hotmail.com',
    'https://peluqueria-roxy7.webnode.es/',
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Peluqueria%20Roxy%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'belleza'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'WEB_OFICIAL',
       'https://peluqueria-roxy7.webnode.es/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'peluqueria-roxy'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'AYUNTAMIENTO',
       'https://elmolar.org/municipio/directorio-de-comercios/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'peluqueria-roxy'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');


-- 10. Peluquería Rocío
INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT
    m.id, c.id,
    'Peluquería Rocío',
    'peluqueria-rocio',
    'Peluquería situada en El Molar.',
    'C/ Santa María, 4',
    '28710',
    '636461856',
    NULL,
    'pelurocio38@gmail.com',
    NULL,
    NULL,
    'https://www.google.com/maps/search/?api=1&query=Peluqueria%20Rocio%20El%20Molar',
    FALSE, TRUE, FALSE, TRUE, DATE '2026-09-09'
FROM municipio m
JOIN categoria c ON c.slug = 'belleza'
WHERE m.slug = 'el-molar';

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'AYUNTAMIENTO',
       'https://elmolar.org/municipio/directorio-de-comercios/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'peluqueria-rocio'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');

INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT id, 'OTRO',
       'https://mispelus.com/peluqueria-rocio-el-molar/',
       DATE '2026-09-09'
FROM comercio WHERE slug = 'peluqueria-rocio'
AND municipio_id = (SELECT id FROM municipio WHERE slug = 'el-molar');
