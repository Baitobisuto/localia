# Solicitudes de alta y publicidad

## Auditoría y alcance

Antes existían el catálogo público de lectura, búsqueda, fichas, destacados editoriales, la capa `frontend/src/lib/api.ts`, errores centralizados y migraciones V1–V3. La home mostraba «Próximamente: solicita aparecer», sin formulario ni destino funcional. No existían solicitudes, email, promociones contratables, autenticación, infraestructura de rate limiting ni política de privacidad.

Se reutilizan arquitectura controller → service → repository, JPA, Bean Validation, Flyway, metadatos, estilos y capa API. La petición autoriza dos POST como excepción al catálogo de lectura. No se modifica el catálogo, sus URLs, el sitemap ni los criterios SEO. No hay publicación automática, panel administrativo, precios, usuarios ni pagos.

## Rutas y contratos

| Página | Endpoint del backend | Tabla |
|---|---|---|
| `/alta-comercio` | `POST /api/solicitudes-comercio` | `solicitud_comercio` |
| `/publicidad` | `POST /api/solicitudes-publicidad` | `solicitud_publicidad` |
| `/privacidad` | — | — |

Las páginas tienen metadata `noindex`; no se añaden al sitemap. Las rutas de solicitudes del backend incluyen `X-Robots-Tag: noindex, nofollow, noarchive` y `Cache-Control: no-store`, también en errores. No existen GET para consultar datos personales.

El navegador envía una Server Action al mismo origen de Next.js. La acción selecciona los campos y llama al backend exclusivamente mediante `lib/api.ts`, en servidor. No es necesario abrir CORS para POST. Se conserva el CORS de lectura existente.

Respuesta de creación: HTTP **201**, exclusivamente `{ "id": 1, "estado": "PENDIENTE" }`. Datos inválidos: **400** con mensaje genérico, sin reflejar entradas ni detalles del proveedor. Campos ajenos al DTO no pueden asignar estado ni identificador. No se devuelve una URL administrativa.

### Alta

Obligatorios: `nombreNegocio` (160), `personaContacto` (120), `email` (254), `telefono` (30), `categoria` (120; texto libre para no impedir actividades nuevas), `direccion` (300; dirección o zona de servicio), `descripcion` (2000), `consentimientoPrivacidad: true`.

Opcionales: `whatsapp` (30), `web` (2000), `instagram` (2000; también otra red social), `observaciones` (2000). URLs completas HTTPS. Teléfonos: 7–30 caracteres de números, espacios, `+`, paréntesis, puntos y guiones. No se comprueba la titularidad del email ni del teléfono.

### Publicidad

Obligatorios: `nombreNegocio`, `personaContacto`, `email`, `telefono` (mismos límites), `tipoInteres`, `mensaje` (2000) y `consentimientoPrivacidad: true`.

Intereses admitidos: `DESTACAR_NEGOCIO`, `POSICION_DESTACADA`, `PROMOCION`, `COLABORACION`, `OTRO`. Son intereses del solicitante, no planes ni posiciones garantizadas.

Ambos contratos aceptan `sitioWeb` como honeypot: omitido, null o cadena vacía. Cualquier contenido, incluso espacios, se rechaza. Se normalizan espacios periféricos; opcionales vacíos pasan a null. Se rechazan etiquetas HTML y caracteres de control no imprimibles. Todo se envía por correo como texto plano.

## Persistencia y correo

Migración nueva: `V4__solicitudes_comercio_y_publicidad.sql`. Añade dos tablas sin relaciones con comercios publicados, sin índices secundarios innecesarios y sin cambiar migraciones anteriores. Estados previstos: `PENDIENTE`, `APROBADA`, `RECHAZADA`; la API siempre crea `PENDIENTE`. Guarda consentimiento, versión de privacidad y fechas UTC. Reutiliza el trigger existente para `updated_at`.

El repositorio `saveAndFlush` termina su transacción **antes** de intentar SMTP. El servicio de solicitudes no debe envolverse en una transacción externa sin revisar esta garantía. Un error de base de datos no genera correo. Un error SMTP deja la solicitud almacenada y devuelve 201; el log contiene solo operación, tipo, ID y resultado. No registra excepción SMTP, destinatario ni contenido. No hay reintentos automáticos ni cola de entrega: revisar ambas tablas aunque no lleguen notificaciones. Una caída del proceso entre commit y SMTP también puede dejar una solicitud sin aviso.

