import type { ComercioResumen } from "./types";

// Genera una ruta de ficha inequívoca incluso al añadir municipios.
export function rutaComercio(comercio: Pick<ComercioResumen, "municipio" | "slug">): string {
  return `/${comercio.municipio.slug}/comercios/${comercio.slug}`;
}

// Descarta protocolos ejecutables en enlaces procedentes de datos externos.
export function urlPublica(valor: string | null | undefined): string | undefined {
  if (!valor) return undefined;
  try {
    const url = new URL(valor);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

// Acepta imágenes locales o URLs HTTP sin permitir rutas relativas ambiguas.
export function urlImagen(valor?: string): string {
  if (valor?.startsWith("/images/") && !valor.includes("..")) return valor;
  return urlPublica(valor) ?? "/images/local.svg";
}

// Normaliza teléfonos y evita construir acciones con valores vacíos o inválidos.
export function numeroContacto(valor: string | null): string | undefined {
  if (!valor || !/^\+?[\d\s().-]+$/.test(valor)) return undefined;
  const numero = valor.replace(/[^\d+]/g, "");
  return /^\+?\d{7,15}$/.test(numero) ? numero : undefined;
}

// Presenta fechas de calendario sin desplazamientos por zona horaria.
export function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${fecha}T12:00:00Z`));
}
