import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EjecucionPresupuestaria,
  EjecucionPresupuestariaListParams,
  EjecucionPresupuestariaListResponse,
  CreateEjecucionPayload,
} from '../../domain/models/ejecucion-presupuestaria.model';

@Injectable({ providedIn: 'root' })
export class EjecucionPresupuestariaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/ejecucion-presupuestaria';

  getAll(params: EjecucionPresupuestariaListParams = {}): Observable<EjecucionPresupuestariaListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.anio)              httpParams = httpParams.set('anio',      params.anio);
    if (params.periodo)           httpParams = httpParams.set('periodo',   params.periodo);
    if (params.publicado)         httpParams = httpParams.set('publicado', params.publicado);
    return this.http.get<EjecucionPresupuestariaListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<EjecucionPresupuestaria> {
    return this.http.get<EjecucionPresupuestaria>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateEjecucionPayload): Observable<EjecucionPresupuestaria> {
    return this.http.post<EjecucionPresupuestaria>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateEjecucionPayload>): Observable<EjecucionPresupuestaria> {
    return this.http.put<EjecucionPresupuestaria>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
