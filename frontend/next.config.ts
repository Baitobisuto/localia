import type { NextConfig } from "next";

const proteccionesCsp = "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; frame-src 'none'; form-action 'self'";
// Observa scripts de hidratación, JSON-LD y estilos inline sin romper páginas prerenderizadas.
const cspObservacion = `${proteccionesCsp}; default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'`;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Espera al HTML y metadata completos para servir canonical y errores antes de enviar cabeceras.
  htmlLimitedBots: /.*/,
  // Las imágenes autorizadas se sirven por su URL sin abrir un proxy remoto.
  images: { unoptimized: true },
  // Centraliza las defensas HTTP; HSTS no cubre subdominios hasta resolver su TLS.
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: proteccionesCsp },
      ...(process.env.NODE_ENV === "production" ? [
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
        { key: "Content-Security-Policy-Report-Only", value: cspObservacion },
      ] : []),
    ] }];
  },
  // Solo actúa cuando DNS y TLS de www ya entregan la petición a este servicio.
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.proximolar.es" }],
      destination: "https://proximolar.es/:path*", permanent: true }];
  },
};

export default nextConfig;
