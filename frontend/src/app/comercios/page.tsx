import Link from "next/link";
import { buscarComercios, obtenerCategorias, obtenerMunicipios } from "@/lib/api";
import { crearMetadata } from "@/lib/seo";
import type { Filtros } from "@/lib/types";
import { TarjetaComercio } from "@/components/TarjetaComercio";
import { Icono } from "@/components/Icono";

export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Mantiene el buscador y todas sus combinaciones fuera del índice; las landings concentran la navegación SEO.
export async function generateMetadata({ searchParams }: Props) {
  const parametros = await searchParams;
  const query = new URLSearchParams();
  for (const clave of Object.keys(parametros).sort()) {
    const valor = parametros[clave];
    for (const entrada of Array.isArray(valor) ? valor : valor === undefined ? [] : [valor]) query.append(clave, entrada);
  }
  return crearMetadata("Buscar negocios por nombre, categoría y municipio", "Busca en el directorio de ProxiMolar y combina filtros para encontrar un negocio. Consulta sus datos y contacta directamente.", `/comercios${query.size ? `?${query}` : ""}`, false);
}

// Lee filtros permitidos y distingue resultados vacíos de una solicitud inválida.
export default async function Comercios({ searchParams }: Props) {
  const parametros = await searchParams;
  const filtros: Filtros = {};
  let invalido = false;
  for (const clave of ["buscar", "categoria", "municipio", "destacado", "verificado"] as const) {
    const valor = parametros[clave];
    if (Array.isArray(valor)) { invalido = true; continue; }
    if (valor) filtros[clave] = valor;
  }
  if ((filtros.buscar?.length ?? 0) > 120) invalido = true;
  for (const clave of ["municipio", "categoria"] as const) {
    if (filtros[clave] && (filtros[clave].length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(filtros[clave]))) invalido = true;
  }
  for (const clave of ["destacado", "verificado"] as const) {
    if (filtros[clave] && !["true", "false"].includes(filtros[clave])) invalido = true;
  }
  if (invalido) return <div className="container section empty-state"><h1>Revisa los filtros</h1><p>La búsqueda admite hasta 120 caracteres. Selecciona las opciones del directorio.</p><Link className="button" href="/comercios">Volver al directorio</Link></div>;
  const [comercios, categorias, municipios] = await Promise.all([buscarComercios(filtros), obtenerCategorias(), obtenerMunicipios()]);
  return <div className="container section directory"><div className="breadcrumb"><Link href="/">Inicio</Link><span>/</span><span>Negocios</span></div>
    <span className="eyebrow">ENCUENTRA ESO QUE TIENES CERCA</span><h1>Buscar negocios locales</h1><p className="lead">Filtra por nombre, categoría y municipio, o explora la <Link href="/el-molar">guía de negocios de El Molar</Link>.</p>
    <form action="/comercios" className="filter-form" role="search">
      <div className="filter-search"><label htmlFor="buscar">Nombre del negocio</label><div className="input-icon"><Icono nombre="search" size={18}/><input id="buscar" name="buscar" defaultValue={filtros.buscar} placeholder="Busca por nombre…" maxLength={120}/></div></div>
      <div><label htmlFor="categoria">Categoría</label><select id="categoria" name="categoria" defaultValue={filtros.categoria ?? ""}><option value="">Todas las categorías</option>{categorias.map(c => <option key={c.id} value={c.slug}>{c.nombre}</option>)}</select></div>
      <div><label htmlFor="municipio">Municipio</label><select id="municipio" name="municipio" defaultValue={filtros.municipio ?? ""}><option value="">Todos los municipios</option>{municipios.map(m => <option key={m.id} value={m.slug}>{m.nombre}</option>)}</select></div>
      <button className="button" type="submit">Buscar <Icono nombre="arrow" size={18}/></button>
      <div className="extra-filters"><label><input name="destacado" type="checkbox" value="true" defaultChecked={filtros.destacado === "true"}/> Solo destacados</label><label><input name="verificado" type="checkbox" value="true" defaultChecked={filtros.verificado === "true"}/> Datos revisados</label><Link href="/comercios">Limpiar filtros</Link></div>
    </form>
    <div className="results-heading"><h2>{comercios.length} {comercios.length === 1 ? "negocio encontrado" : "negocios encontrados"}</h2><span>Destacados primero</span></div>
    {comercios.some(c => c.demo) && <p className="demo-notice"><span>Demostración</span> Los ejemplos marcados como demo no representan negocios reales.</p>}
    {comercios.length ? <div className="business-grid">{comercios.map(c => <TarjetaComercio key={c.id} comercio={c}/>)}</div> : <div className="empty-state"><Icono nombre="search" size={38}/><h2>No hemos encontrado negocios</h2><p>Prueba con otro nombre o amplía los filtros para seguir explorando.</p><Link href="/comercios" className="button">Ver todos los negocios</Link></div>}
  </div>;
}
