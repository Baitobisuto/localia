package es.localia.plataforma;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.localia.plataforma.repository.SolicitudComercioRepository;
import es.localia.plataforma.repository.SolicitudPublicidadRepository;
import es.localia.plataforma.service.ResendClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "localia.mail.enabled=true",
        "localia.mail.admin=destino-privado@example.test",
        "localia.resend.from=ProxiMolar <notificaciones@example.test>",
        "localia.resend.api-key=resend-test-key"
})
@AutoConfigureMockMvc
@Testcontainers
@ExtendWith(OutputCaptureExtension.class)
class SolicitudesIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper json;

    @Autowired
    SolicitudComercioRepository comercios;

    @Autowired
    SolicitudPublicidadRepository publicidad;

    @MockitoBean
    ResendClient resendClient;

    @DynamicPropertySource
    static void configurarBaseDatos(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
        r.add("spring.flyway.locations", () -> "classpath:db/migration");
    }

    @BeforeEach
    void limpiarSolicitudes() {
        comercios.deleteAll();
        publicidad.deleteAll();
    }

    private Map<String, Object> datos(String tipo) {
        Map<String, Object> d = new LinkedHashMap<>();

        d.put("nombreNegocio", "  Negocio ficticio de prueba  ");
        d.put("personaContacto", "Contacto ficticio");
        d.put("email", "prueba@example.test");
        d.put("telefono", "+34 600 000 000");
        d.put("consentimientoPrivacidad", true);
        d.put("sitioWeb", "");

        if (tipo.equals("comercio")) {
            d.put("categoria", "Actividad de prueba");
            d.put("direccion", "Dirección ficticia");
            d.put(
                    "descripcion",
                    "Descripción ficticia\nSegunda línea."
            );
            d.put("web", "https://example.test");
            d.put("whatsapp", "  ");
        } else {
            d.put("tipoInteres", "PROMOCION");
            d.put("mensaje", "Propuesta ficticia");
        }

        return d;
    }

    @ParameterizedTest
    @CsvSource({"comercio", "publicidad"})
    void guardaYNotificaSinPublicar(String tipo) throws Exception {

        doAnswer(invocacion -> {
            assertThat(
                    TransactionSynchronizationManager
                            .isActualTransactionActive()
            ).isFalse();

            assertThat(
                    comercios.count() + publicidad.count()
            ).isEqualTo(1);

            String remitente = invocacion.getArgument(0);
            String destinatario = invocacion.getArgument(1);
            String asunto = invocacion.getArgument(2);
            String contenido = invocacion.getArgument(3);

            assertThat(remitente)
                    .isEqualTo("ProxiMolar <notificaciones@example.test>");

            assertThat(destinatario)
                    .isEqualTo("destino-privado@example.test");

            assertThat(asunto)
                    .contains("ProxiMolar");

            assertThat(contenido)
                    .contains(
                            "ID:",
                            "PENDIENTE",
                            "prueba@example.test"
                    );

            return null;

        }).when(resendClient)
                .enviar(
                        anyString(),
                        anyString(),
                        anyString(),
                        anyString()
                );

        mvc.perform(
                        post("/api/solicitudes-" + tipo)
                                .contentType("application/json")
                                .content(
                                        json.writeValueAsBytes(datos(tipo))
                                )
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$", aMapWithSize(2)))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(
                        jsonPath("$.estado")
                                .value("PENDIENTE")
                )
                .andExpect(
                        header()
                                .string("Cache-Control", "no-store")
                )
                .andExpect(
                        header()
                                .string(
                                        "X-Robots-Tag",
                                        containsString("noindex")
                                )
                )
                .andExpect(
                        content()
                                .string(
                                        not(
                                                containsString(
                                                        "destino-privado@example.test"
                                                )
                                        )
                                )
                );

        verify(resendClient)
                .enviar(
                        anyString(),
                        anyString(),
                        anyString(),
                        anyString()
                );

        if (tipo.equals("comercio")) {
            var s = comercios.findAll().getFirst();

            assertThat(s.getNombreNegocio())
                    .isEqualTo("Negocio ficticio de prueba");

            assertThat(s.getWhatsapp()).isNull();

            assertThat(
                    s.getConsentimientoPrivacidad()
            ).isTrue();

            assertThat(
                    s.getVersionPrivacidad()
            ).isEqualTo("2026-09-15");

            assertThat(s.getCreatedAt()).isNotNull();

            assertThat(s.getEstado())
                    .isEqualTo("PENDIENTE");

        } else {
            assertThat(
                    publicidad.findAll()
                            .getFirst()
                            .getEstado()
            ).isEqualTo("PENDIENTE");
        }

        mvc.perform(
                        get(
                                "/api/comercios?buscar="
                                        + "Negocio ficticio de prueba"
                        )
                )
                .andExpect(
                        content().json("[]")
                );
    }

    @ParameterizedTest
    @CsvSource({
            "comercio,nombreNegocio",
            "publicidad,nombreNegocio",
            "comercio,email",
            "publicidad,email",
            "comercio,largo",
            "publicidad,largo",
            "comercio,sitioWeb",
            "publicidad,sitioWeb",
            "comercio,html",
            "publicidad,html",
            "comercio,consentimientoPrivacidad",
            "publicidad,consentimientoPrivacidad",
            "comercio,consentimientoAusente",
            "publicidad,consentimientoAusente",
            "comercio,web",
            "publicidad,tipoInteres"
    })
    void rechazaDatosInvalidos(
            String tipo,
            String caso
    ) throws Exception {

        var d = datos(tipo);

        switch (caso) {
            case "nombreNegocio" ->
                    d.put(caso, "   ");

            case "email" ->
                    d.put(caso, "no-es-email");

            case "largo" ->
                    d.put(
                            "nombreNegocio",
                            "x".repeat(161)
                    );

            case "sitioWeb" ->
                    d.put(caso, " ");

            case "html" ->
                    d.put(
                            "personaContacto",
                            "<b>persona</b>"
                    );

            case "consentimientoPrivacidad" ->
                    d.put(caso, false);

            case "consentimientoAusente" ->
                    d.remove(
                            "consentimientoPrivacidad"
                    );

            case "web" ->
                    d.put(
                            caso,
                            "javascript:alert(1)"
                    );

            case "tipoInteres" ->
                    d.put(
                            caso,
                            "INVENTADO"
                    );

            default ->
                    throw new IllegalArgumentException();
        }

        mvc.perform(
                        post("/api/solicitudes-" + tipo)
                                .contentType("application/json")
                                .content(
                                        json.writeValueAsBytes(d)
                                )
                )
                .andExpect(
                        status().isBadRequest()
                )
                .andExpect(
                        jsonPath("$.codigo")
                                .value("SOLICITUD_INVALIDA")
                )
                .andExpect(
                        content()
                                .string(
                                        not(
                                                containsString(
                                                        "destino-privado@example.test"
                                                )
                                        )
                                )
                );

        assertThat(
                comercios.count() + publicidad.count()
        ).isZero();

        verifyNoInteractions(resendClient);
    }

    @ParameterizedTest
    @CsvSource({"comercio", "publicidad"})
    void falloCorreoConservaSolicitud(
            String tipo,
            CapturedOutput salida
    ) throws Exception {

        doThrow(
                new IllegalStateException(
                        "credencial-ficticia-secreta"
                )
        )
                .when(resendClient)
                .enviar(
                        anyString(),
                        anyString(),
                        anyString(),
                        anyString()
                );

        mvc.perform(
                        post("/api/solicitudes-" + tipo)
                                .contentType("application/json")
                                .content(
                                        json.writeValueAsBytes(
                                                datos(tipo)
                                        )
                                )
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.estado")
                                .value("PENDIENTE")
                )
                .andExpect(
                        content()
                                .string(
                                        not(
                                                containsString(
                                                        "destino-privado@example.test"
                                                )
                                        )
                                )
                );

        assertThat(
                comercios.count() + publicidad.count()
        ).isEqualTo(1);

        assertThat(salida)
                .contains("resultado=fallido")
                .doesNotContain(
                        "credencial-ficticia-secreta",
                        "destino-privado@example.test"
                );
    }

    @Test
    void sinLecturaNiAsignacionMasiva() throws Exception {

        var d = datos("comercio");

        d.put("estado", "APROBADA");
        d.put("id", 999);

        mvc.perform(
                        post("/api/solicitudes-comercio")
                                .contentType("application/json")
                                .content(
                                        json.writeValueAsBytes(d)
                                )
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.estado")
                                .value("PENDIENTE")
                );

        mvc.perform(
                        get("/api/solicitudes-comercio")
                )
                .andExpect(
                        status().isMethodNotAllowed()
                );

        mvc.perform(
                        get("/api/solicitudes-publicidad")
                )
                .andExpect(
                        status().isMethodNotAllowed()
                );

        mvc.perform(
                        post("/api/solicitudes-comercio")
                                .contentType("application/json")
                                .content("{roto")
                )
                .andExpect(
                        status().isBadRequest()
                );
    }
}