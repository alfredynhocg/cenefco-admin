export interface EjePei {
  id: number;
  nombre: string;
  descripcion: string | null;
  color: string | null;
  imagen_url: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
}

export interface EjePeiListResponse {
  data: EjePei[];
  total: number;
}

export interface EjePeiListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateEjePeiPayload {
  nombre: string;
  descripcion?: string | null;
  color?: string | null;
  imagen_url?: string | null;
  orden?: number;
  activo?: boolean;
}
