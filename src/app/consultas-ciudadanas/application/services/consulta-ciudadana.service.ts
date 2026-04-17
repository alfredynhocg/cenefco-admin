import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ConsultaCiudadana,
  ConsultaCiudadanaListParams,
  ConsultaCiudadanaListResponse,
  CreateConsultaPayload,
  ResponderConsultaPayload,
} from '../../domain/models/consulta-ciudadana.model';

@Injectable({ providedIn: 'root' })
export class ConsultaCiudadanaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/consultas-ciudadanas';

  getAll(params: ConsultaCiudadanaListParams = {}): Observable<ConsultaCiudadanaListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.tipo)              httpParams = httpParams.set('tipo',      params.tipo);
    if (params.estado)            httpParams = httpParams.set('estado',    params.estado);
    return this.http.get<ConsultaCiudadanaListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<ConsultaCiudadana> {
    return this.http.get<ConsultaCiudadana>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateConsultaPayload): Observable<ConsultaCiudadana> {
    return this.http.post<ConsultaCiudadana>(this.baseUrl, data);
  }

  responder(id: number, data: ResponderConsultaPayload): Observable<ConsultaCiudadana> {
    return this.http.put<ConsultaCiudadana>(`${this.baseUrl}/${id}/responder`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
