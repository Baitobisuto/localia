import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Las imágenes autorizadas se sirven por su URL sin abrir un proxy remoto.
  images: { unoptimized: true },
};

export default nextConfig;
