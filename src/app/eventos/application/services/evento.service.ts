import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Evento,
  EventoListParams,
  EventoListResponse,
  CreateEventoPayload,
  TipoEventoListResponse,
} from '../../domain/models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/eventos';
  private readonly tiposUrl = '/api/v1/tipos-evento';

  getAll(params: EventoListParams = {}): Observable<EventoListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<EventoListResponse>(this.baseUrl, { params: httpParams });
  }

  getTipos(): Observable<TipoEventoListResponse> {
    return this.http.get<TipoEventoListResponse>(this.tiposUrl);
  }

  create(data: CreateEventoPayload): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateEventoPayload>): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
