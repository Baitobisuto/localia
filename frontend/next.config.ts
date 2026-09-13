import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Espera al HTML y metadata completos para servir canonical y errores antes de enviar cabeceras.
  htmlLimitedBots: /.*/,
  // Las imágenes autorizadas se sirven por su URL sin abrir un proxy remoto.
  images: { unoptimized: true },
};

export default nextConfig;
