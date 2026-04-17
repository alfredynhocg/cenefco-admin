import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EstadoProyecto,
  EstadoProyectoListParams,
  EstadoProyectoListResponse,
  CreateEstadoProyectoPayload,
} from '../../domain/models/estado-proyecto.model';

@Injectable({ providedIn: 'root' })
export class EstadoProyectoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/estados-proyecto';

  getAll(params: EstadoProyectoListParams = {}): Observable<EstadoProyectoListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.estado)            httpParams = httpParams.set('estado',    params.estado);
    if (params.publicado)         httpParams = httpParams.set('publicado', params.publicado);
    return this.http.get<EstadoProyectoListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<EstadoProyecto> {
    return this.http.get<EstadoProyecto>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateEstadoProyectoPayload): Observable<EstadoProyecto> {
    return this.http.post<EstadoProyecto>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateEstadoProyectoPayload>): Observable<EstadoProyecto> {
    return this.http.put<EstadoProyecto>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
