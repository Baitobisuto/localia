import type { MetadataRoute } from "next";
import { buscarComercios } from "@/lib/api";
import { rutaComercio } from "@/lib/enlaces";
import { indexable, sitio } from "@/lib/seo";
export const dynamic = "force-dynamic";

// Incluye solo páginas existentes y fichas reales; nunca indexa ejemplos demo.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexable) return [];
  const comercios = await buscarComercios();
  return ["/", "/comercios", ...comercios.filter(c => !c.demo).map(rutaComercio)].map(ruta => ({ url: new URL(ruta, sitio).href }));
}
