export interface SugerenciaReclamo {
  id:                    number;
  usuario_id:            number | null;
  asunto:                string;
  mensaje:               string | null;
  email_respuesta:       string | null;
  secretaria_destino_id: number | null;
  estado:                string;
  respuesta:             string | null;
  respondido_por:        number | null;
  respondido_at:         string | null;
  created_at:            string | null;
}

export interface SugerenciaReclamoListResponse {
  data:  SugerenciaReclamo[];
  total: number;
}

export interface SugerenciaReclamoListParams {
  query?:     string;
  pageIndex?: number;
  pageSize?:  number;
  refresh?:   number;
}

export interface ResponderSugerenciaPayload {
  respuesta: string;
  estado?:   string;
}
