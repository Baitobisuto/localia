# Validación del MVP · 9 de septiembre de 2026

- Backend: Java 21, `mvnw.cmd verify` correcto. **17 pruebas, 0 fallos, 0 errores, 0 omitidas**; PostgreSQL 17 real mediante Testcontainers.
- Esquema: Flyway crea una base vacía y Hibernate la valida. En la base local se verificaron V1, V2 y la migración repetible de demos, todas correctas. Cuatro comercios ficticios, todos `demo=true`, ninguno verificado.
- API: siete rutas públicas, búsqueda, filtros individuales y combinados, valores false, fichas, 404, slug ambiguo, entradas inválidas, rechazo de escritura y CORS comprobados.
- Frontend: instalación sin vulnerabilidades reportadas por npm; `npm.cmd run lint`, `npm.cmd run typecheck` y `npm.cmd run build` correctos. Cero advertencias de lint.
- Integración en Edge sin ventana: portada, destacados, búsqueda por nombre, categoría y municipio, filtro de revisión, estado vacío, ficha municipal, alias y ficha inexistente. Sin errores JavaScript durante la navegación normal.
- Responsive: portada, listado y ficha comprobados a 390 px, sin desbordamiento horizontal. Acceso por teclado al enlace de salto al contenido.
- SEO: canonical municipal, demos con noindex y sin LocalBusiness, robots bloqueado en local, sitemap sin demos y tarjeta Open Graph PNG comprobados por HTTP.
- Fallo de API: se probó desconexión y reintento. Se corrigió la retención de la respuesta fallida sustituyendo el reset de segmento por recarga de página. Recuperación verificada tras restaurar la conexión a la API real mediante un proxy local temporal.

Capturas: [portada de escritorio](portada-desktop.png), [portada móvil](portada-mobile.png), [ficha de escritorio](ficha-desktop.png), [ficha móvil](ficha-mobile.png), [directorio móvil](directorio-mobile.png), [API no disponible](error-api.png).

El navegador integrado no pudo inicializarse por un fallo de configuración de la herramienta. La revisión visual se completó con Playwright y el Edge ya instalado, sin añadir dependencias al producto. No es una auditoría exhaustiva WCAG ni una prueba de carga.

Pendiente de contenido: negocios reales, sus fuentes y fotografías autorizadas. No se ha desplegado ni contratado ningún servicio externo.
