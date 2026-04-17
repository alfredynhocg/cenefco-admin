export interface Secretaria {
  id:                 number;
  nombre:             string;
  sigla:              string | null;
  atribuciones:       string | null;
  direccion_fisica:   string | null;
  telefono:           string | null;
  email:              string | null;
  horario_atencion:   string | null;
  foto_titular_url:   string | null;
  orden_organigrama:  number;
  activa:             boolean;
  slug:               string;
  created_at:         string | null;
}

export interface SecretariaListResponse {
  data:  Secretaria[];
  total: number;
}

export interface SecretariaListParams {
  query?:     string;
  pageIndex?: number;
  pageSize?:  number;
  refresh?:   number;
}

export interface CreateSecretariaPayload {
  nombre:             string;
  sigla?:             string | null;
  atribuciones?:      string | null;
  direccion_fisica?:  string | null;
  telefono?:          string | null;
  email?:             string | null;
  horario_atencion?:  string | null;
  foto_titular_url?:  string | null;
  orden_organigrama?: number;
  activa?:            boolean;
}
