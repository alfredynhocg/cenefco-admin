export interface Subcenefco {
  id:                   number;
  nombre:               string;
  zona_cobertura:       string | null;
  direccion_fisica:     string | null;
  telefono:             string | null;
  email:                string | null;
  imagen_url:           string | null;
  latitud:              number | null;
  longitud:             number | null;
  tramites_disponibles: string | null;
  activa:               boolean;
  slug:                 string;
  created_at:           string | null;
}

export interface SubcenefcoListResponse {
  data:  Subcenefco[];
  total: number;
}

export interface SubcenefcoListParams {
  query?:     string;
  pageIndex?: number;
  pageSize?:  number;
  refresh?:   number;
}

export interface CreateSubcenefcoPayload {
  nombre:                string;
  zona_cobertura?:       string | null;
  direccion_fisica?:     string | null;
  telefono?:             string | null;
  email?:                string | null;
  imagen_url?:           string | null;
  latitud?:              number | null;
  longitud?:             number | null;
  tramites_disponibles?: string | null;
  activa?:               boolean;
}
