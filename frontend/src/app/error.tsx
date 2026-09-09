"use client";
import Link from "next/link";

// Repite la petición completa para descartar también la respuesta de servidor fallida.
function reintentarCarga() {
  window.location.reload();
}

// Ofrece recuperación ante fallos del backend sin revelar detalles internos.
export default function Error() {
  return <div className="container section empty-state"><span className="eyebrow">VOLVEMOS A INTENTARLO</span><h1>No podemos cargar el directorio</h1><p>Hay un problema temporal al consultar los negocios. Inténtalo de nuevo en unos instantes.</p><button className="button" onClick={reintentarCarga}>Volver a intentar</button><Link className="text-link" href="/">Ir al inicio</Link></div>;
}
