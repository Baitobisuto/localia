// Anuncia la carga del buscador sin adelantar un 200 en las landings y fichas canónicas.
export default function Loading() {
  return <div className="container section" role="status" aria-live="polite"><p className="eyebrow">UN MOMENTO, ESTAMOS MIRANDO CERCA</p><p className="lead">Cargando el directorio…</p><div className="loading-block"/><span className="sr-only">Cargando negocios</span></div>;
}
