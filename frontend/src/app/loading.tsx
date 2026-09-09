// Informa de la carga del catálogo sin mostrar negocios ficticios como sustitución.
export default function Loading() {
  return <div className="container section" role="status" aria-live="polite"><p className="eyebrow">UN MOMENTO, ESTAMOS MIRANDO CERCA</p><h1>Cargando el directorio…</h1><div className="loading-block"/><span className="sr-only">Cargando negocios</span></div>;
}
