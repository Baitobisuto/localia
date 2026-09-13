import { Icono } from "./Icono";

// Envía una búsqueda nativa que funciona también sin JavaScript.
export function Buscador({ valor = "", municipio = "el-molar" }: { valor?: string; municipio?: string }) {
  return <form action="/comercios" className="hero-search" role="search">
    <label htmlFor="buscar-inicio" className="sr-only">Buscar negocios por nombre</label>
    <Icono nombre="search" />
    <input id="buscar-inicio" name="buscar" defaultValue={valor} maxLength={120} placeholder="Busca comercios y profesionales" />
    <input type="hidden" name="municipio" value={municipio} />
    <button className="button" type="submit">Buscar <Icono nombre="arrow" size={18} /></button>
  </form>;
}
