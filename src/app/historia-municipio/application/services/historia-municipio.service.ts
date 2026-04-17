import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  HistoriaMunicipio,
  HistoriaMunicipioListParams,
  HistoriaMunicipioListResponse,
  CreateHistoriaMunicipioPayload,
} from '../../domain/models/historia-municipio.model';

@Injectable({ providedIn: 'root' })
export class HistoriaMunicipioService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/historia-municipio';

  getAll(params: HistoriaMunicipioListParams = {}): Observable<HistoriaMunicipioListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<HistoriaMunicipioListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<HistoriaMunicipio> {
    return this.http.get<HistoriaMunicipio>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateHistoriaMunicipioPayload): Observable<HistoriaMunicipio> {
    return this.http.post<HistoriaMunicipio>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateHistoriaMunicipioPayload>): Observable<HistoriaMunicipio> {
    return this.http.put<HistoriaMunicipio>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
