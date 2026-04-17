export interface TramiteEtapa {
  orden: number;
  nombre: string;
  descripcion: string;
  instruccion_ciudadano: string;
  es_final: boolean;
  completada: boolean;
  activa: boolean;
}

export interface TramiteSolicitudHistorial {
  etapa_orden: number;
  etapa_nombre: string;
  observacion: string | null;
  fecha: string;
}

export interface TramiteSolicitud {
  id: number;
  numero_seguimiento: string;
  tramite_id: number;
  tramite_nombre: string;
  phone: string;
  nombre_ciudadano: string;
  ci: string | null;
  etapa_actual: number;
  estado: 'en_proceso' | 'completado' | 'cancelado';
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  // Solo en detalle
  etapas?: TramiteEtapa[];
  historial?: TramiteSolicitudHistorial[];
}

export interface TramiteSolicitudListResponse {
  data: TramiteSolicitud[];
  total: number;
}

export interface TramiteSolicitudListParams {
  query?: string;
  estado?: string;
  tramite_id?: number;
  pageIndex?: number;
  pageSize?: number;
}
