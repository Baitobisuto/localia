package es.localia.plataforma;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Transactional
@Sql("/datos-test.sql")
class CatalogoIntegrationTest {
    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired MockMvc mvc;

    // Conecta el contexto real a PostgreSQL vacío para probar Flyway y validación JPA.
    @DynamicPropertySource
    static void configurarBaseDatos(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.locations", () -> "classpath:db/migration");
    }

    // Comprueba arranque, respuesta pública y exclusión de registros inactivos.
    @Test
    void contextoYListadoFuncionan() throws Exception {
        mvc.perform(get("/api/comercios")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[*].nombre", not(hasItem("Oculto"))));
        mvc.perform(get("/api/municipios")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(2)));
        mvc.perform(get("/api/categorias")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(10)));
    }

    // Verifica cada filtro real, valores falsos, combinación y búsqueda literal.
    @ParameterizedTest
    @CsvSource({
        "buscar=CAFÉ,1", "categoria=salud,1", "municipio=el-molar,2", "destacado=true,1",
        "verificado=true,1", "destacado=false,2", "verificado=false,2",
        "municipio=el-molar&categoria=restauracion&destacado=true,1", "buscar=inexistente,0", "buscar=%,0"
    })
    void filtrosFuncionan(String filtros, int cantidad) throws Exception {
        mvc.perform(get("/api/comercios?" + filtros)).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(cantidad)));
    }

    // Comprueba las rutas de navegación y que la ficha incluye relaciones ordenadas.
    @Test
    void detalleYRutasMunicipalesFuncionan() throws Exception {
        mvc.perform(get("/api/comercios/cafe-prueba")).andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Café de prueba"))
                .andExpect(jsonPath("$.horarios[0].diaSemana").value(1))
                .andExpect(jsonPath("$.imagenes[0].url").value("/images/restaurante.svg"))
                .andExpect(jsonPath("$.fuentes[0].tipoFuente").value("OTRO"));
        mvc.perform(get("/api/municipios/el-molar/comercios/cafe-prueba")).andExpect(status().isOk());
        mvc.perform(get("/api/municipios/el-molar/comercios")).andExpect(jsonPath("$", hasSize(2)));
        mvc.perform(get("/api/municipios/el-molar/categorias/salud/comercios")).andExpect(jsonPath("$", hasSize(1)));
    }

    // Evita exponer fichas ausentes, inactivas o pertenecientes a otro municipio.
    @ParameterizedTest
    @CsvSource({"/api/comercios/no-existe", "/api/comercios/oculto", "/api/municipios/otro/comercios/cafe-prueba"})
    void inexistentesDevuelven404(String ruta) throws Exception {
        mvc.perform(get(ruta)).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.codigo").value("RECURSO_NO_ENCONTRADO"));
    }

    // Comprueba ambigüedad entre municipios y resolución mediante la ruta completa.
    @Test
    void slugAmbiguoExigeMunicipio() throws Exception {
        mvc.perform(get("/api/comercios/compartido")).andExpect(status().isConflict());
        mvc.perform(get("/api/municipios/el-molar/comercios/compartido")).andExpect(status().isOk());
    }

    // Comprueba validación, métodos de escritura y política CORS por origen.
    @Test
    void validacionYSoloLecturaYCors() throws Exception {
        mvc.perform(get("/api/comercios?destacado=incorrecto")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/comercios").param("buscar", "a".repeat(121))).andExpect(status().isBadRequest());
        mvc.perform(get("/api/comercios").param("municipio", "NO valido")).andExpect(status().isBadRequest());
        mvc.perform(post("/api/comercios")).andExpect(status().isMethodNotAllowed());
        mvc.perform(get("/api/comercios").header("Origin", "http://localhost:3000"))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
        mvc.perform(options("/api/comercios").header("Origin", "https://no-autorizado.example")
                .header("Access-Control-Request-Method", "GET")).andExpect(status().isForbidden());
    }
}
