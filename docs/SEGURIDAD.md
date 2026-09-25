# Auditoría de seguridad y hardening de ProxiMolar

Fecha: 25 de septiembre de 2026. Base revisada: `d95058d`, con árbol de trabajo inicialmente limpio. Cambios locales, sin despliegue ni modificaciones en Railway o DNS.

## 1. Hallazgos y riesgo

| Riesgo | Hallazgo | Resultado |
|---|---|---|
| Alto (disponibilidad) | `https://www.proximolar.es` no acepta conexiones en 443. | Confirmado desde fuera del aislamiento. Pendiente de DNS, Custom Domain y TLS. |
| Medio | `www` apunta por CNAME a `parkingsrv0.dondominio.com`; HTTP responde Apache, redirige y crea `PHPSESSID`. | Es infraestructura del proveedor del dominio, no Next.js. No se modifica esa cookie en código. |
| Medio | Producción no enviaba CSP ni protección explícita contra clickjacking. | CSP parcial en enforcement y CSP completa en observación. El bloqueo de scripts queda pendiente de la segunda fase. |
| Medio | Envío HTTP a Resend sin timeout: una conexión lenta podía retener un hilo del backend indefinidamente. | Timeout de conexión de 5 segundos y de petición de 10 segundos. La solicitud guardada conserva el comportamiento previo si falla la notificación. |
| Medio | Los POST de solicitudes son anónimos y no hay límite de frecuencia en el código. | Riesgo residual de spam, consumo de base de datos/correo y denegación de servicio. Honeypot y validación no equivalen a rate limiting. Revisar límites y protección en el punto de entrada; no se ha añadido un contador en memoria ni un servicio externo. |
| Bajo | `application-local.yaml` no estaba ignorado, aunque README afirmaba que sí. | Se ignoran las variantes YAML/YML/properties locales. No se encontró una credencial real versionada en la revisión del árbol actual. |
| Hardening | Faltaban HSTS, nosniff, Referrer-Policy y Permissions-Policy. | Añadidas en frontend; defensas adecuadas a JSON en backend. HSTS no incluye subdominios. |
| Hardening | Errores Spring ya ocultaban mensajes y trazas, pero varios valores dependían del valor por defecto. | Se explicitan la exclusión de errores de binding y excepciones y se desactiva la página Whitelabel. |
| Bajo | La prueba SEO esperaba noindex en `/comercios`, contradiciendo el último commit. | Se actualiza la prueba, sin cambiar el comportamiento SEO de la aplicación. |

No se ha identificado un hallazgo crítico en el alcance revisado. Esto no es una garantía de ausencia de vulnerabilidades ni una prueba de carga o pentest exhaustivo.

## 2. Auditoría previa y separación de responsabilidades

### Frontend

- Next.js 16.3.4 / App Router, sin middleware/proxy ni rewrites propios. `poweredByHeader: false` ya estaba configurado. Se conserva.
- El catálogo se renderiza en servidor; alta, publicidad y privacidad tienen prerenderizado estático. Se conserva ese reparto.
- La única capa API es `src/lib/api.ts`, marcada `server-only`. `API_URL` tiene preferencia sobre la alternativa `NEXT_PUBLIC_API_URL`. No se incorporan URLs del backend a `connect-src`: el navegador se comunica con Next.js en su propio origen, y Node con Spring.
- No hay scripts de analítica, iframes, mapas embebidos, fuentes remotas, cámara, micrófono ni geolocalización. Fuentes del sistema y CSS local de Tailwind.
- Los scripts de Next/React y JSON-LD incluyen contenido inline. `JsonLd.tsx` escapa `<`, evitando el cierre de la etiqueta por datos externos.
- `next/image` usa `unoptimized: true`: no abre un proxy que descargue URLs arbitrarias en el servidor. Los recursos versionados son locales. El modelo permite imágenes HTTP(S) externas; la política en observación las señalará y no las bloqueará. Antes de enforcement hay que revisar también las imágenes existentes en la base de producción, que no se ha exportado ni inventariado desde Railway.
- Maps, WhatsApp, Instagram, webs y fuentes son enlaces de navegación. No necesitan permiso en `connect-src`, `script-src` ni `frame-src`.
- Existen formularios de solicitudes y Server Actions, además del buscador GET. Sin cookies propias, sesión o autenticación; sin credenciales de navegador. No se añaden funcionalidades ni endpoints de escritura nuevos.
- Se conserva la protección de origen y el límite de cuerpo por defecto de Server Actions; no se amplía `allowedOrigins` ni se desactiva la comprobación CSRF del framework.

