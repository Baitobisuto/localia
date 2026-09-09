import Image from "next/image";
import Link from "next/link";
import { rutaComercio, urlImagen } from "@/lib/enlaces";
import type { ComercioResumen } from "@/lib/types";
import { Icono } from "./Icono";

// Presenta un resumen accesible con sus marcas comerciales y de revisión independientes.
export function TarjetaComercio({ comercio: c }: { comercio: ComercioResumen }) {
  return <article className="business-card">
    <Link className="card-image" href={rutaComercio(c)} tabIndex={-1} aria-hidden="true">
      <Image src={urlImagen(c.imagenPrincipal?.url)} alt="" width={640} height={440}/>
      {c.destacado && <span className="featured-badge">✦ Destacado</span>}
      {c.demo && <span className="demo-badge">Ejemplo ficticio</span>}
    </Link>
    <div className="card-content">
      <span className="eyebrow">{c.categoria.nombre}</span>
      <h3><Link href={rutaComercio(c)}>{c.nombre}<Icono nombre="arrow" size={20}/></Link></h3>
      <p>{c.descripcion ?? "Descubre la información disponible de este negocio."}</p>
      <div className="card-bottom"><span><Icono nombre="pin" size={15}/>{c.municipio.nombre}</span>
        {c.verificado && <span className="verified" title="Datos básicos revisados; no es una certificación de calidad"><Icono nombre="check" size={15}/>Datos revisados</span>}
      </div>
    </div>
  </article>;
}
