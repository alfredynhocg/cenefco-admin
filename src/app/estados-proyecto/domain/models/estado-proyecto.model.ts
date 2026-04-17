export type EstadoProyectoEstado =
  | 'planificacion'
  | 'en_ejecucion'
  | 'paralizado'
  | 'concluido'
  | 'cancelado';

export interface EstadoProyecto {
  id: number;
  nombre: string;
  descripcion: string | null;
  secretaria: string | null;
  categoria: string | null;
  ubicacion: string | null;
  presupuesto: number;
  estado: EstadoProyectoEstado;
  porcentaje_avance: number;
  fecha_inicio: string | null;
  fecha_fin_estimada: string | null;
  fecha_fin_real: string | null;
  imagen_url: string | null;
  publicado: boolean;
  created_at: string;
}

export interface EstadoProyectoListResponse {
  data: EstadoProyecto[];
  total: number;
}

export interface EstadoProyectoListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  estado?: string;
  publicado?: string;
  refresh?: number;
}

export interface CreateEstadoProyectoPayload {
  nombre: string;
  descripcion?: string | null;
  secretaria?: string | null;
  categoria?: string | null;
  ubicacion?: string | null;
  presupuesto?: number;
  estado?: EstadoProyectoEstado;
  porcentaje_avance?: number;
  fecha_inicio?: string | null;
  fecha_fin_estimada?: string | null;
  fecha_fin_real?: string | null;
  imagen_url?: string | null;
  publicado?: boolean;
}
