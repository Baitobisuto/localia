package es.localia.plataforma.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.List;

@Entity
@Table(name = "fuente_comercio")
public class FuenteComercio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comercio_id")
    private Comercio comercio;
    private String tipoFuente;
    private String url;
    private LocalDate fechaConsulta;

    protected FuenteComercio() {}

    public Long getId() { return id; }
    public Comercio getComercio() { return comercio; }
    public String getTipoFuente() { return tipoFuente; }
    public String getUrl() { return url; }
    public LocalDate getFechaConsulta() { return fechaConsulta; }
}
