import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FormularioTramite,
  FormularioTramiteListParams,
  FormularioTramiteListResponse,
  CreateFormularioTramitePayload,
  TramiteOpcionListResponse,
} from '../../domain/models/formulario-tramite.model';

@Injectable({ providedIn: 'root' })
export class FormularioTramiteService {
  private http = inject(HttpClient);
  private readonly baseUrl    = '/api/v1/formularios-tramite';
  private readonly tramitesUrl = '/api/v1/tramites';

  getAll(params: FormularioTramiteListParams = {}): Observable<FormularioTramiteListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex  != null) httpParams = httpParams.set('pageIndex',  params.pageIndex);
    if (params.pageSize   != null) httpParams = httpParams.set('pageSize',   params.pageSize);
    if (params.query)              httpParams = httpParams.set('query',      params.query);
    if (params.tramite_id)         httpParams = httpParams.set('tramite_id', params.tramite_id);
    if (params.vigente)            httpParams = httpParams.set('vigente',    params.vigente);
    return this.http.get<FormularioTramiteListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<FormularioTramite> {
    return this.http.get<FormularioTramite>(`${this.baseUrl}/${id}`);
  }

  getTramites(): Observable<TramiteOpcionListResponse> {
    return this.http.get<TramiteOpcionListResponse>(this.tramitesUrl, { params: { pageSize: 1000 } });
  }

  create(data: CreateFormularioTramitePayload): Observable<FormularioTramite> {
    return this.http.post<FormularioTramite>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateFormularioTramitePayload>): Observable<FormularioTramite> {
    return this.http.put<FormularioTramite>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
