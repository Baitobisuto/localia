// Escapa etiquetas HTML para insertar datos externos como JSON sin ejecutar su contenido.
export function JsonLd({ datos }: { datos: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}/>;
}
