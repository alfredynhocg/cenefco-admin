import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WhatsappConversacion, WhatsappMensaje } from '../../domain/models/whatsapp.model';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private http = inject(HttpClient);

  getConversaciones(params: {
    pageIndex?: number;
    pageSize?: number;
    query?: string;
    estado?: string;
  }): Observable<{ data: WhatsappConversacion[]; total: number }> {
    let p = new HttpParams()
      .set('pageIndex', params.pageIndex ?? 1)
      .set('pageSize', params.pageSize ?? 15);

    if (params.query)  p = p.set('query', params.query);
    if (params.estado) p = p.set('estado', params.estado);

    return this.http.get<{ data: WhatsappConversacion[]; total: number }>(
      '/api/v1/whatsapp/conversaciones', { params: p }
    );
  }

  getMensajes(conversacionId: number): Observable<{ data: WhatsappMensaje[]; phone: string; nombre: string | null; estado: string; asesor_id: number | null; asesor: import('../../../whatsapp/domain/models/whatsapp.model').WhatsappAsesor | null }> {
    return this.http.get<any>(
      `/api/v1/whatsapp/conversaciones/${conversacionId}/mensajes`
    );
  }

  marcarAtendido(conversacionId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `/api/v1/whatsapp/conversaciones/${conversacionId}/atendido`, {}
    );
  }

  getTodosPhones(): Observable<{ phones: string[] }> {
    return this.http.get<{ phones: string[] }>('/api/v1/whatsapp/phones');
  }

  enviar(phone: string, mensaje: string): Observable<any> {
    return this.http.post('/api/v1/whatsapp/enviar', { phone, mensaje });
  }

  enviarMasivo(phones: string[], mensaje: string): Observable<{
    exitosos: number;
    fallidos: number;
    detalle_fallidos: { phone: string; error: string }[];
  }> {
    return this.http.post<any>('/api/v1/whatsapp/enviar-masivo', { phones, mensaje });
  }

  enviarMedia(phones: string[], tipo: 'image' | 'document', archivo: File, caption = '', filename = ''): Observable<{
    exitosos: number;
    fallidos: number;
    detalle_fallidos: { phone: string; error: string }[];
  }> {
    const form = new FormData();
    phones.forEach(p => form.append('phones[]', p));
    form.append('tipo', tipo);
    form.append('archivo', archivo, archivo.name);
    if (caption)  form.append('caption', caption);
    if (filename) form.append('filename', filename);
    return this.http.post<any>('/api/v1/whatsapp/enviar-media', form);
  }

  enviarPlantilla(phone: string, plantilla: string, params: Record<string, string>): Observable<any> {
    return this.http.post('/api/v1/whatsapp/plantilla', { phone, plantilla, params });
  }
}
