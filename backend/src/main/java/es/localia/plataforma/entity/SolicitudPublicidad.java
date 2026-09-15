package es.localia.plataforma.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "solicitud_publicidad")
public class SolicitudPublicidad {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre_negocio", length = 160, nullable = false)
    private String nombreNegocio;
    @Column(name = "persona_contacto", length = 120, nullable = false)
    private String personaContacto;
    @Column(name = "email", length = 254, nullable = false)
    private String email;
    @Column(name = "telefono", length = 30, nullable = false)
    private String telefono;
    @Column(name = "tipo_interes", length = 40, nullable = false)
    private String tipoInteres;
    @Column(name = "mensaje", length = 2000, nullable = false)
    private String mensaje;
    @Column(nullable = false, length = 20)
    private String estado;
    @Column(name = "consentimiento_privacidad", nullable = false)
    private boolean consentimientoPrivacidad;
    @Column(name = "version_privacidad", nullable = false, length = 30)
    private String versionPrivacidad;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SolicitudPublicidad() {}

    // Copia los datos validados y la auditoría decidida por el servicio.
    public SolicitudPublicidad(String nombreNegocio, String personaContacto, String email, String telefono, String tipoInteres, String mensaje, String estado, boolean consentimientoPrivacidad, String versionPrivacidad, Instant createdAt, Instant updatedAt) {
        this.nombreNegocio = nombreNegocio;
        this.personaContacto = personaContacto;
        this.email = email;
        this.telefono = telefono;
        this.tipoInteres = tipoInteres;
        this.mensaje = mensaje;
        this.estado = estado;
        this.consentimientoPrivacidad = consentimientoPrivacidad;
        this.versionPrivacidad = versionPrivacidad;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getNombreNegocio() { return nombreNegocio; }
    public String getPersonaContacto() { return personaContacto; }
    public String getEmail() { return email; }
    public String getTelefono() { return telefono; }
    public String getTipoInteres() { return tipoInteres; }
    public String getMensaje() { return mensaje; }
    public String getEstado() { return estado; }
    public boolean getConsentimientoPrivacidad() { return consentimientoPrivacidad; }
    public String getVersionPrivacidad() { return versionPrivacidad; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
