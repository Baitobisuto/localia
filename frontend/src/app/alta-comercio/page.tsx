import { FormularioSolicitud } from "@/components/FormularioSolicitud";
import { crearMetadata } from "@/lib/seo";

export const metadata = crearMetadata("Añade tu negocio", "Solicita aparecer en ProxiMolar. Revisaremos tus datos antes de publicar el negocio.", "/alta-comercio", false);

// Presenta el alta como solicitud de revisión, sin publicación automática.
export default function AltaComercio() {
  return <div className="container section solicitud-pagina"><span className="eyebrow">UN SITIO PARA LO LOCAL</span><h1>Añade tu negocio</h1>
    <p>¿Tienes un comercio o trabajas por tu cuenta? Solicita aparecer en ProxiMolar. Revisaremos la información antes de publicar una ficha.</p>
    <FormularioSolicitud tipo="comercio"/>
  </div>;
}
