package es.localia.plataforma.service;

import es.localia.plataforma.entity.SolicitudComercio;
import es.localia.plataforma.entity.SolicitudPublicidad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificacionService {
    private static final Logger log = LoggerFactory.getLogger(NotificacionService.class);
    private final ObjectProvider<JavaMailSender> correo;
    private final boolean habilitado;
    private final String remitente;
    private final String destinatario;

    public NotificacionService(ObjectProvider<JavaMailSender> correo,
            @Value("${localia.mail.enabled:false}") boolean habilitado,
            @Value("${localia.mail.from:}") String remitente,
            @Value("${localia.mail.admin:}") String destinatario) {
        this.correo = correo;
        this.habilitado = habilitado;
        this.remitente = remitente;
        this.destinatario = destinatario;
    }

    // Compone texto plano con los datos necesarios para revisar el alta.
    public void notificarComercio(SolicitudComercio s) {
        enviar("alta", s.getId(), "Alta de comercio", s.getNombreNegocio(), """
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
                """.formatted(s.getId(), s.getCreatedAt(), s.getNombreNegocio(), s.getPersonaContacto(),
                s.getEmail(), s.getTelefono(), opcional(s.getWhatsapp()), s.getCategoria(), s.getDireccion(),
                s.getDescripcion(), opcional(s.getWeb()), opcional(s.getInstagram()), opcional(s.getObservaciones())));
    }

    // Compone una notificación de publicidad sin publicar ni contratar promociones.
    public void notificarPublicidad(SolicitudPublicidad s) {
        enviar("publicidad", s.getId(), "Publicidad", s.getNombreNegocio(), """
                ID: %s
                Fecha UTC: %s
                Estado: PENDIENTE
                Negocio: %s
                Persona: %s
                Email: %s
                Teléfono: %s
                Interés: %s
                Mensaje: %s
                """.formatted(s.getId(), s.getCreatedAt(), s.getNombreNegocio(), s.getPersonaContacto(),
                s.getEmail(), s.getTelefono(), s.getTipoInteres(), s.getMensaje()));
    }

    // Aísla fallos SMTP: registra solo tipo e ID, nunca destinatarios, contenido ni excepciones del proveedor.
    private void enviar(String tipo, Long id, String asunto, String negocio, String contenido) {
        try {
            if (!habilitado) {
                log.warn("operacion=notificar_solicitud tipo={} id={} resultado=deshabilitado", tipo, id);
                return;
            }
            JavaMailSender emisor = correo.getIfAvailable();
            if (emisor == null || remitente.isBlank() || destinatario.isBlank()) {
                log.warn("operacion=notificar_solicitud tipo={} id={} resultado=configuracion_incompleta", tipo, id);
                return;
            }
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(remitente);
            mensaje.setTo(destinatario);
            mensaje.setSubject("[Nueva solicitud ProxiMolar] " + asunto + " - " + negocio.replaceAll("[\\r\\n\\t]", " "));
            mensaje.setText(contenido);
            emisor.send(mensaje);
            log.info("operacion=notificar_solicitud tipo={} id={} resultado=enviado", tipo, id);
        } catch (Exception ex) {
            log.warn("operacion=notificar_solicitud tipo={} id={} resultado=fallido", tipo, id);
        }
    }

    // Indica campos no aportados sin inventar datos de contacto.
    private String opcional(String valor) { return valor == null ? "No indicado" : valor; }
}
