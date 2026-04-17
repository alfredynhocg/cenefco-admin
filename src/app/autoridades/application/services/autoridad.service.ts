import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Autoridad,
  AutoridadListParams,
  AutoridadListResponse,
  CreateAutoridadPayload,
  SecretariaListResponse,
} from '../../domain/models/autoridad.model';

@Injectable({ providedIn: 'root' })
export class AutoridadService {
  private http = inject(HttpClient);
  private readonly baseUrl     = '/api/v1/autoridades';
  private readonly secretarUrl = '/api/v1/secretarias';

  getAll(params: AutoridadListParams = {}): Observable<AutoridadListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<AutoridadListResponse>(this.baseUrl, { params: httpParams });
  }

  getSecretarias(): Observable<SecretariaListResponse> {
    return this.http.get<SecretariaListResponse>(this.secretarUrl);
  }

  create(data: CreateAutoridadPayload): Observable<Autoridad> {
    return this.http.post<Autoridad>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateAutoridadPayload>): Observable<Autoridad> {
    return this.http.put<Autoridad>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
