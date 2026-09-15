package es.localia.plataforma.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;

@RestControllerAdvice
public class ErroresApi {
    private static final Logger log = LoggerFactory.getLogger(ErroresApi.class);
    public record ErrorDto(String codigo, String mensaje) {}

    // Traduce ausencias y ambigüedades de negocio a errores HTTP estables.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorDto> manejarRecurso(ResponseStatusException ex, HttpServletRequest request) {
        registrarEsperado(request, ex);
        String codigo = ex.getStatusCode().value() == 404 ? "RECURSO_NO_ENCONTRADO" : "SOLICITUD_AMBIGUA";
        return ResponseEntity.status(ex.getStatusCode()).body(new ErrorDto(codigo, ex.getReason()));
    }

    // Rechaza parámetros inválidos sin devolver sus valores al cliente ni al log.
    @ExceptionHandler({HandlerMethodValidationException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErrorDto> manejarValidacion(Exception ex, HttpServletRequest request) {
        registrarEsperado(request, ex);
        return ResponseEntity.badRequest().body(new ErrorDto("SOLICITUD_INVALIDA", "Revisa los filtros: texto de hasta 120 caracteres, slugs válidos y booleanos true/false"));
    }

    // Unifica las rutas inexistentes bajo el mismo contrato de error.
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorDto> manejarRuta(NoResourceFoundException ex, HttpServletRequest request) {
        registrarEsperado(request, ex);
        return ResponseEntity.status(404).body(new ErrorDto("RECURSO_NO_ENCONTRADO", "No se ha encontrado el recurso solicitado"));
    }

    // Rechaza JSON inválido y datos de formulario sin reflejar datos personales.
    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<ErrorDto> manejarFormulario(Exception ex) {
        return ResponseEntity.badRequest().body(new ErrorDto("SOLICITUD_INVALIDA",
                "Revisa los campos obligatorios, el email, las longitudes y el consentimiento. Usa texto sin HTML y enlaces https://."));
    }

    // Informa de los métodos admitidos por cada ruta, conservando el catálogo de lectura.
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorDto> manejarMetodo(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        registrarEsperado(request, ex);
        return ResponseEntity.status(405).header("Allow", String.join(", ", ex.getSupportedMethods() == null ? new String[0] : ex.getSupportedMethods()))
                .body(new ErrorDto("METODO_NO_PERMITIDO", "Método no permitido para esta ruta"));
    }

    // Registra fallos inesperados con contexto y evita revelar detalles internos en HTTP.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDto> manejarError(Exception ex, HttpServletRequest request) {
        log.error("operacion=servir_api metodo={} excepcion={}", request.getMethod(), ex.getClass().getSimpleName());
        return ResponseEntity.internalServerError().body(new ErrorDto("ERROR_INTERNO", "No se ha podido completar la solicitud"));
    }

    // Identifica errores esperados sin registrar búsquedas ni datos de contacto.
    private void registrarEsperado(HttpServletRequest request, Exception ex) {
        log.warn("operacion=servir_catalogo metodo={} endpoint={} excepcion={}", request.getMethod(), request.getRequestURI(), ex.getClass().getSimpleName());
    }
}
