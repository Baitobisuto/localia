# SEO local de Localia

Revisión del código y validación local: 12 de septiembre de 2026. No se ha desplegado esta revisión ni modificado Vercel, Search Console, el backend, los datos o las migraciones. La lectura de la web pública desde este entorno falló y el navegador integrado no pudo conectarse; no se certifica el estado del despliegue actual ni su presentación visual.

## 1. Diagnóstico

Next.js 16.3.4 con **App Router**. Portada, buscador y fichas son Server Components. Solo el error recuperable es un componente cliente. Los formularios usan GET y las tarjetas usan enlaces HTML. La capa única `lib/api.ts` consulta Spring Boot con `fetch`, `no-store` y timeout de ocho segundos; React comparte las consultas de detalle y catálogos durante el render. No hay contenido comercial que dependa de una petición desde el navegador.

La API publica municipios y categorías activos, resúmenes de comercios y detalles municipales o por slug. El backend oculta negocios inactivos y los de municipios/categorías inactivos. No existe una entidad ni un filtro separado para profesionales: se reutiliza la categoría `servicios-profesionales`. No se cambian contratos.

Ya existían `robots.txt`, sitemap dinámico, metadataBase, canonical municipal, Open Graph, Twitter, imagen social propia, H1 y LocalBusiness. Faltaban landings locales limpias, breadcrumbs estructurados, WebSite/Organization, ItemList, criterios compartidos de contenido y enlaces hacia categorías indexables. El dominio usaba `SITE_URL` con fallback localhost; sin `INDEXABLE=true` se bloqueaban rastreo e indexación. No puede saberse desde el repositorio si esas variables estaban configuradas en Vercel.

El buscador generaba combinaciones por query. La portada solo mostraba destacados, aunque podía haber comercios publicados sin ninguno destacado. El estado de carga global emitía otro H1 y adelantaba un HTTP 200 antes de conocer fallos o ausencias de datos.

## 2. Archivos modificados

- `frontend/.env.example`: dominio, reglas de indexación y verificación opcional.
- `frontend/next.config.ts`: metadata sin streaming para tenerla en el head del HTML completo.
- `frontend/next-env.d.ts`: regenerado por Next durante el build; referencias a tipos de producción.
- `frontend/src/lib/seo.ts`: dominio validado, política por entorno, criterio de ficha y schemas.
- `frontend/src/app/layout.tsx`: enlace municipal y verificación de Search Console.
- `frontend/src/app/page.tsx`: metadata/H1 local, enlaces a categorías disponibles, negocios reales aunque no haya destacados y schema del sitio.
- `frontend/src/app/comercios/page.tsx`: buscador noindex, canonical propio y enlace al índice municipal.
- `frontend/src/app/robots.ts` y `sitemap.ts`: reglas coordinadas con la publicación de páginas.
- `frontend/src/components/FichaComercio.tsx`: contenido mínimo, breadcrumbs, schema condicionado y enlaces locales disponibles.
- `README.md`: configuración y referencia a este informe.
- `frontend/src/app/loading.tsx` se **traslada** a `frontend/src/app/comercios/loading.tsx`: conserva la carga del buscador y deja esperar a las rutas SEO antes de enviar cabeceras. Ya no utiliza un H1.

## 3. Archivos creados

- `frontend/src/lib/seo-local.ts`: catálogo editorial compartido por portada, landings, fichas y sitemap; una carga por render, sin nueva capa HTTP.
- `frontend/src/components/JsonLd.tsx`: serialización segura, escapando `<`.
- `frontend/src/components/MigasPan.tsx`: breadcrumb accesible y BreadcrumbList derivados de los mismos elementos.
- `frontend/src/app/[municipioSlug]/page.tsx`: índice municipal con categorías y una muestra de negocios.
- `frontend/src/app/[municipioSlug]/comercios/page.tsx`: listado municipal completo.
- `frontend/src/app/[municipioSlug]/[categoriaSlug]/page.tsx`: categorías editoriales con contenido suficiente.
- `frontend/scripts/verificar-seo.mjs`: comprobaciones de configuración y HTTP contra el build, con fixtures exclusivamente de prueba y servidor en loopback.
- `docs/SEO.md`: este informe.

## 4. Páginas indexables

Siempre que la política del entorno permita indexar:

