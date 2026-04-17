import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EjePei,
  EjePeiListParams,
  EjePeiListResponse,
  CreateEjePeiPayload,
} from '../../domain/models/eje-pei.model';

@Injectable({ providedIn: 'root' })
export class EjePeiService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/ejes-pei';

  getAll(params: EjePeiListParams = {}): Observable<EjePeiListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<EjePeiListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<EjePei> {
    return this.http.get<EjePei>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateEjePeiPayload): Observable<EjePei> {
    return this.http.post<EjePei>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateEjePeiPayload>): Observable<EjePei> {
    return this.http.put<EjePei>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
