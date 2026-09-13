import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { obtenerCatalogoLocal } from "@/lib/seo-local";
import { crearMetadata, crearSchemaListado } from "@/lib/seo";
import { MigasPan } from "@/components/MigasPan";
import { JsonLd } from "@/components/JsonLd";
import { TarjetaComercio } from "@/components/TarjetaComercio";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ municipioSlug: string; categoriaSlug: string }> };

// Resuelve categorías con contenido suficiente y consolida el alias de servicios profesionales.
async function cargarLanding(params: Props["params"]) {
  const { municipioSlug, categoriaSlug } = await params;
  if (municipioSlug !== "el-molar") notFound();
  const catalogo = await obtenerCatalogoLocal();
  if (!catalogo.municipio) notFound();
  const landing = catalogo.landings.find(l => l.slug === categoriaSlug || l.categoria.slug === categoriaSlug);
  if (!landing) notFound();
  if (categoriaSlug !== landing.slug) permanentRedirect(landing.ruta);
  return { ...catalogo, landing };
}

// Genera metadata desde la misma selección editorial que se muestra en pantalla.
export async function generateMetadata({ params }: Props) {
  const { landing } = await cargarLanding(params);
  return crearMetadata(`${landing.titulo} en El Molar`, `Consulta ${landing.comercios.length} negocios de ${landing.categoria.nombre.toLowerCase()} en El Molar: actividad, ubicación y datos disponibles para contactar.`, landing.ruta);
}

// Reutiliza las tarjetas del directorio con introducción, enlaces y datos estructurados de la lista visible.
export default async function CategoriaLocal({ params }: Props) {
  const { landing, landings } = await cargarLanding(params);
  return <div className="container section directory">
    <MigasPan elementos={[{ nombre: "Inicio", ruta: "/" }, { nombre: "El Molar", ruta: "/el-molar" }, { nombre: landing.titulo, ruta: landing.ruta }]}/>
    <h1>{landing.titulo} en El Molar</h1><p className="lead">{landing.introduccion}</p>
    <div className="results-heading"><h2>{landing.comercios.length} negocios en El Molar</h2></div>
    <JsonLd datos={crearSchemaListado(landing.comercios)}/>
    <div className="business-grid">{landing.comercios.map(c => <TarjetaComercio key={c.id} comercio={c}/>)}</div>
    <section className="section"><h2>Seguir explorando El Molar</h2><p><Link className="text-link" href="/el-molar/comercios">Todos los comercios y servicios de El Molar</Link></p><nav className="category-grid" aria-label="Otras categorías en El Molar">{landings.filter(l => l.ruta !== landing.ruta).map(l => <Link className="category-item" href={l.ruta} key={l.ruta}>{l.titulo} en El Molar</Link>)}</nav></section>
  </div>;
}
