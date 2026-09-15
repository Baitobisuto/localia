"use server";

import { ErrorApi, registrarSolicitud } from "@/lib/api";
import { camposComunes, camposComercio, type EstadoSolicitud, type TipoSolicitud } from "@/lib/solicitudes";

// Selecciona solo los campos admitidos y devuelve mensajes propios sin reflejar respuestas del backend.
export async function enviarSolicitud(tipo: TipoSolicitud, _previo: EstadoSolicitud, formulario: FormData): Promise<EstadoSolicitud> {
  if (tipo !== "comercio" && tipo !== "publicidad") return { exito: false, mensaje: "Tipo de solicitud inválido." };
  const nombres = [...camposComunes.map(c => c.nombre),
    ...(tipo === "comercio" ? camposComercio.map(c => c.nombre) : ["tipoInteres", "mensaje"]), "sitioWeb"];
  const datos: Record<string, string | boolean> = {};
  for (const nombre of nombres) {
    const valor = formulario.get(nombre);
    if (valor !== null && typeof valor !== "string") return { exito: false, mensaje: "Introduce únicamente texto en el formulario." };
    datos[nombre] = valor ?? "";
  }
  datos.consentimientoPrivacidad = formulario.get("consentimientoPrivacidad") === "on";
  try {
    await registrarSolicitud(tipo, datos);
    return { exito: true, mensaje: tipo === "comercio"
      ? "Solicitud recibida. Revisaremos los datos antes de publicar el negocio."
      : "Solicitud recibida. Revisaremos tu propuesta y nos pondremos en contacto contigo." };
  } catch (error) {
    return { exito: false, mensaje: error instanceof ErrorApi && error.estado === 400
      ? "Revisa los campos obligatorios, el email y el consentimiento. Usa texto sin HTML, teléfonos de 7 a 30 caracteres y enlaces completos https://."
      : "No hemos podido confirmar la recepción. Tus datos siguen en el formulario. Si vuelves a enviarlo, podría llegar una solicitud duplicada." };
  }
}