### Backend

- Spring Boot 3.5.16, Java 21, JPA con consultas parametrizadas, Flyway y `ddl-auto=validate`. DTOs de salida, validación de filtros y formularios y honeypot existentes. Las solicitudes no se publican automáticamente.
- Los únicos POST existentes son `/api/solicitudes-comercio` y `/api/solicitudes-publicidad`. Se mantienen por compatibilidad; el catálogo permanece de lectura. No hay endpoints de administración/autenticación/debug.
- No hay dependencias de Actuator ni Swagger/OpenAPI. Las pruebas del contexto real confirman 404 en `/actuator`, `/actuator/health`, `/swagger-ui/index.html` y `/v3/api-docs`. No se afirma haber comprobado el dominio público del backend desplegado: no se ha identificado ni accedido al servicio de Railway.
- CORS ya limita `/api/**` a `FRONTEND_URL`, GET/HEAD/OPTIONS y Accept/Content-Type, sin credenciales y con preflight de 3600 segundos. No usa comodines en código. Mantener `FRONTEND_URL=https://proximolar.es` en Railway, nunca `*`, y no añadir www.
- Las llamadas Node → Spring no necesitan CORS. El rechazo de POST cross-origin no impide que un bot llame directamente al backend: CORS no es autenticación ni protección antispam.
- Errores inesperados genéricos; respuestas de negocio 404/409 usan mensajes literales conocidos. No se reflejan SQL ni datos enviados. Logs existentes registran operación, tipo de excepción, estado e identificadores de solicitud, sin contenido del correo ni claves. No se añaden trazas indiscriminadas que puedan filtrar datos personales. Las rutas de errores esperados pueden quedar en logs: aplicar acceso restringido y retención adecuada.
- Las respuestas de solicitudes ya tienen `no-store` y `X-Robots-Tag`; se conservan en su filtro específico.
- El perfil `local` activa datos demo. No activarlo en producción. Sin cambios de esquema, migraciones ni datos reales.

### Infraestructura

- La comprobación real devuelve 200 en HTTPS para el dominio principal y 301 de HTTP a HTTPS. `Server: railway-hikari`, `x-railway-*` y `x-hikari-trace` proceden del borde de Railway. No se intenta borrarlos en Next.js.
- DNS de www, el parking Apache/PHP y la emisión del certificado no se arreglan con middleware. El redirect añadido solo funciona después de que la petición llegue a Next.js.
- No se auditaron permisos de la cuenta Railway, copias de seguridad, variables efectivas, configuración del proxy, red privada ni acceso público a PostgreSQL desde un panel autenticado. Comprobarlos antes de declarar cerrado el hardening de infraestructura.

## 3. Políticas HTTP implementadas

