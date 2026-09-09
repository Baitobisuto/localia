# Localia

Directorio de negocios locales, inicialmente para El Molar. MVP de lectura: búsqueda, categorías, municipios, destacados y fichas con contactos, horarios, imágenes y fuentes. Sin usuarios, administración ni pagos.

Validación realizada y capturas: [docs/VALIDACION.md](docs/VALIDACION.md).

## Arranque local

Requisitos: **Java 21**, Node.js **22.13 o superior** (probado con 24), npm y Docker Desktop con contenedores Linux. Maven viene incluido mediante Wrapper. Comprueba `java -version`: `JAVA_HOME` debe apuntar al JDK 21.

Desde la raíz, copia `.env.example` a `.env` y elige una contraseña local. Este archivo configura Docker Compose; Spring no lo lee automáticamente.

```powershell
# PowerShell, desde la raíz
Copy-Item .env.example .env
docker compose up -d
docker compose ps

# Terminal 1: usa la misma contraseña que en .env
$env:DATABASE_PASSWORD='cambiar-solo-desarrollo'
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
```

```powershell
# Terminal 2, desde la raíz
cd frontend
Copy-Item .env.example .env.local
npm.cmd ci
npm.cmd run dev
```

En macOS/Linux:

```sh
cp .env.example .env
docker compose up -d
cd backend
chmod +x mvnw
DATABASE_PASSWORD='cambiar-solo-desarrollo' ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
# En otra terminal, desde la raíz:
cd frontend
cp .env.example .env.local
npm ci
npm run dev
```

En PowerShell usamos `npm.cmd` para evitar depender de la política de ejecución de scripts. Si utilizas otra contraseña en `.env`, actualiza también `DATABASE_PASSWORD` en la terminal del backend. No reutilices estas credenciales de ejemplo fuera del desarrollo local.

El perfil `local` carga cuatro negocios **ficticios**, identificados tanto en la base de datos como en pantalla. No tienen contactos, fuentes ni verificación inventados. Sus imágenes son ilustraciones SVG propias incluidas en el proyecto. El arranque sin perfil local solo crea el esquema, El Molar y diez categorías. Usa bases de datos distintas para local y producción; no reutilices una base que contenga demos.

## URLs

- Web: <http://localhost:3000>
- Directorio: <http://localhost:3000/comercios>
- Ficha demo: <http://localhost:3000/el-molar/comercios/mesa-de-barrio-demo>
- Alias corto: <http://localhost:3000/comercios/mesa-de-barrio-demo>
- API: <http://localhost:8080/api/comercios>
- SEO: `/robots.txt`, `/sitemap.xml`, `/opengraph-image`.

## Estructura y decisiones

```text
backend/src/main/java/es/localia/plataforma/
  controller/   HTTP y validación
  service/      búsqueda, resolución de slugs y conversión explícita a DTO
  repository/   consultas JPA
  entity/       modelo persistente y getters explícitos
  dto/          records del contrato público
  config/       CORS
  exception/    errores globales
backend/src/main/resources/db/
  migration/    esquema y catálogos, compartidos por todos los entornos
  demo/         ejemplos idempotentes, solo perfil local
frontend/src/
  app/          App Router, páginas de servidor y SEO
  components/   presentación compartida
  lib/          API, contratos TypeScript, enlaces seguros y SEO
```

Java 21 + Spring Boot 3.5.16, Maven, JPA, Validation, PostgreSQL 17 y Flyway. Next.js 16.3.4 + React + TypeScript + Tailwind 4. Una única capa de API en `frontend/src/lib/api.ts`; nunca se sustituyen errores del servidor por datos mock.

`demo` es el único campo adicional al modelo solicitado: evita indexar o confundir ejemplos con negocios reales. Las URLs municipales son canónicas; el alias corto devuelve 409 si hay dos comercios publicados con el mismo slug. Ambas páginas reutilizan la ficha. No hay relaciones comerciales ni calidad implícitas en la marca de verificación.

Se devuelve una lista JSON sin paginación, suficiente para este catálogo inicial. Las relaciones se cargan dentro de transacciones de lectura y JPA agrupa las lecturas de colecciones para evitar una consulta por tarjeta. Si crece mucho el directorio, revisar paginación con un cambio de contrato explícito. Horarios: lunes=1, domingo=7; varias filas permiten horario partido y una hora de cierre anterior a apertura representa cierre al día siguiente. Ausencia de fila significa horario desconocido, no cerrado.

## Configuración

| Variable | Uso | Valor local por defecto |
|---|---|---|
| `DATABASE_URL` | JDBC del backend | `jdbc:postgresql://localhost:5432/localia` |
| `DATABASE_USERNAME` | Usuario de PostgreSQL | `localia` |
| `DATABASE_PASSWORD` | Contraseña, obligatoria | Sin valor implícito |
| `FRONTEND_URL` | Origen CORS permitido, sin ruta ni barra final | `http://localhost:3000` |
| `PORT` | Puerto del backend | `8080` |
| `API_URL` | URL privada de la API, incluido `/api` | `http://localhost:8080/api` |
| `NEXT_PUBLIC_API_URL` | Alternativa pública a `API_URL` | `http://localhost:8080/api` |
| `SITE_URL` | Origen de canonical y SEO | `http://localhost:3000` |
| `INDEXABLE` | Habilitar rastreo e indexación | `false` |

`frontend/.env.local` y `backend/src/main/resources/application-local.yaml` están ignorados en Git. Existe `application-local.yaml.example` si prefieres configuración local de Spring. La configuración por variables evita almacenar secretos. El frontend utiliza llamadas en servidor; CORS permite también lecturas directas del origen configurado y rechaza otros orígenes. No habilita credenciales.

