import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Himno,
  HimnoListParams,
  HimnoListResponse,
  CreateHimnoPayload,
} from '../../domain/models/himno.model';

@Injectable({ providedIn: 'root' })
export class HimnoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/himnos';

  getAll(params: HimnoListParams = {}): Observable<HimnoListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.tipo)              httpParams = httpParams.set('tipo',      params.tipo);
    return this.http.get<HimnoListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<Himno> {
    return this.http.get<Himno>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateHimnoPayload): Observable<Himno> {
    return this.http.post<Himno>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateHimnoPayload>): Observable<Himno> {
    return this.http.put<Himno>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
