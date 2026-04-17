export type ItemTipo =
  | 'servicio'
  | 'tramite'
  | 'producto'
  | 'recurso'
  | 'otro';

export interface Item {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: ItemTipo;
  precio: number | null;
  imagen_url: string | null;
  enlace_url: string | null;
  orden: number;
  publicado: boolean;
  activo: boolean;
  created_at: string;
}

export interface ItemListResponse {
  data: Item[];
  total: number;
}

export interface ItemListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  tipo?: string;
  refresh?: number;
}

export interface CreateItemPayload {
  nombre: string;
  descripcion?: string | null;
  tipo: ItemTipo;
  precio?: number | null;
  imagen_url?: string | null;
  enlace_url?: string | null;
  orden?: number;
  publicado?: boolean;
  activo?: boolean;
}