## API pública

```text
GET /api/municipios
GET /api/categorias
GET /api/comercios
GET /api/comercios/{slug}
GET /api/municipios/{municipioSlug}/comercios
GET /api/municipios/{municipioSlug}/comercios/{comercioSlug}
GET /api/municipios/{municipioSlug}/categorias/{categoriaSlug}/comercios
```

Filtros combinables en `/api/comercios`: `buscar`, `categoria`, `municipio`, `destacado` y `verificado`. Ejemplo:

```text
/api/comercios?municipio=el-molar&categoria=restauracion&buscar=mesa&destacado=true
```

La búsqueda por nombre ignora mayúsculas y trata `%` y `_` como texto literal. Los filtros booleanos admiten `true` y `false`. Texto de búsqueda: hasta 120 caracteres. Slugs: minúsculas ASCII, números y guiones. Los registros inactivos y los de categorías/municipios inactivos no se publican. Un listado vacío devuelve `[]`; una ficha inexistente, 404. Las rutas municipales de listado también admiten `buscar`, `categoria`, `destacado` y `verificado`; la categoría de la ruta tiene precedencia.

Errores: `{ "codigo": "RECURSO_NO_ENCONTRADO", "mensaje": "No se ha encontrado el comercio solicitado" }`. También 400 para parámetros inválidos, 409 para slug ambiguo, 405 para escritura y 500 sin detalles internos. Los logs identifican operación, método, ruta y excepción, sin registrar términos de búsqueda ni contactos.

## Pruebas y compilación

```powershell
cd backend
.\mvnw.cmd verify
# Compilar sin repetir tests, una vez validados:
.\mvnw.cmd package -DskipTests
cd ../frontend
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

En macOS/Linux, sustituye `mvnw.cmd` por `./mvnw` y `npm.cmd` por `npm`.

Los tests usan Testcontainers y PostgreSQL real en una base desechable. Necesitan Docker activo y acceso para descargar `postgres:17-alpine` y las imágenes auxiliares de Testcontainers. No usan la base local de Compose ni saltan tests si Docker falla. Prueban arranque desde base vacía, migraciones Flyway, validación del esquema, API, filtros simples/combinados, fichas, 404, ambigüedad, validación, solo lectura y CORS. Cada prueba revierte sus fixtures ficticias. Si falla el arranque: revisar `backend/target/surefire-reports` y comprobar `docker info`.

## Producción

Preparar una base PostgreSQL vacía y configurar las variables; **no activar el perfil `local`**. Compilar:

```sh
cd backend
./mvnw verify
java -jar target/plataforma-0.0.1-SNAPSHOT.jar
# Otra terminal:
cd frontend
npm ci
npm run lint
npm run build
npm run start
```

El build del frontend no necesita un backend activo; las páginas de catálogo se resuelven en servidor en cada petición. `SITE_URL` debe contener el dominio real antes del build. Activar `INDEXABLE=true` únicamente cuando el directorio real esté revisado. El sitemap excluye demos y usa solo las fichas municipales existentes. Los filtros tienen `noindex`; las fichas demo también. JSON-LD utiliza `LocalBusiness` genérico: una categoría amplia no permite inferir que un negocio sea, por ejemplo, un restaurante o una farmacia. Solo se incluyen datos presentes; no se generan reseñas ni puntuaciones.

No se ha publicado ningún servicio. El siguiente paso de despliegue requiere elegir y autorizar un alojamiento.

## Añadir un comercio real

1. Consultar fuentes públicas, preferentemente web oficial; registrar las URLs y la **fecha real de consulta**. No recopilar datos personales ajenos a la actividad comercial ni copiar textos largos. Redactar una descripción breve propia.
2. Crear una nueva migración versionada, por ejemplo `backend/src/main/resources/db/migration/V3__primer_comercio_real.sql`. No modificar V1/V2 una vez aplicadas. La combinación `municipio_id, slug` es única; las categorías y municipios se referencian por su slug.
3. Insertar `comercio` y al menos una `fuente_comercio` en esa misma migración. Utilizar parámetros reales revisados; dejar a `NULL` cualquier dato desconocido. `demo=false`, `verificado=false`, `fecha_verificacion=NULL` hasta disponer de evidencia suficiente. `destacado` se decide editorialmente y no implica verificación.
4. Añadir horarios solo si están comprobados. Teléfono preferentemente internacional (`+34…`); WhatsApp **debe** incluir código de país, sin inventar que un teléfono también dispone de WhatsApp. Web, Instagram, Maps y fuentes: URLs completas `https://…`. Imágenes: URLs autorizadas y texto alternativo, sin descargas automáticas de terceros. Si no hay imagen, se usa el placeholder local.
5. Cuando se hayan revisado los datos básicos, actualizar juntos `verificado=true` y `fecha_verificacion` con el día real de revisión. La fecha de verificación no es necesariamente la fecha de consulta de todas las fuentes. La base exige coherencia entre la marca y la fecha.
6. Ejecutar tests y arrancar con la nueva migración; comprobar ficha, contactos, categoría, canonical y datos estructurados. Las fechas `updated_at` se mantienen mediante triggers, incluso en actualizaciones SQL manuales.

Para actualizaciones posteriores de datos reales, crear otra migración; revisar de nuevo fuentes y verificación. Si ya no hay evidencia suficiente, poner `verificado=false` y `fecha_verificacion=NULL` en la misma operación. No borrar las fuentes históricas válidas.

Referencias técnicas usadas para elegir versiones y configuración: [compatibilidad de Spring Boot 3.5](https://docs.spring.io/spring-boot/3.5/system-requirements.html) y [documentación de Next.js](https://nextjs.org/docs).
