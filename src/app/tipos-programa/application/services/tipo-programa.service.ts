import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoPrograma, TipoProgramaListParams, TipoProgramaListResponse, CreateTipoProgramaPayload } from '../../domain/models/tipo-programa.model';

@Injectable({ providedIn: 'root' })
export class TipoProgramaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/tipos-programa';

  getAll(params: TipoProgramaListParams = {}): Observable<TipoProgramaListResponse> {
    let p = new HttpParams();
    if (params.pageIndex != null) p = p.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) p = p.set('pageSize',  params.pageSize);
    if (params.query)             p = p.set('query',     params.query);
    return this.http.get<TipoProgramaListResponse>(this.baseUrl, { params: p });
  }

  getById(id: number): Observable<TipoPrograma> {
    return this.http.get<TipoPrograma>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateTipoProgramaPayload): Observable<TipoPrograma> {
    return this.http.post<TipoPrograma>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateTipoProgramaPayload>): Observable<TipoPrograma> {
    return this.http.put<TipoPrograma>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
