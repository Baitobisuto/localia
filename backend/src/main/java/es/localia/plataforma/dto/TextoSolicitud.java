package es.localia.plataforma.dto;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Pattern;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {})
@Pattern(regexp = "[^<>\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]*")
public @interface TextoSolicitud {
    String message() default "Usa texto sin HTML ni caracteres de control";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
