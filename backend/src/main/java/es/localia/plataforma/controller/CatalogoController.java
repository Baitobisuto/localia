package es.localia.plataforma.controller;

import es.localia.plataforma.dto.*;
import es.localia.plataforma.service.ComercioService;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogoController {
    private final ComercioService servicio;
    private static final String SLUG = "[a-z0-9]+(?:-[a-z0-9]+)*";
    private static final String FILTRO_SLUG = "(?:[a-z0-9]+(?:-[a-z0-9]+)*)?";

    public CatalogoController(ComercioService servicio) { this.servicio = servicio; }

    // Devuelve los municipios disponibles para navegar.
    @GetMapping("/municipios")
    public List<MunicipioDto> obtenerMunicipios() { return servicio.obtenerMunicipios(); }

    // Devuelve las categorías disponibles para filtrar.
    @GetMapping("/categorias")
    public List<CategoriaDto> obtenerCategorias() { return servicio.obtenerCategorias(); }

    // Valida los filtros públicos y delega la búsqueda combinada.
    @GetMapping("/comercios")
    public List<ComercioResumenDto> buscarComercios(
            @RequestParam(defaultValue = "") @Size(max = 120) String buscar,
            @RequestParam(defaultValue = "") @Size(max = 120) @Pattern(regexp = FILTRO_SLUG) String categoria,
            @RequestParam(defaultValue = "") @Size(max = 120) @Pattern(regexp = FILTRO_SLUG) String municipio,
            @RequestParam(required = false) Boolean destacado, @RequestParam(required = false) Boolean verificado) {
        return servicio.buscarComercios(buscar, categoria, municipio, destacado, verificado);
    }

    // Resuelve las rutas municipales reutilizando la misma búsqueda y sus filtros.
    @GetMapping({"/municipios/{municipioSlug}/comercios", "/municipios/{municipioSlug}/categorias/{categoriaSlug}/comercios"})
    public List<ComercioResumenDto> obtenerComerciosMunicipio(
            @PathVariable @Size(max = 120) @Pattern(regexp = SLUG) String municipioSlug,
            @PathVariable(required = false) @Size(max = 120) @Pattern(regexp = SLUG) String categoriaSlug,
            @RequestParam(defaultValue = "") @Size(max = 120) @Pattern(regexp = FILTRO_SLUG) String categoria,
            @RequestParam(defaultValue = "") @Size(max = 120) String buscar,
            @RequestParam(required = false) Boolean destacado, @RequestParam(required = false) Boolean verificado) {
        return servicio.buscarComercios(buscar, categoriaSlug == null ? categoria : categoriaSlug, municipioSlug, destacado, verificado);
    }

    // Obtiene una ficha por slug, con municipio opcional para compatibilidad de enlaces.
    @GetMapping("/comercios/{slug}")
    public ComercioDetalleDto obtenerComercio(
            @PathVariable @Size(max = 160) @Pattern(regexp = SLUG) String slug,
            @RequestParam(defaultValue = "") @Size(max = 120) @Pattern(regexp = FILTRO_SLUG) String municipio) {
        return servicio.obtenerComercioPorSlug(slug, municipio);
    }

    // Obtiene la ficha inequívoca dentro de un municipio.
    @GetMapping("/municipios/{municipioSlug}/comercios/{comercioSlug}")
    public ComercioDetalleDto obtenerComercioMunicipio(
            @PathVariable @Size(max = 120) @Pattern(regexp = SLUG) String municipioSlug,
            @PathVariable @Size(max = 160) @Pattern(regexp = SLUG) String comercioSlug) {
        return servicio.obtenerComercioPorSlug(comercioSlug, municipioSlug);
    }
}
