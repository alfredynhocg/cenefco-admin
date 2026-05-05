export interface Curso {
  id_programa:              number;
  id_us_reg:                number;
  nombre_programa:          string;
  slug:                     string | null;
  descripcion:              string | null;
  objetivo:                 string | null;
  dirigido:                 string | null;
  requisitos:               string | null;
  inversion:                string | null;
  creditaje:                string | null;
  nota:                     string | null;
  url_video:                string | null;
  url_whatsapp:             string | null;
  url_whatsapp2:            string | null;
  imagenes:                 string[] | null;
  foto:                     string | null;
  titulo_documento1:        string | null;
  documento1:               string | null;
  imagen_banner_url:        string | null;
  imagen_alt:               string | null;
  inicio_actividades:       string | null;
  finalizacion_actividades: string | null;
  inicio_inscripciones:     string | null;
  id_tipoprograma:          number | null;
  tipo_nombre:              string | null;
  categoria_web_id:         number | null;
  categoria_nombre:         string | null;
  estado:                   number;
  estado_web:               string;
  destacado:                boolean;
  orden:                    number;
  meta_titulo:              string | null;
  meta_descripcion:         string | null;
  mensaje_exito:            string | null;
  fecha_publicacion:        string | null;
  fecha_reg:                string | null;
}

export interface CursoListResponse {
  data:  Curso[];
  total: number;
}

export interface CursoListParams {
  query?:     string;
  pageIndex?: number;
  pageSize?:  number;
  refresh?:   number;
}

export interface CreateCursoPayload {
  nombre_programa:          string;
  slug?:                    string | null;
  descripcion?:             string | null;
  objetivo?:                string | null;
  dirigido?:                string | null;
  requisitos?:              string | null;
  inversion?:               string | null;
  creditaje?:               string | null;
  nota?:                    string | null;
  url_video?:               string | null;
  url_whatsapp?:            string | null;
  foto?:                    string | null;
  titulo_documento1?:       string | null;
  documento1?:              string | null;
  imagen_banner_url?:       string | null;
  imagen_alt?:              string | null;
  inicio_actividades?:      string | null;
  finalizacion_actividades?: string | null;
  inicio_inscripciones?:    string | null;
  id_tipoprograma?:         number | null;
  categoria_web_id?:        number | null;
  estado_web?:              string;
  destacado?:               boolean;
  orden?:                   number;
  meta_titulo?:             string | null;
  meta_descripcion?:        string | null;
  mensaje_exito?:           string | null;
}

export interface CategoriaCurso {
  id:     number;
  nombre: string;
}

export interface TipoCurso {
  id_tipoprograma: number;
  nombre_tipoprograma: string;
}

export interface CategoriaCursoListResponse {
  data:  CategoriaCurso[];
  total: number;
}

export interface TipoCursoListResponse {
  data:  TipoCurso[];
  total: number;
}
