import { FichaComercio, metadataFicha } from "@/components/FichaComercio";
type Props = { params: Promise<{ slug: string }> };

// Resuelve los metadatos de la ruta corta con canonical municipal.
export async function generateMetadata({ params }: Props) { return metadataFicha((await params).slug); }

// Reutiliza la ficha compartida para enlaces cortos sin municipio.
export default async function Comercio({ params }: Props) { return <FichaComercio slug={(await params).slug}/>; }
