export type IndicadorCategoria =
  | 'social'
  | 'economico'
  | 'infraestructura'
  | 'salud'
  | 'educacion'
  | 'medioambiente'
  | 'seguridad'
  | 'otro';

export type IndicadorEstado =
  | 'en_meta'
  | 'por_encima'
  | 'por_debajo'
  | 'sin_dato';

export interface IndicadorGestion {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoria: IndicadorCategoria;
  unidad: string;
  meta: number | null;
  valor_actual: number | null;
  periodo: string | null;
  fecha_medicion: string | null;
  estado: IndicadorEstado;
  responsable: string | null;
  publicado: boolean;
  activo: boolean;
  created_at: string;
}

export interface IndicadorGestionListResponse {
  data: IndicadorGestion[];
  total: number;
}

export interface IndicadorGestionListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  categoria?: string;
  estado?: string;
  refresh?: number;
}

export interface CreateIndicadorGestionPayload {
  nombre: string;
  descripcion?: string | null;
  categoria: IndicadorCategoria;
  unidad: string;
  meta?: number | null;
  valor_actual?: number | null;
  periodo?: string | null;
  fecha_medicion?: string | null;
  estado?: IndicadorEstado;
  responsable?: string | null;
  publicado?: boolean;
  activo?: boolean;
}
