package es.localia.plataforma.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.List;

@Entity
@Table(name = "horario_comercio")
public class HorarioComercio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comercio_id")
    private Comercio comercio;
    private short diaSemana;
    private LocalTime horaApertura;
    private LocalTime horaCierre;
    private boolean cerrado;

    protected HorarioComercio() {}

    public Long getId() { return id; }
    public Comercio getComercio() { return comercio; }
    public short getDiaSemana() { return diaSemana; }
    public LocalTime getHoraApertura() { return horaApertura; }
    public LocalTime getHoraCierre() { return horaCierre; }
    public boolean isCerrado() { return cerrado; }
}
