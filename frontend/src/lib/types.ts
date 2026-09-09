export type Municipio = { id: number; nombre: string; slug: string };
export type Categoria = Municipio & { icono: string | null };
export type Imagen = { url: string; textoAlternativo: string; orden: number };
export type Horario = { diaSemana: number; horaApertura: string | null; horaCierre: string | null; cerrado: boolean };
export type Fuente = { tipoFuente: string; url: string; fechaConsulta: string };
export type ComercioResumen = {
  id: number; nombre: string; slug: string; categoria: Categoria; municipio: Municipio;
  descripcion: string | null; direccion: string | null; telefono: string | null; whatsapp: string | null;
  destacado: boolean; verificado: boolean; demo: boolean; imagenPrincipal: Imagen | null;
};
export type ComercioDetalle = Omit<ComercioResumen, "imagenPrincipal"> & {
  codigoPostal: string | null; email: string | null; web: string | null; instagram: string | null;
  googleMapsUrl: string | null; fechaVerificacion: string | null;
  horarios: Horario[]; imagenes: Imagen[]; fuentes: Fuente[];
};
export type Filtros = { buscar?: string; categoria?: string; municipio?: string; destacado?: string; verificado?: string };
