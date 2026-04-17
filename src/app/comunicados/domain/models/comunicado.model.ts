export interface Comunicado {
  id: number;
  titulo: string;
  slug: string | null;
  resumen: string | null;
  cuerpo: string | null;
  archivo_url: string | null;
  imagen_url: string | null;
  estado: string;
  destacado: boolean;
  fecha_publicacion: string | null;
  vistas: number;
  created_at: string | null;
}

export interface ComunicadoListResponse {
  data: Comunicado[];
  total: number;
}

export interface ComunicadoListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateComunicadoPayload {
  titulo: string;
  resumen?: string | null;
  cuerpo?: string | null;
  archivo_url?: string | null;
  imagen_url?: string | null;
  estado?: string;
  destacado?: boolean;
  fecha_publicacion?: string | null;
}
