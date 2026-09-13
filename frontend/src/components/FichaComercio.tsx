import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ErrorApi, obtenerComercioPorSlug } from "@/lib/api";
import { crearMetadata, crearSchemaComercio, esComercioIndexable } from "@/lib/seo";
import { obtenerCatalogoLocal } from "@/lib/seo-local";
import { MigasPan } from "./MigasPan";
import { JsonLd } from "./JsonLd";
import { formatearFecha, numeroContacto, rutaComercio, urlImagen, urlPublica } from "@/lib/enlaces";
import { Icono } from "./Icono";

// Distingue una ficha ausente de un fallo de conexión sin disfrazar errores como 404.
export async function cargarFicha(slug: string, municipio?: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 160 || (municipio && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(municipio) || municipio.length > 120))) notFound();
  try { return await obtenerComercioPorSlug(slug, municipio); }
  catch (error) { if (error instanceof ErrorApi && error.estado === 404) notFound(); throw error; }
}

// Comparte canonical municipal y excluye demos o fichas sin descripción y ubicación/contacto.
export async function metadataFicha(slug: string, municipio?: string) {
  const c = await cargarFicha(slug, municipio);
  return crearMetadata(`${c.nombre} en ${c.municipio.nombre}`, `${c.nombre}: ${c.descripcion?.trim() || `consulta los datos disponibles de ${c.categoria.nombre.toLowerCase()} en ${c.municipio.nombre}.`}`, rutaComercio(c), esComercioIndexable(c));
}

