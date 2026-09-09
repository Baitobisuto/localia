package es.localia.plataforma.dto;

import java.time.*;
import java.util.List;

public record HorarioDto(short diaSemana, LocalTime horaApertura, LocalTime horaCierre, boolean cerrado) {}