Frontend, todas las rutas:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: base-uri 'self'; object-src 'none'; frame-ancestors 'self'; frame-src 'none'; form-action 'self'
```

Solo en build de producción:

```text
Strict-Transport-Security: max-age=31536000
Content-Security-Policy-Report-Only: base-uri 'self'; object-src 'none'; frame-ancestors 'self'; frame-src 'none'; form-action 'self'; default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'
```

La CSP en enforcement **no bloquea scripts ni estilos** en esta fase. Sí limita el origen de la base, impide objetos y marcos embebidos, restringe quién puede embeber el sitio y dónde se envían formularios. SAMEORIGIN y frame-ancestors coinciden.

La política completa de observación no contiene `unsafe-inline` ni `unsafe-eval`. Es normal que notifique violaciones por hidratación/RSC, JSON-LD o estilos inline generados por `next/image` y páginas internas. No se presenta como una defensa XSS ya completa. Sin `report-uri`/`report-to`, la revisión se hace en la consola del navegador; no existe agregación remota ni un endpoint de informes. No enviar informes con URLs potencialmente personales a terceros sin decidir su tratamiento.

### Paso a enforcement completo

1. Revisar consola en producción o staging con el build de producción: portada, listados, filtros, ficha, formularios, navegación de cliente, carga, 404 y error de API. Inventariar los orígenes reales de imágenes.
2. Implementar nonce criptográfico nuevo por respuesta en `proxy.ts`, transmitir CSP al renderizador de Next y propagar el nonce a JSON-LD. Forzar renderizado dinámico de las páginas HTML que hoy son estáticas y revisar caché/CDN, evitando reutilizar nonces.
3. Validar también navegación RSC, prefetch, errores y formularios. Un nonce de script no autoriza atributos `style`; resolverlos por separado o justificar una excepción de estilos limitada. No añadir `unsafe-eval` en producción.
4. Aplicar enforcement completo cuando las violaciones legítimas estén resueltas; conservar una prueba de navegador. No basta con renombrar ahora Report-Only a Content-Security-Policy.

Los hashes de scripts RSC y JSON-LD cambian con el contenido; no se fija un hash del HTML observado. El SRI experimental de Next no sustituye una política para todos los scripts inline. El nonce se ha evaluado y diferido para no convertir todas las páginas estáticas a dinámicas en este cambio. Véase la [documentación de CSP de Next.js](https://nextjs.org/docs/app/guides/content-security-policy).

### HSTS

`includeSubDomains` obligaría a usar HTTPS también para www y otros subdominios durante un año en navegadores que reciban la política del dominio principal. Mientras www no tiene TLS, podría impedir incluso su redirección HTTP. Se omite y no se añade preload. HSTS del dominio principal también es persistente: quitar la cabecera no borra la política ya almacenada; su retirada necesita servir `max-age=0` por HTTPS.

Cuando **todos** los subdominios estén inventariados y tengan HTTPS válido, valorar `max-age=31536000; includeSubDomains` y volver a comprobarlos. No activar preload automáticamente.

Backend: nosniff, SAMEORIGIN, referrer y permisos iguales, con CSP `default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'self'; form-action 'none'`, adecuada a una API JSON. El filtro envía HSTS solo si la conexión Servlet es segura. Railway normalmente termina TLS antes de Spring: para un backend público, verificar/aplicar HSTS en su borde. No se confía ciegamente en `X-Forwarded-Proto` ni se habilita una política global de proxies sin conocer la topología.

## 4. Secretos y configuración

Se revisaron referencias a password, token, API key, secretos y credenciales en los archivos versionados actuales. No se identificaron valores reales incrustados. No se ha hecho un escaneo exhaustivo de todos los objetos históricos de Git ni de las variables del panel Railway.

| Archivo / ubicación | Variable | Riesgo / acción |
|---|---|---|
| `backend/src/main/resources/application.yaml` | `DATABASE_PASSWORD`, `RESEND_API_KEY` | Referencias a entorno, sin valores incrustados. Mantener solo en backend; rotar si hubo exposición previa. |
| `.env.example` | `DATABASE_PASSWORD`, variables MAIL | Valor de desarrollo explícito, no usarlo en producción. El ejemplo MAIL heredado no representa toda la configuración actual de Resend. |
| `backend/src/main/resources/application-local.*` | Configuración local de datasource/mail | Ahora ignorada; nunca versionar credenciales. La plantilla `.example` sigue disponible. |
| `.env*`, `frontend/.env*` | Variables locales | Ignoradas salvo `.env.example`. Se ha verificado con `git check-ignore`. |
| `frontend/src/lib/api.ts` | `API_URL`, alternativa `NEXT_PUBLIC_API_URL` | Usar `API_URL` para direcciones privadas y nunca colocar secretos en `NEXT_PUBLIC_*`. |
| Pruebas de solicitudes | `localia.resend.api-key` | Valor sintético de test; cliente de correo simulado, sin envíos reales. |

No se muestran claves, contraseñas, tokens ni URLs privadas. Las cookies del parking PHP pertenecen al proveedor; la aplicación no tiene cookies propias que requieran ajustar Secure/HttpOnly/SameSite.

## 5. Archivos modificados

- `frontend/next.config.ts`: cabeceras centralizadas y redirect 308 condicionado al host exacto www, conservando ruta y query.
- `backend/src/main/java/es/localia/plataforma/config/CabecerasSeguridadFilter.java`: defensas de respuestas API sin añadir Spring Security.
- `backend/src/main/resources/application.yaml`: valores explícitos de errores de producción.
- `backend/src/main/java/es/localia/plataforma/service/ResendHttpClient.java`: timeouts de conexión y petición.
- `.gitignore`: configuración local de Spring.
- `frontend/scripts/verificar-seo.mjs`: validación HTTP de cabeceras en páginas/assets/404 y redirect www; actualización de expectativa obsoleta del directorio base.
- `backend/src/test/java/es/localia/plataforma/CatalogoIntegrationTest.java`: cabeceras, ausencia de cookies/herramientas internas, HTTPS y preflight.
- `docs/SEGURIDAD.md`: este informe y procedimiento de despliegue.

Sin nuevas dependencias, cambios de contratos API, base de datos, SEO funcional, diseño, autenticación o cookies. Se conserva CORS porque ya es restrictivo. No se han cambiado cabeceras del borde, DNS ni servicios externos. No se ha desplegado.

## 6. Configuración manual de Railway y DNS

1. En el servicio **frontend** de Railway, añadir `www.proximolar.es` en Custom Domains con el puerto correcto del servicio. Mantener `proximolar.es` como dominio principal.
2. En el proveedor DNS, sustituir el CNAME de www que ahora apunta al parking por **el destino exacto que Railway muestre para ese dominio**. Desactivar la redirección/parking del proveedor para www. Revisar que no existan registros A/AAAA incompatibles en el mismo nombre.
3. Añadir los registros de verificación/certificado que Railway solicite (CNAME/TXT y, si lo indica, `_acme-challenge`), sin inventar destinos. Revisar CAA si la emisión falla; no borrar restricciones sin conocer su finalidad.
4. Esperar propagación y certificado activo. Verificar TLS sin `-k`. Solo después podrá responder el redirect 308 de Next.js. Railway puede hacer primero un salto HTTP→HTTPS; comprobar que la cadena acaba en el dominio principal, sin bucles.
5. Frontend: `NEXT_PUBLIC_SITE_URL=https://proximolar.es` **durante el build**, `INDEXABLE=true` en producción y `API_URL` apuntando al backend correcto con `/api`. Reconstruir si cambia la variable pública. Previews con `INDEXABLE=false`.
6. Backend: `FRONTEND_URL=https://proximolar.es`, perfil `local` desactivado, `MAIL_ENABLED` según operación, `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_NOTIFICATION_EMAIL` y datasource mediante variables privadas. No usar `FRONTEND_URL=*` ni añadir www como origen de formularios.
7. Revisar exposición de PostgreSQL, privilegios mínimos del usuario de base de datos, backups/restauración, acceso/retención de logs, límites de recursos y protección de tráfico abusivo. Si se mantiene backend público, comprobar sus headers/errores por su propio dominio. No se ha cambiado su exposición para evitar romper consumidores de la API pública.

