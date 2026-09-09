import type { MetadataRoute } from "next";
import { indexable, sitio } from "@/lib/seo";

// Bloquea rastreo en desarrollo y anuncia el sitemap solo al habilitar producción.
export default function robots(): MetadataRoute.Robots {
  return { rules: indexable ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" }, sitemap: indexable ? new URL("/sitemap.xml", sitio).href : undefined };
}
