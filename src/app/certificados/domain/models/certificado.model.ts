export interface CertPlantilla {
  id: number;
  nombre: string;
  tipo: string;
  imagen_url: string;
  ancho_px: number;
  alto_px: number;
  orientacion: string;
  formato_salida: string;
  calidad_jpg: number;
  fuente_default: string;
  color_default: string;
  estado: string;
  notas: string | null;
  created_at: string | null;
  campos?: CertCampo[];
}

export interface CertPlantillaListResponse {
  data: CertPlantilla[];
  total: number;
}

export interface CertCampo {
  id: number;
  plantilla_id: number;
  clave: string;
  etiqueta: string;
  tipo: string;
  pos_x_pct: number;
  pos_y_pct: number;
  ancho_pct: number | null;
  tamano_pt: number;
  color: string;
  alineacion: string;
  negrita: boolean;
  cursiva: boolean;
  mayusculas: string;
  valor_fijo: string | null;
  activo: boolean;
  orden: number;
}

export interface CertCampoListResponse {
  data: CertCampo[];
  total: number;
}

export interface ListaAprobado {
  id: number;
  imparte_id: number;
  usuario_id: number;
  inscripcion_id: number | null;
  nota_final: number | null;
  condicion: string;
  observacion: string | null;
  estado_certificado: string;
  created_at: string | null;
}

export interface ListaAprobadoListResponse {
  data: ListaAprobado[];
  total: number;
}

export interface Certificado {
  id: number;
  lista_aprobado_id: number;
  plantilla_id: number;
  usuario_id: number;
  imparte_id: number;
  nombre_en_certificado: string;
  programa_en_certificado: string;
  condicion: string;
  nota_final: number | null;
  codigo_verificacion: string;
  qr_url: string | null;
  archivo_url: string | null;
  estado: string;
  veces_verificado: number;
  created_at: string | null;
}

export interface CertificadoListResponse {
  data: Certificado[];
  total: number;
}

export interface GenerarLoteResult {
  generados: number;
  total_aprobados: number;
  errores: { usuario_id: number; nombre: string; error: string }[];
  certificados: Certificado[];
}
