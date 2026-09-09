package es.localia.plataforma.service;

import es.localia.plataforma.dto.*;
import es.localia.plataforma.entity.*;
import es.localia.plataforma.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ComercioService {
    private final ComercioRepository comercios;
    private final CategoriaRepository categorias;
    private final MunicipioRepository municipios;

    public ComercioService(ComercioRepository comercios, CategoriaRepository categorias, MunicipioRepository municipios) {
        this.comercios = comercios;
        this.categorias = categorias;
        this.municipios = municipios;
    }

    // Expone los municipios activos sin acoplar el contrato HTTP a JPA.
    public List<MunicipioDto> obtenerMunicipios() {
        return municipios.obtenerActivos().stream().map(this::convertirMunicipio).toList();
    }

    // Expone las categorías activas para navegación y filtros.
    public List<CategoriaDto> obtenerCategorias() {
        return categorias.obtenerActivas().stream().map(this::convertirCategoria).toList();
    }

    // Normaliza el texto de búsqueda y transforma los comercios publicados en resúmenes.
    public List<ComercioResumenDto> buscarComercios(String buscar, String categoria, String municipio,
                                                  Boolean destacado, Boolean verificado) {
        return comercios.buscarComercios(buscar.strip(), categoria, municipio, destacado, verificado)
                .stream().map(this::convertirResumen).toList();
    }

    // Obtiene la ficha publicada y obliga a indicar municipio si el slug es ambiguo.
    public ComercioDetalleDto obtenerComercioPorSlug(String slug, String municipio) {
        List<Comercio> encontrados = comercios.obtenerPorSlug(slug, municipio);
        if (encontrados.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se ha encontrado el comercio solicitado");
        }
        if (encontrados.size() > 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Indica el municipio para identificar el comercio");
        }
        Comercio c = encontrados.getFirst();
        return new ComercioDetalleDto(c.getId(), c.getNombre(), c.getSlug(), convertirCategoria(c.getCategoria()),
                convertirMunicipio(c.getMunicipio()), c.getDescripcion(), c.getDireccion(), c.getCodigoPostal(),
                c.getTelefono(), c.getWhatsapp(), c.getEmail(), c.getWeb(), c.getInstagram(), c.getGoogleMapsUrl(),
                c.isDestacado(), c.isVerificado(), c.isDemo(), c.getFechaVerificacion(),
                c.getHorarios().stream().map(h -> new HorarioDto(h.getDiaSemana(), h.getHoraApertura(), h.getHoraCierre(), h.isCerrado())).toList(),
                c.getImagenes().stream().map(this::convertirImagen).toList(),
                c.getFuentes().stream().map(f -> new FuenteComercioDto(f.getTipoFuente(), f.getUrl(), f.getFechaConsulta())).toList());
    }

    // Selecciona la imagen principal y limita la descripción para el listado.
    private ComercioResumenDto convertirResumen(Comercio c) {
        String descripcion = c.getDescripcion();
        if (descripcion != null && descripcion.length() > 180) descripcion = descripcion.substring(0, 177) + "…";
        return new ComercioResumenDto(c.getId(), c.getNombre(), c.getSlug(), convertirCategoria(c.getCategoria()),
                convertirMunicipio(c.getMunicipio()), descripcion, c.getDireccion(), c.getTelefono(), c.getWhatsapp(),
                c.isDestacado(), c.isVerificado(), c.isDemo(),
                c.getImagenes().isEmpty() ? null : convertirImagen(c.getImagenes().getFirst()));
    }

    // Copia únicamente los datos públicos de la categoría.
    private CategoriaDto convertirCategoria(Categoria c) {
        return new CategoriaDto(c.getId(), c.getNombre(), c.getSlug(), c.getIcono());
    }

    // Copia únicamente los datos públicos del municipio.
    private MunicipioDto convertirMunicipio(Municipio m) {
        return new MunicipioDto(m.getId(), m.getNombre(), m.getSlug());
    }

    // Conserva URL, descripción accesible y orden de la imagen.
    private ImagenDto convertirImagen(ImagenComercio i) {
        return new ImagenDto(i.getUrl(), i.getTextoAlternativo(), i.getOrden());
    }
}
