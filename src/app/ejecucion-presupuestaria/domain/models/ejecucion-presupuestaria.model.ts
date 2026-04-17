export type PeriodoTipo = 'mensual' | 'trimestral' | 'semestral' | 'anual';

export interface EjecucionPresupuestaria {
  id: number;
  anio: number;
  periodo: PeriodoTipo;
  mes: number | null;
  trimestre: number | null;
  semestre: number | null;
  unidad_ejecutora: string;
  programa: string | null;
  fuente_financiamiento: string | null;
  presupuesto_inicial: number;
  presupuesto_vigente: number;
  ejecutado: number;
  porcentaje_ejecucion: number;
  descripcion: string | null;
  archivo_url: string | null;
  archivo_nombre: string | null;
  publicado: boolean;
  created_at: string;
}

export interface EjecucionPresupuestariaListResponse {
  data: EjecucionPresupuestaria[];
  total: number;
}

export interface EjecucionPresupuestariaListParams {
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  anio?: string;
  periodo?: string;
  publicado?: string;
  refresh?: number;
}

export interface CreateEjecucionPayload {
  anio: number;
  periodo: PeriodoTipo;
  mes?: number | null;
  trimestre?: number | null;
  semestre?: number | null;
  unidad_ejecutora: string;
  programa?: string | null;
  fuente_financiamiento?: string | null;
  presupuesto_inicial: number;
  presupuesto_vigente: number;
  ejecutado: number;
  descripcion?: string | null;
  archivo_url?: string | null;
  archivo_nombre?: string | null;
  publicado?: boolean;
}
