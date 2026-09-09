package es.localia.plataforma.dto;

import java.time.*;
import java.util.List;

public record ComercioResumenDto(Long id, String nombre, String slug, CategoriaDto categoria, MunicipioDto municipio, String descripcion, String direccion, String telefono, String whatsapp, boolean destacado, boolean verificado, boolean demo, ImagenDto imagenPrincipal) {}
