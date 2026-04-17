export interface DecretoMunicipal {
  id: number;
  numero: string;
  tipo: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  pdf_url: string | null;
  pdf_nombre: string | null;
  estado: string;
  fecha_promulgacion: string | null;
  anio: number;
  publicado_en_web: boolean;
  publicado_por: number | null;
  created_at: string | null;
}

export interface DecretoMunicipalListResponse {
  data: DecretoMunicipal[];
  total: number;
}

export interface DecretoMunicipalListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateDecretoMunicipalPayload {
  numero: string;
  tipo: string;
  titulo: string;
  descripcion?: string | null;
  pdf_url?: string | null;
  pdf_nombre?: string | null;
  estado: string;
  fecha_promulgacion?: string | null;
  anio: number;
  publicado_en_web?: boolean;
}
