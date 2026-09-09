import type { Metadata } from "next";
import type { ComercioDetalle } from "./types";
import { rutaComercio, urlPublica, urlImagen } from "./enlaces";

export const sitio = new URL(process.env.SITE_URL ?? "http://localhost:3000");
export const indexable = process.env.INDEXABLE === "true";

// Unifica canonical y tarjetas sociales de cada página pública.
export function crearMetadata(titulo: string, descripcion: string, ruta: string, permitirIndice = true): Metadata {
  const url = new URL(ruta, sitio).href;
  return {
    title: titulo, description: descripcion, alternates: { canonical: url },
    robots: { index: indexable && permitirIndice, follow: true },
    openGraph: { title: titulo, description: descripcion, url, siteName: "Localia", locale: "es_ES", type: "website", images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: ["/opengraph-image"] },
  };
}

// Describe únicamente datos existentes; los negocios demo nunca generan LocalBusiness.
export function crearSchemaComercio(c: ComercioDetalle): object | null {
  if (c.demo) return null;
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
