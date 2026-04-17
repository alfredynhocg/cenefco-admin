export interface Resena {
  id:              number;
  programa_id:     number;
  nombre_programa: string | null;
  nombre:          string;
  cargo_actual:    string | null;
  calificacion:    number;
  titulo_resena:   string | null;
  resena:          string;
  estado:          string;
  verificado:      boolean;
  destacada:       boolean;
  motivo_rechazo:  string | null;
  created_at:      string | null;
}

export interface ResenaListResponse { data: Resena[]; total: number; }
export interface ResenaListParams   { query?: string; estado?: string; programa_id?: number; pageIndex?: number; pageSize?: number; refresh?: number; }
