package es.localia.plataforma.dto;

import jakarta.validation.constraints.*;

public record SolicitudComercioDto(
        @NotBlank @Size(max = 160) @TextoSolicitud String nombreNegocio,
        @NotBlank @Size(max = 120) @TextoSolicitud String personaContacto,
        @NotBlank @Size(max = 254) @TextoSolicitud @Email String email,
        @NotBlank @Size(max = 30) @TextoSolicitud @Pattern(regexp = "[+0-9() .-]{7,30}") String telefono,
        @Size(max = 30) @TextoSolicitud @Pattern(regexp = "[+0-9() .-]{7,30}") String whatsapp,
        @NotBlank @Size(max = 120) @TextoSolicitud String categoria,
        @NotBlank @Size(max = 300) @TextoSolicitud String direccion,
        @NotBlank @Size(max = 2000) @TextoSolicitud String descripcion,
        @Size(max = 2000) @TextoSolicitud @org.hibernate.validator.constraints.URL(protocol = "https") String web,
        @Size(max = 2000) @TextoSolicitud @org.hibernate.validator.constraints.URL(protocol = "https") String instagram,
        @Size(max = 2000) @TextoSolicitud String observaciones,
        @NotNull @AssertTrue Boolean consentimientoPrivacidad,
        @Size(max = 0) String sitioWeb) {
    // Normaliza antes de validar; el honeypot se comprueba sin recortar.
    public SolicitudComercioDto {
        nombreNegocio = NormalizacionSolicitud.limpiar(nombreNegocio);
        personaContacto = NormalizacionSolicitud.limpiar(personaContacto);
        email = NormalizacionSolicitud.limpiar(email);
        telefono = NormalizacionSolicitud.limpiar(telefono);
        whatsapp = NormalizacionSolicitud.limpiar(whatsapp);
        categoria = NormalizacionSolicitud.limpiar(categoria);
        direccion = NormalizacionSolicitud.limpiar(direccion);
        descripcion = NormalizacionSolicitud.limpiar(descripcion);
        web = NormalizacionSolicitud.limpiar(web);
        instagram = NormalizacionSolicitud.limpiar(instagram);
        observaciones = NormalizacionSolicitud.limpiar(observaciones);
    }
}
