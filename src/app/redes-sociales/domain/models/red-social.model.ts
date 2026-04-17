export interface RedSocial {
  id: number;
  plataforma: string;
  nombre_cuenta: string;
  url: string;
  icono?: string | null;
  orden: number;
  activo: boolean;
}

export interface RedSocialListResponse {
  data: RedSocial[];
  total: number;
}

export interface RedSocialListParams {
  query?: string;
  pageIndex?: number;
  pageSize?: number;
}
