import Image from "next/image";
import Link from "next/link";
import { crearMetadata, crearSchemaSitio } from "@/lib/seo";
import { obtenerCatalogoLocal } from "@/lib/seo-local";
import { JsonLd } from "@/components/JsonLd";
import { Buscador } from "@/components/Buscador";
import { Icono } from "@/components/Icono";
import { TarjetaComercio } from "@/components/TarjetaComercio";

export const dynamic = "force-dynamic";
export const metadata = crearMetadata("Comercios y profesionales en El Molar", "Descubre comercios y servicios de El Molar, Madrid. Explora el directorio por actividad y consulta ubicación, contactos y fuentes de cada negocio.", "/");

// Compone la portada con categorías publicadas y negocios reales, priorizando los destacados disponibles.
export default async function Inicio() {
  const { landings, comercios } = await obtenerCatalogoLocal();
  const destacados = [...comercios].sort((a, b) => Number(b.destacado) - Number(a.destacado));
  return <>
    <JsonLd datos={crearSchemaSitio()}/>
    <section className="hero container">
      <div className="hero-copy"><div className="pill"><span className="status-dot"/>TU DIRECTORIO LOCAL · EL MOLAR</div>
        <h1>Comercios y servicios<br/>en <span>El Molar</span></h1>
        <p>Las tiendas de siempre. Tu próximo lugar favorito.<br className="desktop-break"/> Descubre los negocios que dan vida a tu pueblo.</p>
        <Buscador/>
        <div className="search-hint">Empieza por aquí: <Link href="/el-molar">Guía de El Molar</Link>{landings.slice(0, 2).map(l => <Link key={l.ruta} href={l.ruta}>{l.titulo}</Link>)}</div>
      </div>
      <div className="hero-art"><Image src="/images/barrio.svg" alt="Ilustración de una plaza con pequeños comercios, árboles y vecinos" width={720} height={680} priority/>
        <div className="art-label"><span className="art-icon"><Icono nombre="heart"/></span><div><strong>Pequeños negocios.</strong><span>Grandes historias.</span></div><span className="hand-star">✳</span></div>
        <span className="art-caption">Una invitación a descubrir lo de aquí.</span>
      </div>
    </section>
    <div className="values-strip"><div className="container"><span><Icono nombre="pin" size={19}/>Cerca de ti</span><span><Icono nombre="store" size={19}/>Comercio con nombre propio</span><span><Icono nombre="heart" size={19}/>Más vida para tu pueblo</span></div></div>
    <section id="categorias" className="container section"><div className="section-heading"><div><span className="eyebrow">UN POCO DE TODO, AQUÍ AL LADO</span><h2>¿Qué necesitas hoy?</h2></div><Link className="text-link" href="/comercios">Explorar todo <Icono nombre="arrow" size={18}/></Link></div>
      <nav className="category-grid" aria-label="Categorías en El Molar">{landings.map(l => <Link key={l.ruta} href={l.ruta} className="category-item"><span><Icono nombre={l.categoria.icono ?? "store"} size={27}/></span><span>{l.titulo}</span></Link>)}</nav>
      {!landings.length && <p>Las categorías aparecerán a medida que el directorio reúna negocios publicados.</p>}
    </section>
    <section className="container section featured-section"><div className="section-heading"><div><span className="eyebrow">PONLES CARA. ACÉRCATE. DESCUBRE.</span><h2>Negocios para tener cerca</h2><p>Un buen punto de partida para explorar El Molar.</p></div><Link className="text-link" href="/comercios">Ver todos los negocios <Icono nombre="arrow" size={18}/></Link></div>
      {destacados.some(c => c.demo) && <p className="demo-notice"><span>Vista de demostración</span> Estos negocios son ficticios. Estamos preparando el directorio local.</p>}
      {destacados.length ? <div className="business-grid">{destacados.slice(0, 3).map(c => <TarjetaComercio key={c.id} comercio={c}/>)}</div> : <div className="empty-state"><Icono nombre="store" size={35}/><h3>El directorio está empezando</h3><p>Los negocios destacados aparecerán aquí cuando estén disponibles.</p><Link href="/comercios" className="text-link">Explorar el directorio <Icono nombre="arrow" size={18}/></Link></div>}
    </section>
    <section className="container section"><div className="local-banner" id="como-funciona"><div className="banner-drawing"><Icono nombre="store" size={72}/><span>De aquí.<br/>Para ti.</span></div><div><span className="eyebrow">MUCHO MÁS QUE UN LUGAR EN EL MAPA</span><h2>Elegir cerca es<br/>dar vida a lo nuestro.</h2><p>Detrás de cada escaparate hay personas, ideas y mucho esfuerzo. ProxiMolar te ayuda a encontrarlas y a contactar directamente con ellas.</p><Link className="button" href="/comercios">Descubre tu próximo favorito <Icono nombre="arrow" size={18}/></Link></div></div></section>
  </>;
}
