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

// Compone la portada local y enlaza profesionales al catálogo disponible, priorizando negocios destacados.
export default async function Inicio() {
  const { landings, comercios } = await obtenerCatalogoLocal();
  const destacados = [...comercios].sort((a, b) => Number(b.destacado) - Number(a.destacado));
  const rutaProfesionales = landings.find(l => l.categoria.slug === "servicios-profesionales")?.ruta
    ?? "/comercios?municipio=el-molar";
  return <div className="home">
    <JsonLd datos={crearSchemaSitio()}/>
    <div className="home-hero-surface"><section className="hero container">
      <div className="hero-copy"><div className="pill"><span className="status-dot"/>TU DIRECTORIO LOCAL · EL MOLAR</div>
        <h1>Encuentra lo que necesitas<br/>en <span>El Molar</span></h1>
        <p>Comercios, profesionales y servicios cerca de ti. Descubre quién puede ayudarte sin salir de tu pueblo.</p>
        <div className="home-search-panel"><span className="home-search-label">TU PRÓXIMO HALLAZGO EMPIEZA AQUÍ</span><Buscador/></div>
        <div className="search-hint">Empieza por aquí: <Link href="/el-molar">Guía de El Molar</Link>{landings.slice(0, 2).map(l => <Link key={l.ruta} href={l.ruta}>{l.titulo}</Link>)}</div>
      </div>
      <div className="hero-art"><Image src="/images/barrio.svg" alt="Ilustración de una plaza con pequeños comercios, árboles y vecinos" width={720} height={680} priority/>
        <div className="art-label"><span className="art-icon"><Icono nombre="heart"/></span><div><strong>Pequeños negocios.</strong><span>Grandes historias.</span></div><span className="hand-star">✳</span></div>
        <span className="art-caption">Una invitación a descubrir lo de aquí.</span>
      </div>
    </section></div>
    <div className="values-strip"><div className="container"><span><Icono nombre="pin" size={19}/>Cerca de ti</span><span><Icono nombre="store" size={19}/>Comercio con nombre propio</span><span><Icono nombre="heart" size={19}/>Más vida para tu pueblo</span></div></div>
    <section id="categorias" className="container section"><div className="section-heading"><div><span className="eyebrow">UN POCO DE TODO, AQUÍ AL LADO</span><h2>¿Qué necesitas hoy?</h2></div><Link className="text-link" href="/comercios">Explorar todo <Icono nombre="arrow" size={18}/></Link></div>
      <nav className="category-grid" aria-label="Categorías en El Molar">{landings.map(l => <Link key={l.ruta} href={l.ruta} className="category-item"><span><Icono nombre={l.categoria.icono ?? "store"} size={27}/></span><span className="home-category-title">{l.titulo}</span><span className="home-category-action" aria-hidden="true">Explorar <Icono nombre="arrow" size={17}/></span></Link>)}</nav>
      {!landings.length && <p>Las categorías aparecerán a medida que el directorio reúna negocios publicados.</p>}
    </section>
    <section className="container home-professionals" aria-labelledby="profesionales-titulo">
      <div className="home-callout">
        <span className="home-callout-icon"><Icono nombre="briefcase" size={32}/></span>
        <div><span className="eyebrow">AYUDA CERCA DE CASA</span><h2 id="profesionales-titulo">¿Necesitas un profesional?</h2><p>Encuentra profesionales y servicios de El Molar para resolver lo que necesitas.</p></div>
        <Link className="button" href={rutaProfesionales}>Buscar profesionales <Icono nombre="arrow" size={18}/></Link>
      </div>
    </section>
    <section className="container section featured-section"><div className="section-heading"><div><span className="eyebrow">COMERCIO LOCAL · EL MOLAR</span><h2>Descubre negocios de El Molar</h2><p>Un buen punto de partida para explorar El Molar.</p></div><Link className="text-link" href="/comercios">Ver todos los negocios <Icono nombre="arrow" size={18}/></Link></div>
      {destacados.some(c => c.demo) && <p className="demo-notice"><span>Vista de demostración</span> Estos negocios son ficticios. Estamos preparando el directorio local.</p>}
      {destacados.length ? <div className="business-grid">{destacados.slice(0, 3).map(c => <TarjetaComercio key={c.id} comercio={c}/>)}</div> : <div className="empty-state"><Icono nombre="store" size={35}/><h3>El directorio está empezando</h3><p>Los negocios destacados aparecerán aquí cuando estén disponibles.</p><Link href="/comercios" className="text-link">Explorar el directorio <Icono nombre="arrow" size={18}/></Link></div>}
    </section>
    <section className="container section home-business" aria-labelledby="negocios-titulo">
      <div className="home-business-panel">
        <span className="home-callout-icon"><Icono nombre="store" size={32}/></span>
        <div><span className="eyebrow">UN SITIO PARA LO LOCAL</span><h2 id="negocios-titulo">¿Tienes un negocio o trabajas por tu cuenta?</h2><p>Solicita aparecer en ProxiMolar o cuéntanos cómo te gustaría promocionar tu negocio.</p><div className="negocios-acciones"><Link className="button" href="/alta-comercio">Añade tu negocio</Link><Link className="button button-outline" href="/publicidad">Anúnciate</Link></div></div>
      </div>
    </section>
    <section className="container section"><div className="local-banner" id="como-funciona"><div className="banner-drawing"><Icono nombre="store" size={72}/><span>De aquí.<br/>Para ti.</span></div><div><span className="eyebrow">MUCHO MÁS QUE UN LUGAR EN EL MAPA</span><h2>Elegir cerca es<br/>dar vida a lo nuestro.</h2><p>Detrás de cada escaparate hay personas, ideas y mucho esfuerzo. ProxiMolar te ayuda a encontrarlas y a contactar directamente con ellas.</p><Link className="button" href="/comercios">Descubre tu próximo favorito <Icono nombre="arrow" size={18}/></Link></div></div></section>
  </div>;
}