El mecanismo es **SMTP mediante Spring Boot Mail / JavaMailSender**, con texto plano y tiempos máximos de 3 segundos para conexión, lectura y escritura. No se contrata ni selecciona un proveedor externo. Configuración basada en [Spring Boot: envío de correo](https://docs.spring.io/spring-boot/reference/io/email.html).

## Variables privadas del backend en Railway

| Variable | Configuración |
|---|---|
| `MAIL_ENABLED` | `true` para intentar envío; por defecto `false` |
| `ADMIN_NOTIFICATION_EMAIL` | Destinatario privado elegido por el titular; sin valor en Git |
| `MAIL_HOST` | Host SMTP del proveedor |
| `MAIL_PORT` | Puerto del proveedor; por defecto `587` |
| `MAIL_USERNAME` | Usuario SMTP |
| `MAIL_PASSWORD` | Credencial SMTP |
| `MAIL_FROM` | Remitente autorizado por el proveedor |
| `MAIL_SMTP_AUTH` | `true` por defecto; `false` solo para capturador local sin autenticación |
| `MAIL_STARTTLS` | `true` por defecto; exige STARTTLS |
| `MAIL_SSL` | `false` por defecto; para SMTPS suele ser `true` con puerto 465 y `MAIL_STARTTLS=false` |

No definir estas variables en frontend ni con prefijo `NEXT_PUBLIC_`. El backend es el único consumidor del destinatario. `.env.example` deja los valores sensibles vacíos. Spring no carga automáticamente el `.env` de Compose: exportar variables en la terminal o configurarlas en Railway.

Mantener las variables existentes de PostgreSQL y `API_URL` del frontend apuntando al backend con sufijo `/api`. Desplegar primero el backend para que Flyway aplique V4, comprobar arranque con `ddl-auto=validate` y después el frontend. No activar el perfil local en producción. Confirmar conectividad SMTP saliente y remitente autorizado en el entorno real; el código no puede garantizar la entrega a la bandeja de entrada.

## Privacidad pendiente antes de poner los formularios en servicio

La página `/privacidad` es una estructura mínima **incompleta**, no una política legal cerrada. Por indicación del titular:

- Responsable: persona física; **nombre completo pendiente**, sin inventarlo ni publicarlo todavía.
- Canal de derechos: **pendiente de configuración y confirmación**; no se presenta ningún buzón como operativo.
- Completar plazo de conservación, proveedores de alojamiento/correo, encargos de tratamiento y posibles transferencias y garantías.
- Al completar o cambiar la información, actualizar la versión visible y `VERSION_PRIVACIDAD` para trazar el consentimiento.

Los formularios permiten pruebas locales, pero completar estos datos antes de desplegarlos para recoger contactos reales. No hay newsletter ni reutilización automática para marketing. Referencia: [AEPD, deber de información](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/6-el-deber-de-informacion).

## Cómo probar

1. Arrancar PostgreSQL local, backend y frontend como indica el README. No usar producción para pruebas. Con `MAIL_ENABLED=false` se guardan solicitudes sin enviar correo.
2. Abrir `/alta-comercio`, completar datos ficticios y marcar consentimiento. Debe aparecer «Solicitud recibida. Revisaremos los datos antes de publicar el negocio».
3. Abrir `/publicidad`, elegir interés, completar mensaje y enviar. Debe aparecer la confirmación de revisión y contacto.
4. Revisar con acceso privado a PostgreSQL:

```sql
SELECT id, estado, consentimiento_privacidad, version_privacidad, created_at
FROM solicitud_comercio ORDER BY id DESC;
SELECT id, estado, consentimiento_privacidad, version_privacidad, created_at
FROM solicitud_publicidad ORDER BY id DESC;
```

5. Probar campos vacíos, email inválido, longitudes máximas, HTML y honeypot mediante los tests del backend. Ninguna solicitud inválida debe persistir.
6. Para probar SMTP sin contactar a terceros, utilizar un capturador local ya disponible: configurar host/puerto, direcciones ficticias, `MAIL_ENABLED=true`, `MAIL_SMTP_AUTH=false`, `MAIL_STARTTLS=false`. Para comprobar caída, detener ese capturador: el POST debe seguir devolviendo 201 y la fila debe existir.
7. Comprobaciones automáticas:

```powershell
cd backend
.\mvnw.cmd verify
cd ../frontend
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

Los tests nuevos usan PostgreSQL real con Testcontainers y un SMTP simulado. Comprueban commit antes de notificar, validaciones de ambos flujos, consentimiento, honeypot, HTML, URLs, estado no asignable, ausencia de lectura pública, errores JSON, fallo de correo sin pérdida y ausencia del destinatario en respuestas/logs.

## Límites operativos

Honeypot y validación son protección básica, no un límite de tráfico. No existía rate limiting reutilizable. No se añade CAPTCHA ni un servicio externo. No hay deduplicación persistente: el botón se bloquea durante el envío, pero un reintento tras perder la conexión puede generar otra solicitud; no se reintenta automáticamente.

La revisión se realiza con acceso privado a PostgreSQL; no se construye un CRM. Aprobar una solicitud no crea una ficha: publicar un negocio sigue requiriendo revisión editorial, trazabilidad de fuentes y el procedimiento existente. No se ha desplegado, hecho commit ni push.
