import type { Metadata } from "next";
import type { ComercioDetalle, ComercioResumen } from "./types";
import { rutaComercio, urlPublica, urlImagen, numeroContacto } from "./enlaces";

// Exige un origen HTTP válido para evitar canonical distintos según la ruta.
function obtenerSitio(): URL {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://proximolar.es");
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL debe ser un origen HTTP(S), sin ruta, credenciales, query ni fragmento");
  }
  return url;
}

export const sitio = obtenerSitio();
export const indexable = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production" && process.env.INDEXABLE !== "false"
  : process.env.NODE_ENV === "production" && process.env.INDEXABLE === "true";

// Comparte el mínimo de contenido entre fichas, landings y sitemap sin exigir una marca de verificación.
export function esComercioIndexable(c: Pick<ComercioResumen, "demo" | "nombre" | "descripcion" | "direccion" | "telefono" | "whatsapp">): boolean {
  return !c.demo && Boolean(c.nombre.trim() && c.descripcion?.trim()
    && (c.direccion?.trim() || numeroContacto(c.telefono) || numeroContacto(c.whatsapp)));
}

// Unifica canonical y tarjetas sociales de cada página pública.
export function crearMetadata(titulo: string, descripcion: string, ruta: string, permitirIndice = true): Metadata {
  const url = new URL(ruta, sitio).href;
  return {
    title: titulo, description: descripcion, alternates: { canonical: url },
    robots: { index: indexable && permitirIndice, follow: true },
    openGraph: { title: titulo, description: descripcion, url, siteName: "ProxiMolar", locale: "es_ES", type: "website", images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: ["/opengraph-image"] },
  };
}

// Describe establecimientos documentados con dirección; no infiere subtipos ni servicios por categoría.
export function crearSchemaComercio(c: ComercioDetalle): object | null {
  if (!esComercioIndexable(c) || !c.direccion?.trim() || !c.fuentes.some(f => urlPublica(f.url))) return null;
  const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const horarios = c.horarios.filter(h => !h.cerrado && h.horaApertura && h.horaCierre);
  return {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    "@id": new URL(rutaComercio(c), sitio).href,
    name: c.nombre, description: c.descripcion ?? undefined,
    url: new URL(rutaComercio(c), sitio).href,
    telephone: c.telefono ?? undefined, email: c.email ?? undefined,
    address: c.direccion ? { "@type": "PostalAddress", streetAddress: c.direccion, postalCode: c.codigoPostal ?? undefined, addressLocality: c.municipio.nombre, addressCountry: "ES" } : undefined,
    image: c.imagenes.filter(i => urlPublica(i.url)).map(i => urlImagen(i.url)),
    hasMap: urlPublica(c.googleMapsUrl),
    sameAs: [urlPublica(c.web), urlPublica(c.instagram)].filter(Boolean),
    openingHoursSpecification: horarios.map(h => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${dias[h.diaSemana - 1]}`, opens: h.horaApertura?.slice(0, 5), closes: h.horaCierre?.slice(0, 5) })),
  };
}

// Identifica al directorio como sitio y organización editorial, sin atribuirle un local físico.
export function crearSchemaSitio(): object {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": new URL("/#organizacion", sitio).href, name: "ProxiMolar", url: sitio.href },
    { "@type": "WebSite", "@id": new URL("/#sitio", sitio).href, name: "ProxiMolar", url: sitio.href, inLanguage: "es", publisher: { "@id": new URL("/#organizacion", sitio).href } },
  ] };
}

// Enumera únicamente las tarjetas visibles con sus enlaces canónicos.
export function crearSchemaListado(comercios: ComercioResumen[]): object {
  return { "@context": "https://schema.org", "@type": "ItemList", itemListElement: comercios.map((c, i) => ({
    "@type": "ListItem", position: i + 1, name: c.nombre, url: new URL(rutaComercio(c), sitio).href,
  })) };
}
