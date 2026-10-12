-- Nuevas fichas con evidencia oficial consultada el 2026-10-12.
-- No incluye fotografías: no se ha comprobado ninguna imagen con permiso de reutilización.
-- No modificar V3: Flyway aplicará esta migración una sola vez.
-- Se usa la categoría existente "tiendas" para evitar alterar el catálogo de categorías.

INSERT INTO comercio (
    municipio_id, categoria_id, nombre, slug, descripcion, direccion, codigo_postal,
    telefono, whatsapp, email, web, instagram, google_maps_url,
    destacado, activo, demo, verificado, fecha_verificacion
)
SELECT m.id, cat.id, v.nombre, v.slug, v.descripcion, v.direccion, '28710',
       v.telefono, NULL, NULL, v.web, NULL, NULL,
       FALSE, TRUE, FALSE, TRUE, DATE '2026-10-12'
FROM (VALUES
    ('Supermercado DIA El Molar', 'supermercado-dia-el-molar',
     'Supermercado DIA situado en la calle Ramón Gabriel de El Molar.',
     'C/ Ramón Gabriel, 26', NULL::varchar,
     'https://www.dia.es/tiendas/buscador-tiendas/madrid/molar-el/28710/9032'),
    ('BM Urban El Molar', 'bm-urban-el-molar',
     'Supermercado BM Urban situado en la avenida de España de El Molar.',
     'Av. de España, 66', '910772891',
     'https://www.bmsupermercados.es/tienda-14290.htm')
) AS v(nombre, slug, descripcion, direccion, telefono, web)
JOIN municipio m ON m.slug = 'el-molar'
JOIN categoria cat ON cat.slug = 'tiendas'
WHERE NOT EXISTS (
    SELECT 1 FROM comercio c
    WHERE c.municipio_id = m.id AND c.slug = v.slug
);

-- Registrar la procedencia sin inventar datos ni duplicar fuentes.
INSERT INTO fuente_comercio (comercio_id, tipo_fuente, url, fecha_consulta)
SELECT c.id, 'WEB_OFICIAL', c.web, DATE '2026-10-12'
FROM comercio c
JOIN municipio m ON m.id = c.municipio_id
WHERE m.slug = 'el-molar'
  AND c.slug IN ('supermercado-dia-el-molar','bm-urban-el-molar')
  AND c.web IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM fuente_comercio f
      WHERE f.comercio_id = c.id AND f.tipo_fuente = 'WEB_OFICIAL' AND f.url = c.web
  );

-- El antiguo Hiber de Av. de España 66 se publica bajo la marca BM Urban actual.
-- NO crear otro registro de "Supermercados Hiber" en la misma dirección.
