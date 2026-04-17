import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DirectorioEntry,
  DirectorioListParams,
  DirectorioListResponse,
  CreateDirectorioPayload,
  SecretariaListResponse,
} from '../../domain/models/directorio.model';

@Injectable({ providedIn: 'root' })
export class DirectorioService {
  private http = inject(HttpClient);
  private readonly baseUrl      = '/api/v1/directorio-institucional';
  private readonly secretarUrl  = '/api/v1/secretarias';

  getAll(params: DirectorioListParams = {}): Observable<DirectorioListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.activo)            httpParams = httpParams.set('activo',    params.activo);
    return this.http.get<DirectorioListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<DirectorioEntry> {
    return this.http.get<DirectorioEntry>(`${this.baseUrl}/${id}`);
  }

  getSecretarias(): Observable<SecretariaListResponse> {
    return this.http.get<SecretariaListResponse>(this.secretarUrl);
  }

  create(data: CreateDirectorioPayload): Observable<DirectorioEntry> {
    return this.http.post<DirectorioEntry>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateDirectorioPayload>): Observable<DirectorioEntry> {
    return this.http.put<DirectorioEntry>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
