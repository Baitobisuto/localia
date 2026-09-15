package es.localia.plataforma.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class ResendHttpClient implements ResendClient {

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final String apiKey;

    public ResendHttpClient(@Value("${localia.resend.api-key:}") String apiKey) {
        this.apiKey = apiKey;
    }

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
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException(
                        "Resend respondió con HTTP "
                                + response.statusCode()
                                + ": "
                                + response.body());
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Envío Resend interrumpido",
                    ex);
        } catch (IllegalStateException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalStateException(
                    "No se pudo conectar con Resend: "
                            + ex.getClass().getSimpleName(),
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
