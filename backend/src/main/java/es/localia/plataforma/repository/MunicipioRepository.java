package es.localia.plataforma.repository;

import es.localia.plataforma.entity.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MunicipioRepository extends JpaRepository<Municipio, Long> {
    // Obtiene únicamente los municipios publicados, ordenados por nombre.
    @Query("select m from Municipio m where m.activo = true order by m.nombre")
    List<Municipio> obtenerActivos();
}
