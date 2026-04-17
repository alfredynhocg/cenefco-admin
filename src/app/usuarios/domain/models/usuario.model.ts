export interface Rol {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role_id: number | null;
  role_nombre: string | null;
  activo: boolean;
  email_verified_at: string | null;
  created_at: string | null;
}

export interface UsuarioListResponse {
  data: Usuario[];
  total: number;
}

export interface UsuarioListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateUsuarioPayload {
  name: string;
  email: string;
  password: string;
  role_id?: number | null;
  activo: boolean;
}

export interface UpdateUsuarioPayload {
  name: string;
  email: string;
  password?: string | null;
  role_id?: number | null;
  activo: boolean;
}