| Ruta | Condición y función |
|---|---|
| `/` | Portada del directorio, incluso mientras se inicia el catálogo |
| `/el-molar` | Al menos un negocio real con contenido útil; índice por categorías y muestra de tres negocios |
| `/el-molar/comercios` | Al menos un negocio real con contenido útil; listado completo |
| `/el-molar/{categoria}` | Categoría editorial activa con al menos dos negocios que superen el criterio de ficha |
| `/{municipio}/comercios/{slug}` | Ficha pública no demo con nombre, descripción no vacía y dirección o teléfono/WhatsApp válido |

La regla de dos negocios es una decisión editorial inicial de Localia, **no un umbral exigido por Google ni una garantía de calidad**. Se utiliza idéntica selección para la landing, sus enlaces y el sitemap. Una categoría insuficiente devuelve 404/noindex. No se publica una página de texto genérico vacía.

Las diez categorías del catálogo tienen una introducción específica y acotada. `restauracion` conserva su nombre amplio: no se transforma en restaurantes porque puede incluir bares. `motor` no se convierte en talleres y `hogar-y-reparaciones` no se convierte en fontaneros o electricistas. No se generan oficios inferidos a partir de palabras en nombres comerciales.

`/el-molar/profesionales` usa exclusivamente `servicios-profesionales`. Cuando tenga dos fichas útiles, se habilitará automáticamente; `/el-molar/servicios-profesionales` redirigirá entonces con 308 a `/el-molar/profesionales`. Antes, ambas devuelven 404. Los municipios adicionales no generan landings automáticamente: requieren revisión editorial, aunque sus fichas existentes siguen funcionando.

## 5. Páginas noindex

- `/comercios`, con o sin filtros: herramienta de búsqueda, fuera del sitemap. Se concentra el contenido indexable en el directorio municipal y sus categorías, evitando duplicar el listado general inicial.
- Todas las búsquedas por nombre, combinaciones de municipio/categoría, destacado/verificado, valores inválidos o parámetros repetidos: `noindex,follow`.
- Fichas demo y fichas sin descripción o ubicación/contacto útil: accesibles, `noindex,follow`, sin LocalBusiness ni sitemap.
- Rutas ausentes/categorías insuficientes: 404 y el noindex de Next.
- Vercel Preview y Development: noindex aunque `INDEXABLE=true`. Desarrollo local también. Fuera de Vercel solo permite índice una ejecución de producción con `INDEXABLE=true`.

