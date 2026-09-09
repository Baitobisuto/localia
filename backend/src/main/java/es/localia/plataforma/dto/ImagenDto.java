package es.localia.plataforma.dto;

import java.time.*;
import java.util.List;

public record ImagenDto(String url, String textoAlternativo, int orden) {}
