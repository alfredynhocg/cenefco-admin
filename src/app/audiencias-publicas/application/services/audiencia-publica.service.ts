import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AudienciaPublica,
  AudienciaPublicaListParams,
  AudienciaPublicaListResponse,
  CreateAudienciaPublicaPayload,
} from '../../domain/models/audiencia-publica.model';

@Injectable({ providedIn: 'root' })
export class AudienciaPublicaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/audiencias-publicas';

  getAll(params: AudienciaPublicaListParams = {}): Observable<AudienciaPublicaListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<AudienciaPublicaListResponse>(this.baseUrl, { params: httpParams });
  }

  create(data: CreateAudienciaPublicaPayload): Observable<AudienciaPublica> {
    return this.http.post<AudienciaPublica>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateAudienciaPublicaPayload>): Observable<AudienciaPublica> {
    return this.http.put<AudienciaPublica>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
