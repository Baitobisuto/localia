# Normas permanentes de Localia

- Priorizar simplicidad, claridad y cambios mínimos, aditivos y reversibles. No sobreingeniería ni abstracciones sin necesidad real.
- Revisar estado y cambios recientes de Git antes de editar. Explicar cambios arriesgados y decisiones arquitectónicas no obvias.
- Backend Java 21 / Spring Boot: controller (HTTP) → service (negocio) → repository (datos). Entidades sin lógica de negocio; DTOs sencillos, nunca entidades en la API.
- Funciones propias del dominio en español; conservar convenciones técnicas del framework.
- Cada función con lógica relevante debe tener inmediatamente encima un comentario breve de responsabilidad. Al modificarla, revisar y actualizar también el comentario.
- PostgreSQL con Flyway obligatorio desde el inicio y ddl-auto=validate. Nunca cambiar el esquema sin migración versionada ni editar migraciones ya aplicadas.
- No Lombok, MapStruct, interfaces de servicios de una sola implementación ni dependencias sin necesidad real.
- API pública exclusivamente de lectura. No añadir autenticación, administración, pagos, reservas u otras funcionalidades futuras.
- No secretos en Git. Configuración mediante variables de entorno. No cambios fuera del proyecto ni publicaciones o servicios externos/de pago sin autorización.
- Tests útiles del comportamiento crítico; ejecutar comprobaciones relevantes y corregir errores tras cada fase. Preferir la validación de menor coste suficiente.
- Mantener SEO, accesibilidad, estados de carga/error/vacío y una única capa de acceso a la API. No duplicar lógica.
- No inventar información de negocios reales ni copiar imágenes/textos de terceros sin autorización. Usar placeholders locales.
- Cada negocio real debe conservar trazabilidad mediante FUENTE_COMERCIO (tipo, URL y fecha de consulta). Datos no comprobados: null.
- Revisar verificado y fecha_verificacion al actualizar datos reales. Verificado solo indica revisión de datos básicos, nunca certificación/calidad/relación comercial; sin evidencia: false y null.
- Datos ficticios claramente marcados como demo y aislados del arranque de producción.

## Comandos

- PostgreSQL: `docker compose up -d`.
- Backend: `cd backend`; `./mvnw spring-boot:run -Dspring-boot.run.profiles=local`; Windows: `./mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"`.
- Backend tests (requieren Docker): `./mvnw verify`; compilación: `./mvnw package -DskipTests`.
- Frontend: `cd frontend`; `npm ci`; `npm run dev`.
- Frontend validación: `npm run lint`; `npm run typecheck`; `npm run build`.
