import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asesor, AsesorListParams, AsesorListResponse } from '../../domain/models/asesor.model';

@Injectable({ providedIn: 'root' })
export class AsesorService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/asesores';

  getAll(params: AsesorListParams = {}): Observable<AsesorListResponse> {
    return this.http.get<AsesorListResponse>(this.baseUrl, { params: params as Record<string, any> });
  }

  getOne(id: number): Observable<Asesor> {
    return this.http.get<Asesor>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Asesor>): Observable<Asesor> {
    return this.http.post<Asesor>(this.baseUrl, data);
  }

  update(id: number, data: Partial<Asesor>): Observable<Asesor> {
    return this.http.put<Asesor>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  asignarAConversacion(conversacionId: number, asesorId: number): Observable<Asesor> {
    return this.http.post<Asesor>(`/api/v1/whatsapp/conversaciones/${conversacionId}/asesor`, { asesor_id: asesorId });
  }
}
