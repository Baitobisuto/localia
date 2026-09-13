import type { MetadataRoute } from "next";
import { obtenerCatalogoLocal } from "@/lib/seo-local";
import { rutaComercio } from "@/lib/enlaces";
import { indexable, sitio } from "@/lib/seo";
export const dynamic = "force-dynamic";

// Comparte los criterios de publicación con las landings y fichas, sin inventar fechas de actualización.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexable) return [];
  const { municipio, comercios, reales, landings } = await obtenerCatalogoLocal();
  const rutasLocales = municipio && comercios.length ? ["/el-molar", "/el-molar/comercios", ...landings.map(l => l.ruta)] : [];
  return ["/", ...rutasLocales, ...reales.map(rutaComercio)].map(ruta => ({ url: new URL(ruta, sitio).href }));
}
