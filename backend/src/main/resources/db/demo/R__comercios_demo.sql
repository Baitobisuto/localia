-- Solo perfil local. Son ejemplos ficticios: no representan negocios reales.
INSERT INTO comercio (municipio_id, categoria_id, nombre, slug, descripcion, destacado, demo)
SELECT m.id, c.id, d.nombre, d.slug, d.descripcion, d.destacado, TRUE
FROM (VALUES
 ('Mesa de barrio · Demo', 'mesa-de-barrio-demo', 'restauracion', 'Un ejemplo ficticio de restaurante de barrio, con una mesa para cada encuentro. Así podría verse un negocio en Localia.', TRUE),
 ('Flor y hoja · Demo', 'flor-y-hoja-demo', 'tiendas', 'Una floristería imaginaria para descubrir el directorio. Sus datos e ilustraciones son únicamente de demostración.', TRUE),
 ('Estudio Calma · Demo', 'estudio-calma-demo', 'belleza', 'Un espacio ficticio de cuidado personal. Una muestra de cómo presentar un pequeño negocio con claridad y cercanía.', TRUE),
 ('Taller a mano · Demo', 'taller-a-mano-demo', 'hogar-y-reparaciones', 'Un taller imaginario de reparaciones. Ejemplo de desarrollo sin dirección ni datos de contacto reales.', FALSE)
) AS d(nombre, slug, categoria, descripcion, destacado)
JOIN categoria c ON c.slug = d.categoria
CROSS JOIN municipio m WHERE m.slug = 'el-molar'
ON CONFLICT (municipio_id, slug) DO NOTHING;
INSERT INTO imagen_comercio (comercio_id, url, texto_alternativo, orden)
SELECT id, CASE slug
 WHEN 'mesa-de-barrio-demo' THEN '/images/restaurante.svg'
 WHEN 'flor-y-hoja-demo' THEN '/images/flores.svg'
 WHEN 'estudio-calma-demo' THEN '/images/belleza.svg'
 ELSE '/images/taller.svg' END,
 'Ilustración de demostración; no es una fotografía del negocio', 0
FROM comercio c WHERE demo AND NOT EXISTS (SELECT 1 FROM imagen_comercio i WHERE i.comercio_id = c.id);