No existen rutas de administración, cuentas ni endpoints privados en el frontend. Los recursos técnicos e imágenes no aparecen en sitemap. `robots.txt` permite rastrear assets y páginas noindex; bloquearlos impediría que Google leyera la directiva. No es un mecanismo de privacidad. Referencia: [canonicalización de Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## 6. Sitemap

Se consulta la API en cada petición y se incluyen solo URLs absolutas del origen configurado. Si la API falla se devuelve error, sin sustituirlo por un sitemap vacío. No hay `lastModified`: la API pública no expone fechas reales de actualización de página. `fechaVerificacion` y las fechas de fuentes no equivalen a modificación de contenido. No se añade la fecha del build o del día. [Criterios de Google para sitemap y lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Con el contenido de **V3**, suponiendo que esté aplicado y activo en la API, el sitemap esperado contiene 16 URLs, anteponiendo `NEXT_PUBLIC_SITE_URL`:

```text
/
/el-molar
/el-molar/comercios
/el-molar/restauracion
/el-molar/belleza
/el-molar/motor
/el-molar/comercios/aerenisa-salon-de-belleza
/el-molar/comercios/autorecambios-hernandez
/el-molar/comercios/farmacia-real
/el-molar/comercios/meson-elcano
/el-molar/comercios/restaurante-el-puntito
/el-molar/comercios/ferreteria-el-molar
/el-molar/comercios/taller-ruedas
/el-molar/comercios/taller-miguel
/el-molar/comercios/peluqueria-roxy
/el-molar/comercios/peluqueria-rocio
```

Es una previsión basada en la migración, no una lectura del sitemap desplegado. Hogar y salud tienen una ficha cada una; servicios profesionales no tiene fichas en V3. El resto de categorías tampoco alcanza el mínimo. En entornos noindex el sitemap queda vacío y robots no lo anuncia.

## 7. Canonical y duplicados

`NEXT_PUBLIC_SITE_URL` es el único origen. Se acepta HTTP(S), sin credenciales, ruta, query o fragmento; valores inválidos fallan explícitamente. El fallback está centralizado en `lib/seo.ts`.

Cada landing y ficha municipal tiene canonical propio, metadata social y description. Parámetros añadidos a una landing no alteran su contenido ni su canonical limpio. El alias `/comercios/{slug}` conserva su comportamiento y apunta a la ficha municipal, sin aparecer en el sitemap. La ambigüedad de slug mantiene el comportamiento de error existente.

Las búsquedas tienen canonical propio con query ordenada y noindex. **No** se señalan como equivalentes a una landing: el buscador puede mostrar registros con poco contenido, demos y filtros adicionales que la landing excluye. Tampoco se redirige al usuario, para conservar los filtros. La exclusión evita indexar búsquedas; no se usa para consolidar los alias de fichas, que ya tienen canonical municipal. Los enlaces editoriales apuntan directamente a las landings disponibles. [Señales de canonical y enlaces internos según Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## 8. Datos estructurados, semántica y rendimiento

- Home: `WebSite` y `Organization` describen Localia como directorio/editor. No se le atribuye dirección, teléfono ni LocalBusiness.
- Índice municipal, categorías y listado: `ItemList` enumera solo las tarjetas que realmente aparecen, en el mismo orden.
- Landings y fichas: `BreadcrumbList` coincide con la navegación visible; `nav` etiquetado y página actual identificada.
- Fichas: `LocalBusiness` genérico solo si supera el criterio de contenido, tiene dirección y una fuente con URL pública. No se infiere un subtipo por categoría. No se genera `Service` sin una oferta de servicio específica documentada. No se inventan precios, reseñas, valoraciones, contactos ni horarios. [Requisitos de LocalBusiness de Google](https://developers.google.com/search/docs/appearance/structured-data/local-business).

Se mantienen el `main` único, un H1 por documento, H2 para secciones, H3 para tarjetas y `article` en cada tarjeta. Las imágenes decorativas de tarjeta tienen alt vacío; las de ficha conservan el texto alternativo o el aviso de placeholder. Las dimensiones ya estaban declaradas, la imagen principal priorizada y las fuentes eran del sistema: no se añaden fuentes, librerías ni JavaScript de cliente.

Se desactiva el streaming de metadata con `htmlLimitedBots: /.*/` para entregar metadata en el head también a navegadores. El loading automático queda en el buscador; las rutas canónicas esperan el render y se han probado con HTTP 404 y 500 reales. Aumenta potencialmente el tiempo inicial si la API es lenta. Se conserva `no-store`; no se añade una caché que pueda mantener negocios retirados publicados. El catálogo se comparte por render mediante `cache` de React.

Las imágenes actuales son SVG locales propios. La configuración global `unoptimized` existente no supone recomprimir esos SVG; se mantiene. Si se incorporan fotografías autorizadas, será necesario evaluar tamaños, formatos, dominios remotos permitidos y optimización. No se han medido Core Web Vitals de campo ni se afirma una mejora de LCP/CLS sin medición.

## 9. Configuración manual de Vercel

1. En **Production**, configurar `NEXT_PUBLIC_SITE_URL=https://localia-ten-bice.vercel.app` hasta disponer del dominio definitivo. Retirar `SITE_URL`, que ya no se utiliza.
2. Revisar `INDEXABLE`: si queda `false` de una configuración anterior, producción seguirá bloqueada. Establecer `true` o eliminarla únicamente tras revisar el catálogo. El código habilita Vercel Production por defecto, pero respeta ese bloqueo explícito.
3. Configurar `API_URL` con el endpoint del backend público de producción, incluyendo `/api`, accesible desde las funciones de Vercel. Mantener datos demo fuera de producción.
4. Para verificar la propiedad de prefijo de URL, copiar solo el valor `content` del meta tag de Google en `GOOGLE_SITE_VERIFICATION`. No copiar la etiqueta completa. También puede utilizarse otro método de verificación admitido.
5. Hacer un **nuevo build/despliegue** después de cambiar dominio, entorno o verificación. `NEXT_PUBLIC_*` se incorpora al build y robots es una ruta prerenderizada. Revisar HTML/cabeceras públicos después: sin noindex accidental ni bloqueo de acceso en producción.
6. Mantener previews fuera del índice y evitar que apunten a bases con datos demo mezclados con producción. No habilitar servicios externos desde el código.

## 10. Google Search Console y cambio de dominio

Para el dominio Vercel, crear la propiedad de **prefijo de URL** exacta y verificarla con el meta tag anterior o un archivo HTML de Google colocado en `frontend/public`. Con dominio propio, se puede utilizar propiedad de dominio mediante DNS. [Métodos de verificación](https://support.google.com/webmasters/answer/9008080).

Tras desplegar, enviar `/sitemap.xml`; inspeccionar la home, el índice municipal, una categoría y una ficha. Usar la prueba en vivo para comprobar respuesta, contenido renderizado, permisos de indexación y canonical. Solicitar indexación de unas pocas páginas importantes y revisar posteriormente indexación, errores de servidor, canonical elegido, rendimiento por consultas locales y Core Web Vitals. Validar una ficha con Rich Results Test y los schemas con Schema Markup Validator. No se implementa Google Indexing API.

Al conectar el dominio definitivo:

1. Configurar DNS y HTTPS en Vercel; elegir un único host preferido.
2. Cambiar `NEXT_PUBLIC_SITE_URL` y volver a desplegar. Canonical, metadataBase, Open Graph/Twitter, sitemap, robots y JSON-LD obtendrán el nuevo origen automáticamente.
3. Configurar redirección permanente del host anterior al nuevo, **conservando cada ruta**, cuando el alojamiento permita redirigir ese dominio. Comprobar ficha→misma ficha, categoría→misma categoría, sin cadenas ni redirección masiva a home. El código no activa todavía una redirección a un dominio desconocido.
4. Verificar ambas propiedades en Search Console; enviar el sitemap nuevo y usar Cambio de dirección si el traslado es compatible con la herramienta. Conservar redirecciones al menos un año, siguiendo la guía de Google.
5. Comprobar enlaces, imágenes sociales, cabeceras y evolución del tráfico y la indexación en ambas propiedades. [Guía de migración de Google](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## 11. Validación y riesgos pendientes

Comandos desde `frontend`, sin backend ni Docker para esta suite:

```powershell
$env:NEXT_PUBLIC_SITE_URL='https://localia-ten-bice.vercel.app'
$env:VERCEL_ENV='production'
$env:INDEXABLE='true'
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
node scripts/verificar-seo.mjs
```

En otra plataforma, usar `npm` y la sintaxis correspondiente de variables de entorno. La suite requiere un build previo con el mismo dominio y modo de producción. Crea y cierra sus propios procesos en puertos locales disponibles; las fixtures no se importan desde `src`, no son un fallback de API y no escriben en base de datos.

Comprobado: lint, TypeScript, build, política de siete entornos, cambio de origen, rechazo de URLs inválidas, sitemap exacto, metadata única por página, canonical en head, HTML con nombres sin ejecutar JS, un H1, enlaces internos, JSON-LD parseable, alias, 308, categorías insuficientes/404, demos y fichas sin descripción excluidas, catálogo vacío y API caída con 500 en rutas SEO.

Pendiente después del despliegue:

- Confirmar datos y disponibilidad del backend real. Los diez registros se han leído de V3; **esta tarea no revalida sus fuentes ni contactos**. Algunas fuentes son URLs de búsqueda de Maps, por lo que conviene reforzar la evidencia con fuentes oficiales. La marca de verificación sigue sin ser certificación de calidad.
- Confirmar los 16 enlaces esperados frente a la API realmente desplegada. Los filtros son operativos pero no posicionables; las categorías con menos de dos fichas no ofrecen landing hasta que crezca el catálogo real.
- Revisar visualmente móvil/escritorio, medir rendimiento real y validar en herramientas de Google. El navegador integrado falló por configuración del entorno; la suite HTTP no sustituye la revisión visual.
- Supervisar latencia, disponibilidad y volumen: el catálogo actual es pequeño y sin paginación. Las fichas consultan también el catálogo para enlazar únicamente landings disponibles. Una ampliación grande requerirá revisar ese coste y el tamaño del sitemap.
- La existencia de metadata y schema no garantiza indexación, posicionamiento ni resultados enriquecidos. La cobertura real, la calidad y trazabilidad del contenido y la estabilidad del servicio siguen siendo determinantes.
