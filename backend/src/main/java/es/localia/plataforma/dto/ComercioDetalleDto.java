package es.localia.plataforma.dto;

import java.time.*;
import java.util.List;

public record ComercioDetalleDto(Long id, String nombre, String slug, CategoriaDto categoria, MunicipioDto municipio, String descripcion, String direccion, String codigoPostal, String telefono, String whatsapp, String email, String web, String instagram, String googleMapsUrl, boolean destacado, boolean verificado, boolean demo, LocalDate fechaVerificacion, List<HorarioDto> horarios, List<ImagenDto> imagenes, List<FuenteComercioDto> fuentes) {}
