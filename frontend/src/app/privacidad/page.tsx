import { crearMetadata } from "@/lib/seo";

export const metadata = crearMetadata("Privacidad de las solicitudes", "Información sobre los datos recogidos para gestionar solicitudes de alta y publicidad.", "/privacidad", false);

// Explica el tratamiento de datos asociado a las solicitudes de alta y publicidad.
export default function Privacidad() {
  return (
    <article className="container section solicitud-pagina">
      <h1>Privacidad de las solicitudes</h1>
      <p>Versión: 15 de septiembre de 2026.</p>

      <p>
        <strong>Responsable del tratamiento:</strong> ProxiMolar, proyecto gestionado por Oscar Fernandez.
      </p>

      <h2>Finalidad y datos</h2>
      <p>
        Recogemos los datos del negocio, de la persona de contacto y el contenido de la solicitud
        para revisar el alta o la propuesta de publicidad y contactar contigo.
        Los campos opcionales no son necesarios para enviar la solicitud.
        No incluyas datos sensibles ni información personal de terceros.
      </p>

      <h2>Consentimiento</h2>
      <p>
        El tratamiento de esta solicitud se basa en el consentimiento que otorgas al marcar la casilla
        y enviarla. Guardamos la fecha y la versión de la información aceptada.
        No destinaremos estos datos a newsletters ni marketing automático.
        Enviar una solicitud no publica el negocio ni un anuncio.
      </p>

      <h2>Acceso y conservación</h2>
      <p>
        Las solicitudes se almacenan para su revisión y no son públicas.
        Se conservarán durante el tiempo necesario para gestionar la solicitud
        y, posteriormente, durante el plazo necesario para atender posibles responsabilidades legales.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar acceso, rectificación, supresión, limitación y portabilidad,
        y ejercer oposición cuando proceda. También puedes retirar tu consentimiento
        sin afectar a la licitud del tratamiento anterior.
      </p>

      <p>
        Para ejercer estos derechos puedes contactar en{" "}
        <a className="text-link" href="mailto:privacidad@proximolar.es">
          privacidad@proximolar.es
        </a>.
      </p>

      <p>
        Puedes presentar una reclamación ante la{" "}
        <a className="text-link" href="https://www.aepd.es">
          Agencia Española de Protección de Datos
        </a>.
      </p>
    </article>
  );
}
