package es.localia.plataforma.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.List;

@Entity
@Table(name = "comercio")
public class Comercio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "municipio_id", nullable = false)
    private Municipio municipio;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
    private String nombre;
    private String slug;
    private String descripcion;
    private String direccion;
    private String codigoPostal;
    private String telefono;
    private String whatsapp;
    private String email;
    private String web;
    private String instagram;
    private String googleMapsUrl;
    private boolean destacado;
    private boolean activo;
    private boolean demo;
    private boolean verificado;
    private LocalDate fechaVerificacion;
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    @OneToMany(mappedBy = "comercio")
    @OrderBy("diaSemana ASC, horaApertura ASC")
    private List<HorarioComercio> horarios;
    @OneToMany(mappedBy = "comercio")
    @OrderBy("orden ASC, id ASC")
    private List<ImagenComercio> imagenes;
    @OneToMany(mappedBy = "comercio")
    @OrderBy("fechaConsulta DESC, id ASC")
    private List<FuenteComercio> fuentes;

    protected Comercio() {}

    public Long getId() { return id; }
    public Municipio getMunicipio() { return municipio; }
    public Categoria getCategoria() { return categoria; }
    public String getNombre() { return nombre; }
    public String getSlug() { return slug; }
    public String getDescripcion() { return descripcion; }
    public String getDireccion() { return direccion; }
    public String getCodigoPostal() { return codigoPostal; }
    public String getTelefono() { return telefono; }
    public String getWhatsapp() { return whatsapp; }
    public String getEmail() { return email; }
    public String getWeb() { return web; }
    public String getInstagram() { return instagram; }
    public String getGoogleMapsUrl() { return googleMapsUrl; }
    public boolean isDestacado() { return destacado; }
    public boolean isActivo() { return activo; }
    public boolean isDemo() { return demo; }
    public boolean isVerificado() { return verificado; }
    public LocalDate getFechaVerificacion() { return fechaVerificacion; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<HorarioComercio> getHorarios() { return horarios; }
    public List<ImagenComercio> getImagenes() { return imagenes; }
    public List<FuenteComercio> getFuentes() { return fuentes; }
}
