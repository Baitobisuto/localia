import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerCatalogoLocal } from "@/lib/seo-local";
import { crearMetadata, crearSchemaListado } from "@/lib/seo";
import { MigasPan } from "@/components/MigasPan";
import { JsonLd } from "@/components/JsonLd";
import { TarjetaComercio } from "@/components/TarjetaComercio";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ municipioSlug: string }> };

// Solo publica el municipio editorial inicial cuando contiene negocios reales útiles.
async function cargarMunicipio(params: Props["params"]) {
  if ((await params).municipioSlug !== "el-molar") notFound();
  const catalogo = await obtenerCatalogoLocal();
  if (!catalogo.municipio || !catalogo.comercios.length) notFound();
  return catalogo;
}

// Distingue el índice municipal de la portada y del listado completo.
export async function generateMetadata({ params }: Props) {
  await cargarMunicipio(params);
  return crearMetadata("Guía de negocios y servicios de El Molar", "Explora el directorio de El Molar por categorías: descubre negocios publicados, consulta sus fichas y encuentra cómo contactar.", "/el-molar");
}

// Ofrece categorías disponibles y una selección del catálogo con acceso al listado completo.
export default async function Municipio({ params }: Props) {
  const { comercios, landings } = await cargarMunicipio(params);
  const muestra = comercios.slice(0, 3);
  return <div className="container section directory">
    <MigasPan elementos={[{ nombre: "Inicio", ruta: "/" }, { nombre: "El Molar", ruta: "/el-molar" }]}/>
    <h1>Negocios y servicios en El Molar</h1>
    <p className="lead">Explora los negocios de El Molar, Madrid, publicados en ProxiMolar. Puedes empezar por una categoría o consultar el directorio completo para localizar un negocio por su nombre.</p>
    <p>Las fichas reúnen la actividad, ubicación, contacto y fuentes disponibles. Si un dato todavía no está confirmado, lo indicamos; consulta directamente con el negocio antes de tu visita.</p>
    <p><Link className="text-link" href="/el-molar/comercios">Ver los {comercios.length} negocios del directorio de El Molar</Link></p>
    {landings.length > 0 && <section className="section"><h2>Explorar por categoría</h2><nav className="category-grid" aria-label="Categorías en El Molar">{landings.map(l => <Link className="category-item" key={l.ruta} href={l.ruta}>{l.titulo} en El Molar ({l.comercios.length})</Link>)}</nav></section>}
    <section className="section"><h2>Un punto de partida en El Molar</h2><JsonLd datos={crearSchemaListado(muestra)}/><div className="business-grid">{muestra.map(c => <TarjetaComercio key={c.id} comercio={c}/>)}</div></section>
  </div>;
}
