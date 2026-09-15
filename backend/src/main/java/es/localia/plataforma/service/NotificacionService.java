package es.localia.plataforma.service;

import es.localia.plataforma.entity.SolicitudComercio;
import es.localia.plataforma.entity.SolicitudPublicidad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionService.class);

    private final ResendClient resendClient;
    private final boolean habilitado;
    private final String remitente;
    private final String destinatario;

    public NotificacionService(
            ResendClient resendClient,
            @Value("${localia.mail.enabled:false}") boolean habilitado,
            @Value("${localia.resend.from:}") String remitente,
            @Value("${localia.mail.admin:}") String destinatario) {

        this.resendClient = resendClient;
        this.habilitado = habilitado;
        this.remitente = remitente;
        this.destinatario = destinatario;
    }

    public void notificarComercio(SolicitudComercio s) {

        String asunto = "[Nueva solicitud ProxiMolar] Alta de comercio - "
                + limpiarCabecera(s.getNombreNegocio());

        String contenido = """
                ID: %s
                Fecha UTC: %s
                Estado: PENDIENTE
                Negocio: %s
                Persona: %s
                Email: %s
                Teléfono: %s
                WhatsApp: %s
                Categoría / actividad: %s
                Dirección: %s
                Descripción: %s
                Web: %s
                Red social: %s
                Observaciones: %s
                """.formatted(
                s.getId(),
                s.getCreatedAt(),
                s.getNombreNegocio(),
                s.getPersonaContacto(),
                s.getEmail(),
                s.getTelefono(),
                opcional(s.getWhatsapp()),
                s.getCategoria(),
                s.getDireccion(),
                s.getDescripcion(),
                opcional(s.getWeb()),
                opcional(s.getInstagram()),
                opcional(s.getObservaciones()));

        enviar(
                "alta",
                s.getId(),
                asunto,
                contenido);
    }

    public void notificarPublicidad(SolicitudPublicidad s) {

        String asunto = "[Nueva solicitud ProxiMolar] Publicidad - "
                + limpiarCabecera(s.getNombreNegocio());

        String contenido = """
                ID: %s
                Fecha UTC: %s
                Estado: PENDIENTE
                Negocio: %s
                Persona: %s
                Email: %s
                Teléfono: %s
                Interés: %s
                Mensaje: %s
                """.formatted(
                s.getId(),
                s.getCreatedAt(),
                s.getNombreNegocio(),
                s.getPersonaContacto(),
                s.getEmail(),
                s.getTelefono(),
                s.getTipoInteres(),
                s.getMensaje());

        enviar(
                "publicidad",
                s.getId(),
                asunto,
                contenido);
    }

    private void enviar(
            String tipo,
            Long id,
            String asunto,
            String contenido) {

        try {

            if (!habilitado) {
                log.warn(
                        "operacion=notificar_solicitud tipo={} id={} resultado=deshabilitado",
                        tipo,
                        id);
                return;
            }

            if (remitente.isBlank() || destinatario.isBlank()) {
                log.warn(
                        "operacion=notificar_solicitud tipo={} id={} resultado=configuracion_incompleta",
                        tipo,
                        id);
                return;
            }

            resendClient.enviar(
                    remitente,
                    destinatario,
                    asunto,
                    contenido);

            log.info(
                    "operacion=notificar_solicitud tipo={} id={} resultado=enviado",
                    tipo,
                    id);

        } catch (Exception ex) {

            log.warn(
                    "operacion=notificar_solicitud tipo={} id={} resultado=fallido excepcion={}",
                    tipo,
                    id,
                    ex.getClass().getSimpleName());
        }
    }

    private String opcional(String valor) {
        return valor == null || valor.isBlank()
                ? "No indicado"
                : valor;
    }

    private String limpiarCabecera(String valor) {
        return valor == null
                ? ""
                : valor.replaceAll("[\\r\\n\\t]", " ");
    }
}