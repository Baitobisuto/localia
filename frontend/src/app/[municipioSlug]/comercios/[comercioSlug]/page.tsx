import { FichaComercio, metadataFicha } from "@/components/FichaComercio";
type Props = { params: Promise<{ municipioSlug: string; comercioSlug: string }> };

// Genera metadatos de la ficha canónica dentro de su municipio.
export async function generateMetadata({ params }: Props) {
  const { municipioSlug, comercioSlug } = await params;
  return metadataFicha(comercioSlug, municipioSlug);
}

// Delega la presentación municipal a la misma ficha utilizada por la ruta corta.
export default async function ComercioMunicipal({ params }: Props) {
  const { municipioSlug, comercioSlug } = await params;
  return <FichaComercio slug={comercioSlug} municipio={municipioSlug}/>;
}
