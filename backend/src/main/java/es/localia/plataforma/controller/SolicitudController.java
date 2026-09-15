package es.localia.plataforma.controller;

import es.localia.plataforma.dto.*;
import es.localia.plataforma.service.SolicitudService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SolicitudController {
    private final SolicitudService servicio;
    public SolicitudController(SolicitudService servicio) { this.servicio = servicio; }

    // Valida un alta pública y devuelve únicamente su identificador y estado inicial.
    @PostMapping("/solicitudes-comercio")
    public ResponseEntity<SolicitudRecibidaDto> solicitarComercio(@Valid @RequestBody SolicitudComercioDto datos) {
        return ResponseEntity.status(201).body(servicio.solicitarComercio(datos));
    }

    // Valida una propuesta publicitaria sin devolver datos personales ni crear anuncios.
    @PostMapping("/solicitudes-publicidad")
    public ResponseEntity<SolicitudRecibidaDto> solicitarPublicidad(@Valid @RequestBody SolicitudPublicidadDto datos) {
        return ResponseEntity.status(201).body(servicio.solicitarPublicidad(datos));
    }
}
