package es.localia.plataforma.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "solicitud_comercio")
public class SolicitudComercio {
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
    @Column(name = "whatsapp", length = 30, nullable = true)
    private String whatsapp;
    @Column(name = "categoria", length = 120, nullable = false)
    private String categoria;
    @Column(name = "direccion", length = 300, nullable = false)
    private String direccion;
    @Column(name = "descripcion", length = 2000, nullable = false)
    private String descripcion;
    @Column(name = "web", length = 2000, nullable = true)
    private String web;
    @Column(name = "instagram", length = 2000, nullable = true)
    private String instagram;
    @Column(name = "observaciones", length = 2000, nullable = true)
    private String observaciones;
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

    protected SolicitudComercio() {}

    // Copia los datos validados y la auditoría decidida por el servicio.
    public SolicitudComercio(String nombreNegocio, String personaContacto, String email, String telefono, String whatsapp, String categoria, String direccion, String descripcion, String web, String instagram, String observaciones, String estado, boolean consentimientoPrivacidad, String versionPrivacidad, Instant createdAt, Instant updatedAt) {
        this.nombreNegocio = nombreNegocio;
        this.personaContacto = personaContacto;
        this.email = email;
        this.telefono = telefono;
        this.whatsapp = whatsapp;
        this.categoria = categoria;
        this.direccion = direccion;
        this.descripcion = descripcion;
        this.web = web;
        this.instagram = instagram;
        this.observaciones = observaciones;
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
    public String getWhatsapp() { return whatsapp; }
    public String getCategoria() { return categoria; }
    public String getDireccion() { return direccion; }
    public String getDescripcion() { return descripcion; }
    public String getWeb() { return web; }
    public String getInstagram() { return instagram; }
    public String getObservaciones() { return observaciones; }
    public String getEstado() { return estado; }
    public boolean getConsentimientoPrivacidad() { return consentimientoPrivacidad; }
    public String getVersionPrivacidad() { return versionPrivacidad; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
