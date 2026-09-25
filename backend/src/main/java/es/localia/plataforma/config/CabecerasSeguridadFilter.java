package es.localia.plataforma.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class CabecerasSeguridadFilter extends OncePerRequestFilter {
    // Protege las respuestas JSON y errores de la API sin depender de Spring Security.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "SAMEORIGIN");
        response.setHeader("Content-Security-Policy", "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'self'; form-action 'none'");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        // Railway termina TLS; no se confía en X-Forwarded-Proto enviado por clientes.
        if (request.isSecure()) response.setHeader("Strict-Transport-Security", "max-age=31536000");
        chain.doFilter(request, response);
    }

    // Conserva las cabeceras cuando el contenedor despacha un error a /error.
    @Override
    protected boolean shouldNotFilterErrorDispatch() { return false; }
}
