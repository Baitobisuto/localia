import Image from "next/image";
import Link from "next/link";
import { buscarComercios, obtenerCategorias } from "@/lib/api";
import { crearMetadata } from "@/lib/seo";
import { Buscador } from "@/components/Buscador";
import { Icono } from "@/components/Icono";
import { TarjetaComercio } from "@/components/TarjetaComercio";

export const dynamic = "force-dynamic";
export const metadata = crearMetadata("Negocios locales en El Molar", "Descubre tiendas, restaurantes y servicios de El Molar. Información práctica para conectar con el comercio de tu pueblo.", "/");

// Compone la portada con categorías y destacados procedentes de la API real.
export default async function Inicio() {
  const [categorias, destacados] = await Promise.all([obtenerCategorias(), buscarComercios({ municipio: "el-molar", destacado: "true" })]);
  return <>
    <section className="hero container">
      <div className="hero-copy"><div className="pill"><span className="status-dot"/>TU DIRECTORIO LOCAL · EL MOLAR</div>
        <h1>Lo bueno<br/>está <span>más cerca</span><br/>de lo que crees.</h1>
        <p>Las tiendas de siempre. Tu próximo lugar favorito.<br className="desktop-break"/> Descubre los negocios que dan vida a tu pueblo.</p>
        <Buscador/>
        <div className="search-hint">¿Alguna idea? <Link href="/comercios?categoria=restauracion&municipio=el-molar">Dónde comer</Link><span>·</span><Link href="/comercios?categoria=tiendas&municipio=el-molar">Tiendas</Link><span>·</span><Link href="/comercios?categoria=salud&municipio=el-molar">Cuidarte</Link></div>
      </div>
      <div className="hero-art"><Image src="/images/barrio.svg" alt="Ilustración de una plaza con pequeños comercios, árboles y vecinos" width={720} height={680} priority/>
        <div className="art-label"><span className="art-icon"><Icono nombre="heart"/></span><div><strong>Pequeños negocios.</strong><span>Grandes historias.</span></div><span className="hand-star">✳</span></div>
        <span className="art-caption">Una invitación a descubrir lo de aquí.</span>
      </div>
    </section>
    <div className="values-strip"><div className="container"><span><Icono nombre="pin" size={19}/>Cerca de ti</span><span><Icono nombre="store" size={19}/>Comercio con nombre propio</span><span><Icono nombre="heart" size={19}/>Más vida para tu pueblo</span></div></div>
    <section id="categorias" className="container section"><div className="section-heading"><div><span className="eyebrow">UN POCO DE TODO, AQUÍ AL LADO</span><h2>¿Qué necesitas hoy?</h2></div><Link className="text-link" href="/comercios">Explorar todo <Icono nombre="arrow" size={18}/></Link></div>
      <div className="category-grid">{categorias.map(c => <Link key={c.id} href={`/comercios?municipio=el-molar&categoria=${c.slug}`} className="category-item"><span><Icono nombre={c.icono ?? "store"} size={27}/></span><span>{c.nombre}</span></Link>)}</div>
    </section>
    <section className="container section featured-section"><div className="section-heading"><div><span className="eyebrow">PONLES CARA. ACÉRCATE. DESCUBRE.</span><h2>Negocios para tener cerca</h2><p>Un buen punto de partida para explorar El Molar.</p></div><Link className="text-link" href="/comercios">Ver todos los negocios <Icono nombre="arrow" size={18}/></Link></div>
      {destacados.some(c => c.demo) && <p className="demo-notice"><span>Vista de demostración</span> Estos negocios son ficticios. Estamos preparando el directorio local.</p>}
      {destacados.length ? <div className="business-grid">{destacados.slice(0, 3).map(c => <TarjetaComercio key={c.id} comercio={c}/>)}</div> : <div className="empty-state"><Icono nombre="store" size={35}/><h3>El directorio está empezando</h3><p>Los negocios destacados aparecerán aquí cuando estén disponibles.</p><Link href="/comercios" className="text-link">Explorar el directorio <Icono nombre="arrow" size={18}/></Link></div>}
    </section>
    <section className="container section"><div className="local-banner" id="como-funciona"><div className="banner-drawing"><Icono nombre="store" size={72}/><span>De aquí.<br/>Para ti.</span></div><div><span className="eyebrow">MUCHO MÁS QUE UN LUGAR EN EL MAPA</span><h2>Elegir cerca es<br/>dar vida a lo nuestro.</h2><p>Detrás de cada escaparate hay personas, ideas y mucho esfuerzo. Localia te ayuda a encontrarlas y a contactar directamente con ellas.</p><Link className="button" href="/comercios">Descubre tu próximo favorito <Icono nombre="arrow" size={18}/></Link></div></div></section>
  </>;
}
