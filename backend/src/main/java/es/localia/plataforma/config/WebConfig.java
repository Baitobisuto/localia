package es.localia.plataforma.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    private final String frontendUrl;
    public WebConfig(@Value("${localia.frontend-url}") String frontendUrl) { this.frontendUrl = frontendUrl; }

    // Permite únicamente lectura desde el origen del frontend configurado.
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins(frontendUrl).allowedMethods("GET", "HEAD", "OPTIONS")
                .allowedHeaders("Accept", "Content-Type").allowCredentials(false).maxAge(3600);
    }
}
