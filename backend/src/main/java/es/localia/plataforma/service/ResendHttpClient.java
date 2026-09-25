package es.localia.plataforma.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class ResendHttpClient implements ResendClient {

    private static final Logger log = LoggerFactory.getLogger(ResendHttpClient.class);

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    private final String apiKey;

    public ResendHttpClient(@Value("${localia.resend.api-key:}") String apiKey) {
        this.apiKey = apiKey;
    }

    // Limita la espera al proveedor y registra solo estado y tipo de fallo, nunca credenciales ni contenido.
    @Override
    public void enviar(String from, String to, String subject, String text) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("ConfiguraciÃ³n de Resend incompleta");
        }

        try {
            String json = """
                    {
                      "from": "%s",
                      "to": ["%s"],
                      "subject": "%s",
                      "text": "%s"
                    }
                    """.formatted(
                    escaparJson(from),
                    escaparJson(to),
                    escaparJson(subject),
                    escaparJson(text));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .timeout(Duration.ofSeconds(10))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {

                log.warn(
                        "operacion=resend_http resultado=fallido status={}",
                        response.statusCode());

                throw new IllegalStateException(
                        "Resend devolvió una respuesta no satisfactoria");
            }

        } catch (InterruptedException ex) {

            Thread.currentThread().interrupt();

            log.warn(
                    "operacion=resend_http resultado=fallido etapa=conexion excepcion=InterruptedException");

            throw new IllegalStateException(
                    "Envío Resend interrumpido",
                    ex);

        } catch (IllegalStateException ex) {

            throw ex;

        } catch (Exception ex) {

            log.warn(
                    "operacion=resend_http resultado=fallido etapa=conexion excepcion={}",
                    ex.getClass().getSimpleName());

            throw new IllegalStateException(
                    "No se pudo conectar con Resend",
                    ex);
        }
    }

    private String escaparJson(String valor) {
        if (valor == null) {
            return "";
        }

        return valor
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n")
                .replace("\t", "\\t");
    }
}
