export interface InformeAuditoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  pdf_url: string | null;
  pdf_nombre: string | null;
  estado: string;
  fecha: string | null;
  anio: number;
  publicado_en_web: boolean;
  publicado_por: number | null;
  created_at: string | null;
}

export interface InformeAuditoriaListResponse {
  data: InformeAuditoria[];
  total: number;
}

export interface CreateInformeAuditoriaPayload {
  nombre: string;
  descripcion?: string | null;
  pdf_url?: string | null;
  pdf_nombre?: string | null;
  estado: string;
  fecha?: string | null;
  anio: number;
  publicado_en_web: boolean;
}
