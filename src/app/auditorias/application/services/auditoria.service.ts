import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria, AuditoriaListParams, AuditoriaListResponse } from '../../domain/models/auditoria.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/auditorias';

  getAll(params: AuditoriaListParams = {}): Observable<AuditoriaListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex  != null) httpParams = httpParams.set('pageIndex',   params.pageIndex);
    if (params.pageSize   != null) httpParams = httpParams.set('pageSize',    params.pageSize);
    if (params.query)              httpParams = httpParams.set('query',       params.query);
    if (params.accion)             httpParams = httpParams.set('accion',      params.accion);
    if (params.modulo)             httpParams = httpParams.set('modulo',      params.modulo);
    if (params.fecha_desde)        httpParams = httpParams.set('fecha_desde', params.fecha_desde);
    if (params.fecha_hasta)        httpParams = httpParams.set('fecha_hasta', params.fecha_hasta);
    return this.http.get<AuditoriaListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<Auditoria> {
    return this.http.get<Auditoria>(`${this.baseUrl}/${id}`);
  }
}
