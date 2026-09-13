import "server-only";
import { cache } from "react";
import { buscarComercios, obtenerCategorias, obtenerMunicipios } from "./api";
import { esComercioIndexable } from "./seo";

// Selección editorial acotada: las categorías amplias no se convierten en oficios específicos.
const secciones: Record<string, { slug: string; titulo: string; introduccion: string }> = {
  restauracion: { slug: "restauracion", titulo: "Restauración", introduccion: "Consulta los establecimientos de restauración publicados en el directorio. En cada ficha encontrarás la ubicación y los datos disponibles para contactar antes de tu visita." },
  salud: { slug: "salud", titulo: "Salud", introduccion: "Localiza los negocios de salud del directorio y consulta su dirección y contacto. Confirma directamente con el establecimiento los servicios y horarios que necesites." },
  belleza: { slug: "belleza", titulo: "Belleza y cuidado personal", introduccion: "Encuentra negocios de belleza y cuidado personal. Consulta qué actividad describe cada ficha y utiliza sus datos de contacto para preguntar por servicios y disponibilidad." },
  tiendas: { slug: "tiendas", titulo: "Tiendas", introduccion: "Explora las tiendas publicadas y consulta su actividad y ubicación. Contacta con cada comercio para confirmar productos disponibles antes de desplazarte." },
  "hogar-y-reparaciones": { slug: "hogar-y-reparaciones", titulo: "Hogar y reparaciones", introduccion: "Consulta los negocios clasificados en hogar y reparaciones. Revisa la actividad de cada uno para distinguir venta de materiales y otros servicios, y pregunta directamente por lo que necesitas." },
  motor: { slug: "motor", titulo: "Motor y automóvil", introduccion: "Encuentra negocios del automóvil, desde recambios hasta los talleres que figuren en el listado. Consulta cada ficha y confirma con el negocio si puede atender tu vehículo." },
  formacion: { slug: "formacion", titulo: "Formación", introduccion: "Consulta los centros y negocios de formación publicados. Sus fichas permiten localizar y contactar con cada uno para preguntar por cursos, niveles y horarios." },
  inmobiliaria: { slug: "inmobiliaria", titulo: "Inmobiliarias", introduccion: "Localiza los negocios inmobiliarios del directorio y consulta sus datos de contacto para preguntar directamente por sus servicios." },
  "servicios-profesionales": { slug: "profesionales", titulo: "Profesionales", introduccion: "Este listado reúne los negocios clasificados en Servicios profesionales. Consulta su actividad y contacta con cada uno para confirmar si atiende tu consulta; el directorio no presupone especialidades que no estén descritas." },
  "ocio-y-actividades": { slug: "ocio-y-actividades", titulo: "Ocio y actividades", introduccion: "Descubre los negocios de ocio y actividades publicados. Consulta su ubicación y contacta directamente para confirmar propuestas, fechas y condiciones." },
};

// Construye un único catálogo editorial por petición a partir de la API pública existente.
export const obtenerCatalogoLocal = cache(async () => {
  const [municipios, categorias, comercios] = await Promise.all([obtenerMunicipios(), obtenerCategorias(), buscarComercios()]);
  const municipio = municipios.find(m => m.slug === "el-molar");
  const reales = comercios.filter(esComercioIndexable);
  const locales = reales.filter(c => c.municipio.slug === municipio?.slug);
  const landings = municipio ? categorias.flatMap(categoria => {
    const seccion = secciones[categoria.slug];
    const negocios = locales.filter(c => c.categoria.slug === categoria.slug);
    if (!seccion || negocios.length < 2) return [];
    return [{ ...seccion, categoria, comercios: negocios, ruta: `/${municipio.slug}/${seccion.slug}` }];
  }) : [];
  return { municipio, comercios: locales, reales, landings };
});
