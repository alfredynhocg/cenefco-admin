export interface CategoriaProgramaItem {
  id:               number;
  nombre:           string;
  slug:             string;
  descripcion:      string | null;
  imagen_url:       string | null;
  imagen_alt:       string | null;
  icono:            string | null;
  color:            string | null;
  orden:            number;
  activo:           boolean;
  meta_titulo:      string | null;
  meta_descripcion: string | null;
  created_at:       string | null;
}

export interface CategoriaProgramaListResponse { data: CategoriaProgramaItem[]; total: number; }
export interface CategoriaProgramaListParams   { query?: string; pageIndex?: number; pageSize?: number; refresh?: number; }