// Renderiza una única ficha para ambas rutas, mostrando solo contactos comprobados disponibles.
export async function FichaComercio({ slug, municipio }: { slug: string; municipio?: string }) {
  const c = await cargarFicha(slug, municipio);
  const telefono = numeroContacto(c.telefono);
  const whatsapp = numeroContacto(c.whatsapp);
  const web = urlPublica(c.web), instagram = urlPublica(c.instagram), mapa = urlPublica(c.googleMapsUrl);
  const schema = crearSchemaComercio(c);
  const catalogo = await obtenerCatalogoLocal();
  const tieneMunicipio = c.municipio.slug === catalogo.municipio?.slug && catalogo.comercios.length > 0;
  const rutaMunicipio = tieneMunicipio ? `/${c.municipio.slug}` : `/comercios?municipio=${c.municipio.slug}`;
  const landing = tieneMunicipio ? catalogo.landings.find(l => l.categoria.slug === c.categoria.slug) : undefined;
  const rutaCategoria = landing?.ruta ?? `/comercios?municipio=${c.municipio.slug}&categoria=${c.categoria.slug}`;
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const imagenPrincipal = c.imagenes[0];
  return <div className="container section detail">
    {schema && <JsonLd datos={schema}/>}
    <MigasPan elementos={[{ nombre: "Inicio", ruta: "/" }, { nombre: c.municipio.nombre, ruta: rutaMunicipio }, ...(landing ? [{ nombre: landing.titulo, ruta: landing.ruta }] : []), { nombre: c.nombre, ruta: rutaComercio(c) }]}/>
    {c.demo && <p className="demo-notice"><span>Negocio ficticio · Demo</span> Esta ficha es un ejemplo de desarrollo, sin datos de contacto reales.</p>}
    <div className="detail-heading"><div><Link className="eyebrow" href={rutaCategoria}>{c.categoria.nombre}</Link><h1>{c.nombre}</h1><p className="inline-location"><Icono nombre="pin" size={18}/>{c.municipio.nombre}</p></div>
      <div className="detail-badges">{c.destacado && <span className="pill">✦ Destacado</span>}{c.verificado && <span className="pill verified"><Icono nombre="check" size={17}/>Datos revisados</span>}</div></div>
    <div className="detail-cover"><Image src={urlImagen(imagenPrincipal?.url)} alt={imagenPrincipal?.textoAlternativo ?? "Ilustración genérica; fotografía no disponible"} width={1200} height={560} priority/></div>
    {c.imagenes.length > 1 && <div className="gallery">{c.imagenes.slice(1).map((i, n) => <Image key={`${i.url}-${n}`} src={urlImagen(i.url)} alt={i.textoAlternativo} width={400} height={280}/>)}</div>}
    <div className="detail-columns"><div>
      <section className="detail-section"><span className="eyebrow">CONOCE EL NEGOCIO</span><h2>Un poco sobre {c.nombre.replace(" · Demo", "")}</h2><p className="description">{c.descripcion ?? "La descripción de este negocio todavía no está disponible."}</p></section>
      <section className="detail-section"><h2><Icono nombre="pin"/>Dónde encontrarlo</h2>{c.direccion ? <address>{c.direccion}<br/>{c.codigoPostal} {c.municipio.nombre}</address> : <p>Dirección pendiente de confirmar.</p>}{mapa && <a href={mapa} target="_blank" rel="noopener noreferrer" className="text-link">Ver ubicación en el mapa <Icono nombre="arrow" size={18}/></a>}</section>
      <section className="detail-section verification-info"><h2>Información y fuentes</h2><p>{c.verificado ? `Datos básicos revisados${c.fechaVerificacion ? ` el ${formatearFecha(c.fechaVerificacion)}` : ""}.` : "Los datos básicos de esta ficha todavía no se han verificado."} La revisión de datos no implica certificación, garantía de calidad ni relación comercial.</p>
        {c.fuentes.length > 0 ? <ul className="sources">{c.fuentes.map((f, i) => <li key={i}>{urlPublica(f.url) ? <a href={urlPublica(f.url)} target="_blank" rel="noopener noreferrer">{f.tipoFuente.replaceAll("_", " ").toLowerCase()} <Icono nombre="arrow" size={15}/></a> : <span>Fuente registrada</span>}<span>Consultada el {formatearFecha(f.fechaConsulta)}</span></li>)}</ul> : <p>{c.demo ? "Los ejemplos ficticios no tienen fuentes comerciales reales." : "Todavía no hay fuentes públicas registradas."}</p>}
      </section>
    </div><aside className="contact-panel"><h2>Hablamos de tú a tú</h2><p>Contacta directamente con el negocio.</p><div className="contact-actions">
      {telefono && <a className="button" href={`tel:${telefono}`}><Icono nombre="phone" size={18}/>Llamar · {c.telefono}</a>}
      {whatsapp && <a className="button button-outline" href={`https://wa.me/${whatsapp.replace("+", "")}`} target="_blank" rel="noopener noreferrer"><Icono nombre="chat" size={18}/>Enviar WhatsApp</a>}
      {web && <a className="contact-link" href={web} target="_blank" rel="noopener noreferrer"><Icono nombre="globe" size={18}/>Sitio web <Icono nombre="arrow" size={17}/></a>}
      {instagram && <a className="contact-link" href={instagram} target="_blank" rel="noopener noreferrer"><Icono nombre="instagram" size={18}/>Instagram <Icono nombre="arrow" size={17}/></a>}
      {c.email && /^[^\s@?]+@[^\s@?]+\.[^\s@?]+$/.test(c.email) && <a className="contact-link" href={`mailto:${c.email}`}>Correo electrónico <Icono nombre="arrow" size={17}/></a>}
      {!telefono && !whatsapp && !web && !instagram && !c.email && <div className="unavailable"><Icono nombre="chat"/><span>Contacto todavía no disponible.</span></div>}
    </div><div className="hours"><h2><Icono nombre="clock" size={20}/>Horario</h2>{c.horarios.length ? <dl>{dias.map((dia, indice) => { const franjas = c.horarios.filter(h => h.diaSemana === indice + 1); return <div key={dia}><dt>{dia}</dt><dd>{franjas.length ? franjas.map((h, i) => <span key={i}>{h.cerrado ? "Cerrado" : `${h.horaApertura?.slice(0, 5)} – ${h.horaCierre?.slice(0, 5)}`}</span>) : "Sin confirmar"}</dd></div>; })}</dl> : <p>Horario pendiente de confirmar.</p>}</div></aside></div>
    <Link className="text-link" href={rutaMunicipio}>Seguir explorando {c.municipio.nombre}<Icono nombre="arrow" size={18}/></Link>
  </div>;
}
