import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IndicadorGestion,
  IndicadorGestionListParams,
  IndicadorGestionListResponse,
  CreateIndicadorGestionPayload,
} from '../../domain/models/indicador-gestion.model';

@Injectable({ providedIn: 'root' })
export class IndicadorGestionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/indicadores-gestion';

  getAll(params: IndicadorGestionListParams = {}): Observable<IndicadorGestionListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.categoria)         httpParams = httpParams.set('categoria', params.categoria);
    if (params.estado)            httpParams = httpParams.set('estado',    params.estado);
    return this.http.get<IndicadorGestionListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<IndicadorGestion> {
    return this.http.get<IndicadorGestion>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateIndicadorGestionPayload): Observable<IndicadorGestion> {
    return this.http.post<IndicadorGestion>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateIndicadorGestionPayload>): Observable<IndicadorGestion> {
    return this.http.put<IndicadorGestion>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
