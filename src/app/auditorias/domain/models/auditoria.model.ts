export interface Auditoria {
  id: number;
  usuario_id: number | null;
  usuario_nombre: string | null;
  accion: string;
  modulo: string;
  modelo_id: number | null;
  descripcion: string | null;
  datos_anteriores: Record<string, unknown> | null;
  datos_nuevos: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditoriaListResponse {
  data: Auditoria[];
  total: number;
}

export interface AuditoriaListParams {
  query?: string;
  pageIndex?: number;
  pageSize?: number;
  accion?: string;
  modulo?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
