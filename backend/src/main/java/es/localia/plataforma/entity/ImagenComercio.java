package es.localia.plataforma.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.List;

@Entity
@Table(name = "imagen_comercio")
public class ImagenComercio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comercio_id")
    private Comercio comercio;
    private String url;
    private String textoAlternativo;
    private int orden;

    protected ImagenComercio() {}

    public Long getId() { return id; }
    public Comercio getComercio() { return comercio; }
    public String getUrl() { return url; }
    public String getTextoAlternativo() { return textoAlternativo; }
    public int getOrden() { return orden; }
}
