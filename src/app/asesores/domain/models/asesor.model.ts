export interface Asesor {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  especialidad: string | null;
  disponible: boolean;
  activo: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface AsesorListResponse { data: Asesor[]; total: number; }
export interface AsesorListParams   { query?: string; activo?: boolean; pageIndex?: number; pageSize?: number; refresh?: number; }
