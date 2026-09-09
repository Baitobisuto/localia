package es.localia.plataforma.dto;

import java.time.*;
import java.util.List;

public record FuenteComercioDto(String tipoFuente, String url, LocalDate fechaConsulta) {}
