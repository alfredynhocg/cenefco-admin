import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EscalaSalarial,
  EscalaSalarialListParams,
  EscalaSalarialListResponse,
  CreateEscalaSalarialPayload,
} from '../../domain/models/escala-salarial.model';

@Injectable({ providedIn: 'root' })
export class EscalaSalarialService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/escala-salarial';

  getAll(params: EscalaSalarialListParams = {}): Observable<EscalaSalarialListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.anio)              httpParams = httpParams.set('anio',      params.anio);
    if (params.publicado)         httpParams = httpParams.set('publicado', params.publicado);
    return this.http.get<EscalaSalarialListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<EscalaSalarial> {
    return this.http.get<EscalaSalarial>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateEscalaSalarialPayload): Observable<EscalaSalarial> {
    return this.http.post<EscalaSalarial>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateEscalaSalarialPayload>): Observable<EscalaSalarial> {
    return this.http.put<EscalaSalarial>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
