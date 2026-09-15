package es.localia.plataforma.dto;

import jakarta.validation.constraints.*;

public record SolicitudPublicidadDto(
        @NotBlank @Size(max = 160) @TextoSolicitud String nombreNegocio,
        @NotBlank @Size(max = 120) @TextoSolicitud String personaContacto,
        @NotBlank @Size(max = 254) @TextoSolicitud @Email String email,
        @NotBlank @Size(max = 30) @TextoSolicitud @Pattern(regexp = "[+0-9() .-]{7,30}") String telefono,
        @NotBlank @Size(max = 40) @TextoSolicitud @Pattern(regexp = "DESTACAR_NEGOCIO|POSICION_DESTACADA|PROMOCION|COLABORACION|OTRO") String tipoInteres,
        @NotBlank @Size(max = 2000) @TextoSolicitud String mensaje,
        @NotNull @AssertTrue Boolean consentimientoPrivacidad,
        @Size(max = 0) String sitioWeb) {
    // Normaliza antes de validar; el honeypot se comprueba sin recortar.
    public SolicitudPublicidadDto {
        nombreNegocio = NormalizacionSolicitud.limpiar(nombreNegocio);
        personaContacto = NormalizacionSolicitud.limpiar(personaContacto);
        email = NormalizacionSolicitud.limpiar(email);
        telefono = NormalizacionSolicitud.limpiar(telefono);
        tipoInteres = NormalizacionSolicitud.limpiar(tipoInteres);
        mensaje = NormalizacionSolicitud.limpiar(mensaje);
    }
}
