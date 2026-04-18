export interface WhatsappAsesor {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  especialidad: string | null;
  disponible: boolean;
  activo: boolean;
}

export interface WhatsappConversacion {
  id: number;
  phone: string;
  nombre: string | null;
  estado: string;
  contexto: Record<string, any> | null;
  cliente_id: number | null;
  asesor_id: number | null;
  asesor: WhatsappAsesor | null;
  updated_at: string | null;
  created_at: string | null;
}

export interface WhatsappMensaje {
  id: number;
  direccion: 'entrante' | 'saliente';
  tipo: string;
  contenido: string | null;
  created_at: string | null;
}
