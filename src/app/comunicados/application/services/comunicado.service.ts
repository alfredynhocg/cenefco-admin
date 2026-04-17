import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Comunicado,
  ComunicadoListParams,
  ComunicadoListResponse,
  CreateComunicadoPayload,
} from '../../domain/models/comunicado.model';

@Injectable({ providedIn: 'root' })
export class ComunicadoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/comunicados';

  getAll(params: ComunicadoListParams = {}): Observable<ComunicadoListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<ComunicadoListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<Comunicado> {
    return this.http.get<Comunicado>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateComunicadoPayload): Observable<Comunicado> {
    return this.http.post<Comunicado>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateComunicadoPayload>): Observable<Comunicado> {
    return this.http.put<Comunicado>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
