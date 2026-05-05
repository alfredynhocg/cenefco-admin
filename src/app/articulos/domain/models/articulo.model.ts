export interface Articulo {
  id_art:     number;
  id_us_reg:  number;
  num_art:    number;
  titulo:     string;
  autor:      number | null;
  contenido:  string | null;
  id_cat_art: number | null;
  estado:     number;
  fecha_reg:  string | null;
}

export interface ArticuloListResponse { data: Articulo[]; total: number; }
export interface ArticuloListParams   { query?: string; pageIndex?: number; pageSize?: number; refresh?: number; }
export interface CreateArticuloPayload {
  id_art:     number;
  num_art:    number;
  titulo:     string;
  autor?:     number | null;
  contenido?: string | null;
  id_cat_art?: number | null;
  estado?:    number;
}
