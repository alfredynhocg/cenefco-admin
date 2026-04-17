export interface Evento {
  id: number;
  tipo_evento_id: number;
  creado_por: number;
  titulo: string;
  slug: string | null;
  descripcion: string | null;
  lugar: string | null;
  latitud: number | null;
  longitud: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  todo_el_dia: boolean;
  estado: string;
  url_transmision: string | null;
  publico: boolean;
  created_at: string | null;
  tipo_nombre: string | null;
}

export interface EventoListResponse {
  data: Evento[];
  total: number;
}

export interface EventoListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateEventoPayload {
  tipo_evento_id: number;
  titulo: string;
  descripcion?: string | null;
  lugar?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
  todo_el_dia?: boolean;
  estado?: string;
  url_transmision?: string | null;
  publico?: boolean;
}

export interface TipoEvento {
  id: number;
  nombre: string;
}

export interface TipoEventoListResponse {
  data: TipoEvento[];
  total: number;
}
