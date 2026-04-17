export interface ConfigSitio {
  id: number;
  nombre: string;
  slogan: string | null;
  descripcion: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  email_contacto: string | null;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  pais: string | null;
  latitud: number | null;
  longitud: number | null;
  horario_atencion: string | null;
  meta_titulo: string | null;
  meta_descripcion: string | null;
  meta_keywords: string | null;
  google_analytics_id: string | null;
  activo: boolean;
}
