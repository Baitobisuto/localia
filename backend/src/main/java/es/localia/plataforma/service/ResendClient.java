package es.localia.plataforma.service;

public interface ResendClient {
    void enviar(String from, String to, String subject, String text);
}
