import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerCatalogoLocal } from "@/lib/seo-local";
import { crearMetadata, crearSchemaListado } from "@/lib/seo";
import { MigasPan } from "@/components/MigasPan";
import { JsonLd } from "@/components/JsonLd";
import { TarjetaComercio } from "@/components/TarjetaComercio";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ municipioSlug: string }> };

// Evita publicar listados municipales vacíos o extender landings sin revisión editorial.
async function cargarListado(params: Props["params"]) {
  if ((await params).municipioSlug !== "el-molar") notFound();
  const catalogo = await obtenerCatalogoLocal();
  if (!catalogo.municipio || !catalogo.comercios.length) notFound();
  return catalogo;
}

// Identifica el listado completo con una URL independiente del buscador con filtros.
export async function generateMetadata({ params }: Props) {
  await cargarListado(params);
  return crearMetadata("Comercios y servicios en El Molar", "Consulta el listado de comercios y servicios de El Molar en ProxiMolar. Encuentra su actividad, dirección y datos de contacto en las fichas del directorio.", "/el-molar/comercios");
}

// Muestra todos los negocios reales con contenido útil y accesos a las categorías publicadas.
export default async function ComerciosMunicipales({ params }: Props) {
  const { comercios, landings } = await cargarListado(params);
  return <div className="container section directory">
    <MigasPan elementos={[{ nombre: "Inicio", ruta: "/" }, { nombre: "El Molar", ruta: "/el-molar" }, { nombre: "Comercios y servicios", ruta: "/el-molar/comercios" }]}/>
    <h1>Comercios y servicios en El Molar</h1><p className="lead">Consulta los negocios de El Molar publicados en el directorio. Cada ficha describe su actividad y muestra la ubicación o el contacto disponibles para que puedas seguir tu consulta directamente con el negocio.</p>
    <p><Link className="text-link" href="/comercios?municipio=el-molar">Buscar por nombre y filtrar negocios de El Molar</Link></p>
    {landings.length > 0 && <nav className="category-grid" aria-label="Categorías del directorio">{landings.map(l => <Link className="category-item" key={l.ruta} href={l.ruta}>{l.titulo}</Link>)}</nav>}
    <div className="results-heading"><h2>{comercios.length} negocios publicados</h2></div><JsonLd datos={crearSchemaListado(comercios)}/>
    <div className="business-grid">{comercios.map(c => <TarjetaComercio key={c.id} comercio={c}/>)}</div>
  </div>;
}
