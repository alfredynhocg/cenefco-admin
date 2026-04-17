export interface HistoriaMunicipio {
  id: number;
  titulo: string;
  contenido: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  imagen_url: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
}

export interface HistoriaMunicipioListResponse {
  data: HistoriaMunicipio[];
  total: number;
}

export interface HistoriaMunicipioListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateHistoriaMunicipioPayload {
  titulo: string;
  contenido?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  imagen_url?: string | null;
  orden?: number;
  activo?: boolean;
}
