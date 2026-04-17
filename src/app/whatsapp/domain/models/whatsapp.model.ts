export interface WhatsappConversacion {
  id: number;
  phone: string;
  nombre: string | null;
  estado: string;
  contexto: Record<string, any> | null;
  cliente_id: number | null;
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
