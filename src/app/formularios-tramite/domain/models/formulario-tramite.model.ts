export interface FormularioTramite {
  id: number;
  tramite_id: number | null;
  tramite_nombre: string | null;
  titulo: string;
  descripcion: string | null;
  version: string | null;
  archivo_url: string;
  archivo_nombre: string | null;
  orden: number;
  vigente: boolean;
  publicado: boolean;
  created_at: string;
}

export interface FormularioTramiteListResponse {
  data: FormularioTramite[];
  total: number;
}

export interface FormularioTramiteListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  tramite_id?: string;
  vigente?: string;
  refresh?: number;
}

export interface CreateFormularioTramitePayload {
  tramite_id?: number | null;
  titulo: string;
  descripcion?: string | null;
  version?: string | null;
  archivo_url: string;
  archivo_nombre?: string | null;
  orden?: number;
  vigente?: boolean;
  publicado?: boolean;
}

export interface TramiteOpcion {
  id: number;
  nombre: string;
}

export interface TramiteOpcionListResponse {
  data: TramiteOpcion[];
  total: number;
}
