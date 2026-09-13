import Link from "next/link";
import { sitio } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

// Mantiene los breadcrumbs visibles y estructurados en el mismo orden y con idénticas URLs.
export function MigasPan({ elementos }: { elementos: { nombre: string; ruta: string }[] }) {
  return <>
    <JsonLd datos={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: elementos.map((e, i) => ({ "@type": "ListItem", position: i + 1, name: e.nombre, item: new URL(e.ruta, sitio).href })) }}/>
    <nav className="breadcrumb" aria-label="Ruta de navegación">{elementos.map((e, i) => <span key={e.ruta}>
      {i > 0 && <span aria-hidden="true"> / </span>}{i === elementos.length - 1 ? <span aria-current="page">{e.nombre}</span> : <Link href={e.ruta}>{e.nombre}</Link>}
    </span>)}</nav>
  </>;
}
