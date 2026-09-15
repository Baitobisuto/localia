package es.localia.plataforma.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class PrivacidadSolicitudesFilter extends OncePerRequestFilter {
    // Evita indexación y almacenamiento de respuestas, incluidos errores en las rutas de solicitudes.
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (request.getRequestURI().startsWith("/api/solicitudes-")) {
            response.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
            response.setHeader("Cache-Control", "no-store");
        }
        chain.doFilter(request, response);
    }
}
