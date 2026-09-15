package es.localia.plataforma.dto;

final class NormalizacionSolicitud {
    private NormalizacionSolicitud() {}

    // Recorta espacios periféricos y conserva null para datos opcionales ausentes.
    static String limpiar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.strip();
    }
}
