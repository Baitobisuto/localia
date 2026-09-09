import { ImageResponse } from "next/og";
export const alt = "Localia. Lo bueno está cerca. Negocios locales en El Molar.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Genera una tarjeta social propia sin imágenes ni fuentes remotas.
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#f8f6ef", color: "#244a3c", padding: "70px", flexDirection: "column", justifyContent: "space-between" }}><span style={{ fontSize: 46, fontWeight: 700 }}>localia.</span><span style={{ fontSize: 90, lineHeight: 1.05 }}>Lo bueno está cerca.</span><span style={{ fontSize: 28 }}>Descubre los negocios de El Molar · Madrid</span></div>, size);
}
