import { FormularioSolicitud } from "@/components/FormularioSolicitud";
import { crearMetadata } from "@/lib/seo";

export const metadata = crearMetadata("Anúnciate", "Solicita información para promocionar tu negocio en ProxiMolar.", "/publicidad", false);

// Recoge interés publicitario sin inventar tarifas ni prometer posiciones o anuncios.
export default function Publicidad() {
  return <div className="container section solicitud-pagina"><span className="eyebrow">DA A CONOCER TU NEGOCIO</span><h1>Anúnciate en ProxiMolar</h1>
    <p>Cuéntanos cómo te gustaría promocionar tu negocio. Revisaremos tu propuesta y contactaremos contigo para valorar las posibilidades. Enviar este formulario no contrata ni publica un anuncio.</p>
    <FormularioSolicitud tipo="publicidad"/>
  </div>;
}
