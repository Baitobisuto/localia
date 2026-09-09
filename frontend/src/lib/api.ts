import "server-only";
import { cache } from "react";
import type { Categoria, ComercioDetalle, ComercioResumen, Filtros, Municipio } from "./types";

const apiUrl = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/$/, "");

export class ErrorApi extends Error {
  constructor(public readonly estado: number) {
    super("No se ha podido consultar el directorio");
  }
}

// Centraliza las lecturas sin caché persistente y limita la espera al backend.
async function consultarApi<T>(ruta: string): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${apiUrl}${ruta}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  } catch {
    console.error("operacion=consultar_catalogo resultado=conexion_fallida");
    throw new ErrorApi(503);
  }
  if (!respuesta.ok) {
    console.error(`operacion=consultar_catalogo estado=${respuesta.status}`);
    throw new ErrorApi(respuesta.status);
  }
  return respuesta.json() as Promise<T>;
}

// Obtiene municipios una sola vez por renderizado de servidor.
export const obtenerMunicipios = cache(() => consultarApi<Municipio[]>("/municipios"));

// Obtiene categorías una sola vez por renderizado de servidor.
export const obtenerCategorias = cache(() => consultarApi<Categoria[]>("/categorias"));

// Serializa únicamente los filtros soportados y conserva su combinación.
export async function buscarComercios(filtros: Filtros = {}): Promise<ComercioResumen[]> {
  const parametros = new URLSearchParams();
  for (const clave of ["buscar", "categoria", "municipio", "destacado", "verificado"] as const) {
    if (filtros[clave]) parametros.set(clave, filtros[clave]);
  }
  return consultarApi<ComercioResumen[]>(`/comercios?${parametros}`);
}

// Resuelve la ficha con la ruta municipal cuando el municipio es conocido.
export const obtenerComercioPorSlug = cache((slug: string, municipio?: string) =>
  consultarApi<ComercioDetalle>(municipio
    ? `/municipios/${encodeURIComponent(municipio)}/comercios/${encodeURIComponent(slug)}`
    : `/comercios/${encodeURIComponent(slug)}`));
