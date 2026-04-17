export interface ConsultaCiudadana {
  id: number;
  ciudadano_nombre: string;
  ciudadano_ci: string | null;
  ciudadano_email: string | null;
  ciudadano_telefono: string | null;
  tipo: 'consulta' | 'queja' | 'sugerencia' | 'denuncia' | 'solicitud';
  asunto: string;
  descripcion: string;
  estado: 'pendiente' | 'en_proceso' | 'respondido' | 'cerrado';
  respuesta: string | null;
  respondido_por: string | null;
  respondido_at: string | null;
  created_at: string;
}

export interface ConsultaCiudadanaListResponse {
  data: ConsultaCiudadana[];
  total: number;
}

export interface ConsultaCiudadanaListParams {
  query?: string;
  pageIndex?: number;
  pageSize?: number;
  tipo?: string;
  estado?: string;
  refresh?: number;
}

export interface CreateConsultaPayload {
  ciudadano_nombre: string;
  ciudadano_ci?: string | null;
  ciudadano_email?: string | null;
  ciudadano_telefono?: string | null;
  tipo: string;
  asunto: string;
  descripcion: string;
  estado?: string;
}

export interface ResponderConsultaPayload {
  respuesta: string;
  estado: string;
}
