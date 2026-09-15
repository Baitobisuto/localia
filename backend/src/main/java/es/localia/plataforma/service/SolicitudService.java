package es.localia.plataforma.service;

import es.localia.plataforma.dto.*;
import es.localia.plataforma.entity.*;
import es.localia.plataforma.repository.*;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
public class SolicitudService {
    private final SolicitudComercioRepository comercios;
    private final SolicitudPublicidadRepository publicidad;
    private final NotificacionService notificaciones;
    private static final String VERSION_PRIVACIDAD = "2026-09-15";

    public SolicitudService(SolicitudComercioRepository comercios, SolicitudPublicidadRepository publicidad,
                            NotificacionService notificaciones) {
        this.comercios = comercios;
        this.publicidad = publicidad;
        this.notificaciones = notificaciones;
    }

    // El repositorio confirma su propia transacción antes del correo; nunca modifica el catálogo.
    public SolicitudRecibidaDto solicitarComercio(SolicitudComercioDto d) {
        Instant ahora = Instant.now();
        SolicitudComercio s = comercios.saveAndFlush(new SolicitudComercio(d.nombreNegocio(), d.personaContacto(),
                d.email(), d.telefono(), d.whatsapp(), d.categoria(), d.direccion(), d.descripcion(), d.web(),
                d.instagram(), d.observaciones(), "PENDIENTE", true, VERSION_PRIVACIDAD, ahora, ahora));
        notificaciones.notificarComercio(s);
        return new SolicitudRecibidaDto(s.getId(), s.getEstado());
    }

    // Guarda una propuesta pendiente, confirma el commit y después intenta notificarla.
    public SolicitudRecibidaDto solicitarPublicidad(SolicitudPublicidadDto d) {
        Instant ahora = Instant.now();
        SolicitudPublicidad s = publicidad.saveAndFlush(new SolicitudPublicidad(d.nombreNegocio(), d.personaContacto(),
                d.email(), d.telefono(), d.tipoInteres(), d.mensaje(), "PENDIENTE", true, VERSION_PRIVACIDAD, ahora, ahora));
        notificaciones.notificarPublicidad(s);
        return new SolicitudRecibidaDto(s.getId(), s.getEstado());
    }
}
