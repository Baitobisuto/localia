package es.localia.plataforma;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LocaliaApplication {
    // Arranca la API y aplica las migraciones antes de servir peticiones.
    public static void main(String[] args) {
        SpringApplication.run(LocaliaApplication.class, args);
    }
}
