export interface DirectorioEntry {
  id: number;
  secretaria_id: number | null;
  secretaria_nombre: string | null;
  nombre: string;
  descripcion: string | null;
  responsable: string | null;
  cargo_responsable: string | null;
  telefono: string | null;
  telefono_interno: string | null;
  email: string | null;
  ubicacion: string | null;
  horario: string | null;
  foto_url: string | null;
  orden: number;
  activo: boolean;
}

export interface DirectorioListResponse {
  data: DirectorioEntry[];
  total: number;
}

export interface DirectorioListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  activo?: string;
  refresh?: number;
}

export interface CreateDirectorioPayload {
  secretaria_id?: number | null;
  nombre: string;
  descripcion?: string | null;
  responsable?: string | null;
  cargo_responsable?: string | null;
  telefono?: string | null;
  telefono_interno?: string | null;
  email?: string | null;
  ubicacion?: string | null;
  horario?: string | null;
  foto_url?: string | null;
  orden?: number;
  activo?: boolean;
}

export interface Secretaria {
  id: number;
  nombre: string;
}

export interface SecretariaListResponse {
  data: Secretaria[];
  total: number;
}
