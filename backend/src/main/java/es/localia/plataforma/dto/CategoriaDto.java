package es.localia.plataforma.dto;

import java.time.*;
import java.util.List;

public record CategoriaDto(Long id, String nombre, String slug, String icono) {}
