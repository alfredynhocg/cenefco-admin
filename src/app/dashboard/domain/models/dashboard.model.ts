export interface DashboardResumen {
  tramites_pendientes: number;
  tramites_mes: number;
  comunicados_publicados: number;
  noticias_publicadas: number;
  consultas_nuevas: number;
  eventos_proximos: number;
  total_usuarios: number;
  total_proyectos_activos: number;
}

export interface ActividadMensual {
  mes: string;
  tramites: number;
  comunicados: number;
  noticias: number;
}

export interface UltimaSolicitud {
  id: number;
  numero: string;
  ciudadano: string;
  tipo_tramite: string;
  estado: string;
  fecha: string;
}

export interface UltimaConsulta {
  id: number;
  nombre: string;
  asunto: string;
  estado: string;
  fecha: string;
}

export interface TopTramite {
  id: number;
  nombre: string;
  slug: string;
  total_solicitudes: number;
}

export interface DashboardStats {
  resumen: DashboardResumen;
  tramites_por_estado: Record<string, number>;
  actividad_mensual: ActividadMensual[];
  ultimas_solicitudes: UltimaSolicitud[];
  ultimas_consultas: UltimaConsulta[];
  top_tramites: TopTramite[];
}
