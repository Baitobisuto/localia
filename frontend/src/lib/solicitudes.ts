export type TipoSolicitud = "comercio" | "publicidad";
export type EstadoSolicitud = { exito: boolean; mensaje: string };

export const camposComunes = [
  { nombre: "nombreNegocio", etiqueta: "Nombre del negocio", limite: 160, tipo: "text", autocomplete: "organization" },
  { nombre: "personaContacto", etiqueta: "Persona de contacto", limite: 120, tipo: "text", autocomplete: "name" },
  { nombre: "email", etiqueta: "Email de contacto", limite: 254, tipo: "email", autocomplete: "email" },
  { nombre: "telefono", etiqueta: "Teléfono de contacto", limite: 30, tipo: "tel", autocomplete: "tel" },
] as const;

export const camposComercio = [
  { nombre: "categoria", etiqueta: "Categoría o actividad", limite: 120, tipo: "text", opcional: false },
  { nombre: "direccion", etiqueta: "Dirección del negocio o zona donde prestas servicio", limite: 300, tipo: "text", opcional: false },
  { nombre: "descripcion", etiqueta: "Descripción breve", limite: 2000, tipo: "textarea", opcional: false },
  { nombre: "web", etiqueta: "Web (https://)", limite: 2000, tipo: "url", opcional: true },
  { nombre: "instagram", etiqueta: "Instagram u otra red social (https://)", limite: 2000, tipo: "url", opcional: true },
  { nombre: "whatsapp", etiqueta: "WhatsApp con prefijo de país", limite: 30, tipo: "tel", opcional: true },
  { nombre: "observaciones", etiqueta: "Observaciones", limite: 2000, tipo: "textarea", opcional: true },
] as const;

export const interesesPublicidad = [
  ["DESTACAR_NEGOCIO", "Destacar mi negocio"],
  ["POSICION_DESTACADA", "Aparecer en una posición destacada"],
  ["PROMOCION", "Promoción u oferta"],
  ["COLABORACION", "Colaboración"],
  ["OTRO", "Otro"],
] as const;
