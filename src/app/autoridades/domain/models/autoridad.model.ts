export interface Autoridad {
  id: number;
  secretaria_id: number | null;
  nombre: string;
  apellido: string;
  cargo: string;
  tipo: string;
  perfil_profesional: string | null;
  email_institucional: string | null;
  foto_url: string | null;
  orden: number;
  activo: boolean;
  fecha_inicio_cargo: string | null;
  fecha_fin_cargo: string | null;
  slug: string | null;
}

export interface AutoridadListResponse {
  data: Autoridad[];
  total: number;
}

export interface AutoridadListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateAutoridadPayload {
  secretaria_id?: number | null;
  nombre: string;
  apellido: string;
  cargo: string;
  tipo?: string;
  perfil_profesional?: string | null;
  email_institucional?: string | null;
  foto_url?: string | null;
  orden?: number;
  activo?: boolean;
  fecha_inicio_cargo?: string | null;
  fecha_fin_cargo?: string | null;
}

export interface Secretaria {
  id: number;
  nombre: string;
}

export interface SecretariaListResponse {
  data: Secretaria[];
  total: number;
}
