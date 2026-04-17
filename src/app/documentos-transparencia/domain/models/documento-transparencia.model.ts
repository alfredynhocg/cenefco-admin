export type DocumentoCategoria =
  | 'presupuesto'
  | 'contrato'
  | 'resolucion'
  | 'ordenanza'
  | 'informe'
  | 'declaracion_bienes'
  | 'plan_anual'
  | 'rendicion_cuentas'
  | 'otro';

export interface DocumentoTransparencia {
  id: number;
  titulo: string;
  descripcion: string | null;
  categoria: DocumentoCategoria;
  anio: number;
  archivo_url: string;
  archivo_nombre: string | null;
  publicado: boolean;
  fecha_publicacion: string | null;
  created_at: string;
}

export interface DocumentoTransparenciaListResponse {
  data: DocumentoTransparencia[];
  total: number;
}

export interface DocumentoTransparenciaListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  categoria?: string;
  anio?: string;
  publicado?: string;
  refresh?: number;
}

export interface CreateDocumentoPayload {
  titulo: string;
  descripcion?: string | null;
  categoria: DocumentoCategoria;
  anio: number;
  archivo_url: string;
  archivo_nombre?: string | null;
  publicado?: boolean;
  fecha_publicacion?: string | null;
}