Referencias oficiales: [dominios en Railway](https://docs.railway.com/networking/domains/working-with-domains) y [diagnóstico TLS](https://docs.railway.com/networking/troubleshooting/ssl).

## 7. Validación ejecutada

- Frontend: lint, TypeScript y build correctos. Build final con `NEXT_PUBLIC_SITE_URL=https://proximolar.es` e `INDEXABLE=true`.
- `node scripts/verificar-seo.mjs`: correcto. Fixtures locales sin escribir en producción; comprueba SSR, canonical, metadata, sitemap, robots, JSON-LD, filtros, demos, 404, vacío/error de API, cabeceras y redirect www.
- Backend: `mvnw.cmd verify`, Java 21, PostgreSQL 17 de Testcontainers: **40 tests, 0 fallos, 0 errores, 0 omitidos; BUILD SUCCESS**, incluido empaquetado ejecutable. Correo simulado.
- `npm audit --omit=dev`: **0 vulnerabilidades reportadas** a la fecha. No sustituye un análisis SCA de Java ni garantiza ausencia de vulnerabilidades futuras.
- `git diff --check`: sin errores de espacios. Sin modificaciones de migraciones.
- La inicialización del navegador integrado falló por configuración de la herramienta. No se afirma una validación interactiva completa de navegador. Antes de promover CSP completa a enforcement, la validación de hidratación, navegación y formularios sigue siendo obligatoria.
- Fallos iniciales resueltos: acceso de Maven a dependencias dentro del aislamiento (validación fuera de él), Docker apagado (arrancado), build local con canonical localhost (rebuild con entorno de producción), prueba SEO obsoleta (alineada con el commit actual).

Comandos reproducibles en PowerShell desde la raíz:

```powershell
cd frontend
$env:NEXT_PUBLIC_SITE_URL='https://proximolar.es'
$env:INDEXABLE='true'
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
node scripts/verificar-seo.mjs
npm.cmd audit --omit=dev
cd ../backend
# Java 21 y Docker disponibles; cada prueba utiliza su PostgreSQL aislado.
.\mvnw.cmd verify
```

## 8. Comprobación tras desplegar

```powershell
curl.exe -I "https://proximolar.es"
curl.exe -I "http://proximolar.es"
curl.exe -I "https://www.proximolar.es"
curl.exe -I "http://www.proximolar.es"
curl.exe -IL --max-redirs 5 "http://www.proximolar.es/comercios?buscar=prueba"
curl.exe -s -D - -o NUL "https://proximolar.es" | findstr /I "strict-transport-security content-security-policy x-content-type-options x-frame-options referrer-policy permissions-policy"
Resolve-DnsName www.proximolar.es
curl.exe -s "https://proximolar.es/robots.txt"
curl.exe -s "https://proximolar.es/sitemap.xml"
curl.exe -s -D - -o NUL "https://proximolar.es/no-existe"
```

Esperado: principal HTTPS 200, principal HTTP 301 hacia HTTPS, www HTTPS 308 hacia principal tras arreglar DNS/TLS, www HTTP termina en principal, sin Apache/PHP. HSTS sin includeSubDomains/preload; **ambas** cabeceras CSP diferenciadas; X-Powered-By ausente. El 404 debe seguir siendo 404 con cabeceras, no un 200. `Server: railway-hikari` puede permanecer.

Para el backend, sustituir únicamente el origen por el asignado realmente en Railway. Estos comandos son de lectura/preflight; no envían solicitudes ni correos:

```powershell
$backend='https://ORIGEN-REAL-DEL-BACKEND'
curl.exe -i "$backend/actuator"
curl.exe -i "$backend/swagger-ui/index.html"
curl.exe -i "$backend/v3/api-docs"
curl.exe -i "$backend/api/comercios?destacado=invalido"
curl.exe -i "$backend/api/comercios" -H "Origin: https://proximolar.es"
curl.exe -i -X OPTIONS "$backend/api/comercios" -H "Origin: https://proximolar.es" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type"
curl.exe -i -X OPTIONS "$backend/api/comercios" -H "Origin: https://no-autorizado.example" -H "Access-Control-Request-Method: GET"
curl.exe -i -X OPTIONS "$backend/api/solicitudes-comercio" -H "Origin: https://proximolar.es" -H "Access-Control-Request-Method: POST"
```

Esperado: herramientas internas 404, filtro inválido 400 genérico sin trace/SQL; lectura/preflight autorizado con origen exacto y sin Allow-Credentials; origen ajeno y preflight POST rechazados. Revisar también caché, headers y HTTPS del servicio público del backend.

Reversión: revertir los archivos de código y reconstruir. No hay migración que deshacer. HSTS requiere tratar su persistencia explícitamente como se indica arriba. DNS y certificados tienen su propio ciclo de propagación y no se revierten con un cambio Git.
