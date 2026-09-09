import Link from "next/link";

// Permite continuar la navegación cuando una ficha o ruta no existe.
export default function NotFound() {
  return <div className="container section empty-state"><span className="eyebrow">404 · AQUÍ NO ERA</span><h1>Este lugar no está en el directorio</h1><p>Puede que el enlace haya cambiado o que el negocio todavía no esté publicado.</p><Link className="button" href="/comercios">Descubrir otros negocios</Link></div>;
}
