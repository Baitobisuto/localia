import type { MetadataRoute } from "next";
import { indexable, sitio } from "@/lib/seo";

// Permite rastrear los noindex y los assets; el bloqueo de indexación se expresa en metadata.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: indexable ? new URL("/sitemap.xml", sitio).href : undefined };
}
