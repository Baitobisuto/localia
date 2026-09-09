package es.localia.plataforma.repository;

import es.localia.plataforma.entity.Comercio;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ComercioRepository extends JpaRepository<Comercio, Long> {
    // Busca por nombre literal y filtros combinables, excluyendo catálogos inactivos.
    @EntityGraph(attributePaths = {"municipio", "categoria"})
    @Query("""
        select c from Comercio c where c.activo = true
        and c.municipio.activo = true and c.categoria.activo = true
        and (:buscar = '' or locate(lower(:buscar), lower(c.nombre)) > 0)
        and (:categoria = '' or c.categoria.slug = :categoria)
        and (:municipio = '' or c.municipio.slug = :municipio)
        and (:destacado is null or c.destacado = :destacado)
        and (:verificado is null or c.verificado = :verificado)
        order by c.destacado desc, c.nombre asc, c.id asc
        """)
    List<Comercio> buscarComercios(@Param("buscar") String buscar, @Param("categoria") String categoria,
            @Param("municipio") String municipio, @Param("destacado") Boolean destacado,
            @Param("verificado") Boolean verificado);

    // Resuelve el slug dentro del municipio o detecta colisiones entre municipios.
    @EntityGraph(attributePaths = {"municipio", "categoria"})
    @Query("""
        select c from Comercio c where c.slug = :slug and c.activo = true
        and c.municipio.activo = true and c.categoria.activo = true
        and (:municipio = '' or c.municipio.slug = :municipio)
        """)
    List<Comercio> obtenerPorSlug(@Param("slug") String slug, @Param("municipio") String municipio);
}
