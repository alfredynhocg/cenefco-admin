export interface AudienciaPublica {
  id: number;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  estado: string;
  acta_url: string | null;
  afiche_url: string | null;
  imagenes: string[];
  video_url: string | null;
  enlace_virtual: string | null;
  asistentes: number | null;
  activo: boolean;
  slug: string | null;
  created_at: string | null;
  secretaria_nombre: string | null;
}

export interface AudienciaPublicaListResponse {
  data: AudienciaPublica[];
  total: number;
}

export interface AudienciaPublicaListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateAudienciaPublicaPayload {
  titulo: string;
  descripcion?: string | null;
  tipo?: string;
  estado?: string;
  acta_url?: string | null;
  afiche_url?: string | null;
  imagenes?: string[];
  video_url?: string | null;
  enlace_virtual?: string | null;
  asistentes?: number | null;
  activo?: boolean;
}
