"use client";

import Link from "next/link";
import { useActionState } from "react";
import { enviarSolicitud } from "@/app/solicitudes/actions";
import { camposComunes, camposComercio, interesesPublicidad, type TipoSolicitud } from "@/lib/solicitudes";

// Comparte campos y estados accesibles de ambos formularios, manteniendo los datos si el envío falla.
export function FormularioSolicitud({ tipo }: { tipo: TipoSolicitud }) {
  const [estado, accion, pendiente] = useActionState(enviarSolicitud.bind(null, tipo), { exito: false, mensaje: "" });
  if (estado.exito) return <div className="solicitud-confirmacion" role="status"><h2>Gracias por tu solicitud</h2><p>{estado.mensaje}</p><Link className="button" href="/comercios">Explorar negocios</Link></div>;
  return <form action={accion} className="solicitud-form" aria-busy={pendiente}>
    <p>Los campos indicados como opcionales pueden dejarse vacíos. No incluyas datos sensibles.</p>
    <fieldset disabled={pendiente}>
      <legend className="sr-only">Datos de la solicitud</legend>
      {camposComunes.map(c => <div className="solicitud-campo" key={c.nombre}>
        <label htmlFor={c.nombre}>{c.etiqueta}</label>
        <input id={c.nombre} name={c.nombre} type={c.tipo} maxLength={c.limite} autoComplete={c.autocomplete} required
          minLength={c.tipo === "tel" ? 7 : undefined} pattern={c.tipo === "tel" ? "[+0-9() .\\-]{7,30}" : undefined}/>
      </div>)}
      {tipo === "comercio" ? camposComercio.map(c => <div className="solicitud-campo" key={c.nombre}>
        <label htmlFor={c.nombre}>{c.etiqueta}{c.opcional ? " (opcional)" : ""}</label>
        {c.tipo === "textarea" ? <textarea id={c.nombre} name={c.nombre} rows={4} maxLength={c.limite} required={!c.opcional}/>
          : <input id={c.nombre} name={c.nombre} type={c.tipo} maxLength={c.limite} required={!c.opcional}
            pattern={c.tipo === "url" ? "https://.*" : c.tipo === "tel" ? "[+0-9() .\\-]{7,30}" : undefined}/>}
      </div>) : <>
        <div className="solicitud-campo"><label htmlFor="tipoInteres">¿Qué te interesa?</label><select id="tipoInteres" name="tipoInteres" defaultValue="" required>
          <option value="" disabled>Selecciona una opción</option>{interesesPublicidad.map(([valor, titulo]) => <option key={valor} value={valor}>{titulo}</option>)}
        </select></div>
        <div className="solicitud-campo"><label htmlFor="mensaje">Cuéntanos tu propuesta</label><textarea id="mensaje" name="mensaje" rows={5} maxLength={2000} required/></div>
      </>}
      <div className="solicitud-trampa" aria-hidden="true"><label htmlFor="sitioWeb">Deja este campo vacío</label><input id="sitioWeb" name="sitioWeb" type="text" tabIndex={-1} autoComplete="off"/></div>
      <div className="solicitud-privacidad"><input id="consentimientoPrivacidad" name="consentimientoPrivacidad" type="checkbox" required/>
        <label htmlFor="consentimientoPrivacidad">Consiento el tratamiento de mis datos para gestionar esta solicitud y contactar conmigo, según la <Link href="/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad (se abre en otra pestaña)</Link>. No se utilizarán para marketing automático.</label>
      </div>
      <button className="button" type="submit" disabled={pendiente}>{pendiente ? "Enviando…" : "Enviar solicitud"}</button>
    </fieldset>
    <div aria-live="polite" aria-atomic="true">{pendiente && <p>Enviando solicitud…</p>}{estado.mensaje && <p className="solicitud-error" role="alert">{estado.mensaje}</p>}</div>
  </form>;
}
