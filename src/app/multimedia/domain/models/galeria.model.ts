export type GaleriaTipo = 'fotos' | 'videos' | 'mixto';
export type GaleriaItemTipo = 'foto' | 'video';

export interface Galeria {
  id: number;
  titulo: string;
  descripcion: string | null;
  portada_url: string | null;
  tipo: GaleriaTipo;
  orden: number;
  activo: boolean;
  items_count?: number;
  created_at: string | null;
}

export interface GaleriaListResponse {
  data: Galeria[];
  total: number;
}

export interface GaleriaListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  refresh?: number;
}

export interface CreateGaleriaPayload {
  titulo: string;
  descripcion?: string | null;
  portada_url?: string | null;
  tipo?: GaleriaTipo;
  orden?: number;
  activo?: boolean;
}

export interface GaleriaItem {
  id: number;
  galeria_id: number;
  tipo: GaleriaItemTipo;
  url: string;
  thumbnail_url: string | null;
  titulo: string | null;
  descripcion: string | null;
  orden: number;
  created_at: string | null;
}

export interface GaleriaItemListResponse {
  data: GaleriaItem[];
  total: number;
}

export interface GaleriaItemListParams {
  galeria_id?: number;
  pageIndex?: number;
  pageSize?: number;
  refresh?: number;
}

export interface CreateGaleriaItemPayload {
  galeria_id: number;
  tipo?: GaleriaItemTipo;
  url: string;
  thumbnail_url?: string | null;
  titulo?: string | null;
  descripcion?: string | null;
  orden?: number;
}
