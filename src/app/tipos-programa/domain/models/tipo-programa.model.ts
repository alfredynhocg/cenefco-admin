export interface TipoPrograma {
  id_tipoprograma:      number;
  nombre_tipoprograma:  string;
  descripcion:          string | null;
  orden:                number | null;
  activo:               boolean | null;
  created_at:           string | null;
}

export interface TipoProgramaListResponse { data: TipoPrograma[]; total: number; }
export interface TipoProgramaListParams { query?: string; pageIndex?: number; pageSize?: number; refresh?: number; }
export interface CreateTipoProgramaPayload {
  nombre_tipoprograma: string; descripcion?: string | null;
  orden?: number; activo?: boolean;
}
