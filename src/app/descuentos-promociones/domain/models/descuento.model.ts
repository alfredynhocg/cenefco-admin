export interface Descuento {
  id:               number;
  codigo:           string;
  nombre:           string;
  descripcion:      string | null;
  tipo_descuento:   string;
  valor:            number;
  monto_minimo:     number | null;
  usos_maximos:     number | null;
  usos_actuales:    number;
  usos_por_usuario: number;
  programa_id:      number | null;
  activo:           boolean;
  fecha_inicio:     string | null;
  fecha_fin:        string | null;
  created_at:       string | null;
}

export interface DescuentoListResponse { data: Descuento[]; total: number; }
export interface DescuentoListParams { query?: string; pageIndex?: number; pageSize?: number; refresh?: number; }
export interface CreateDescuentoPayload {
  codigo: string; nombre: string; descripcion?: string | null;
  tipo_descuento?: string; valor: number; monto_minimo?: number | null;
  usos_maximos?: number | null; usos_por_usuario?: number;
  programa_id?: number | null; activo?: boolean;
  fecha_inicio?: string | null; fecha_fin?: string | null;
}
