export interface EscalaSalarial {
  id: number;
  anio: number;
  secretaria: string | null;
  cargo: string;
  nivel: string | null;
  categoria: string | null;
  salario_basico: number;
  bono_antiguedad: number;
  bono_produccion: number;
  otros_bonos: number;
  total_ganado: number;
  publicado: boolean;
  created_at: string;
}

export interface EscalaSalarialListResponse {
  data: EscalaSalarial[];
  total: number;
}

export interface EscalaSalarialListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  anio?: string;
  publicado?: string;
  refresh?: number;
}

export interface CreateEscalaSalarialPayload {
  anio: number;
  secretaria?: string | null;
  cargo: string;
  nivel?: string | null;
  categoria?: string | null;
  salario_basico: number;
  bono_antiguedad?: number;
  bono_produccion?: number;
  otros_bonos?: number;
  publicado?: boolean;
}
