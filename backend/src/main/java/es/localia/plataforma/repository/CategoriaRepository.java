package es.localia.plataforma.repository;

import es.localia.plataforma.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // Obtiene las categorías publicadas, ordenadas por nombre.
    @Query("select c from Categoria c where c.activo = true order by c.nombre")
    List<Categoria> obtenerActivas();
}
