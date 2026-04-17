export type HimnoTipo = 'municipal' | 'departamental' | 'nacional' | 'otro';

export interface Himno {
  id: number;
  tipo: HimnoTipo;
  titulo: string;
  letra: string | null;
  autor_letra: string | null;
  autor_musica: string | null;
  audio_url: string | null;
  partitura_url: string | null;
  imagen_url: string | null;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
}

export interface HimnoListResponse {
  data: Himno[];
  total: number;
}

export interface HimnoListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  tipo?: string;
  refresh?: number;
}

export interface CreateHimnoPayload {
  tipo: HimnoTipo;
  titulo: string;
  letra?: string | null;
  autor_letra?: string | null;
  autor_musica?: string | null;
  audio_url?: string | null;
  partitura_url?: string | null;
  imagen_url?: string | null;
  descripcion?: string | null;
  orden?: number;
  activo?: boolean;
}
