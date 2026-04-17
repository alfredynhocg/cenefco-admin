export interface Noticia {
  id: number;
  categoria_id: number;
  autor_id: number;
  titulo: string;
  slug: string | null;
  entradilla: string | null;
  cuerpo: string | null;
  imagen_principal_url: string | null;
  imagen_alt: string | null;
  estado: string;
  destacada: boolean;
  fecha_publicacion: string | null;
  vistas: number;
  meta_titulo: string | null;
  meta_descripcion: string | null;
  created_at: string | null;
  etiquetas: { id: number; nombre: string }[];
  categoria_nombre?: string | null;
}

export interface NoticiaListResponse {
  data: Noticia[];
  total: number;
}

export interface NoticiaListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateNoticiaPayload {
  categoria_id: number;
  titulo: string;
  entradilla?: string | null;
  cuerpo?: string | null;
  imagen_principal_url?: string | null;
  imagen_alt?: string | null;
  estado?: string;
  destacada?: boolean;
  fecha_publicacion?: string | null;
  meta_titulo?: string | null;
  meta_descripcion?: string | null;
  etiquetas?: number[];
}

export interface CategoriaNoticia {
  id: number;
  nombre: string;
}

export interface CategoriaNoticiaListResponse {
  data: CategoriaNoticia[];
  total: number;
}

export interface Etiqueta {
  id: number;
  nombre: string;
}

export interface EtiquetaListResponse {
  data: Etiqueta[];
  total: number;
}
