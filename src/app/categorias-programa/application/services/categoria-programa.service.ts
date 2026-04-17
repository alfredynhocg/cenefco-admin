import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaProgramaItem, CategoriaProgramaListResponse, CategoriaProgramaListParams } from '../../domain/models/categoria-programa.model';

@Injectable({ providedIn: 'root' })
export class CategoriaProgramaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/categorias-programa';

  getAll(params: CategoriaProgramaListParams = {}): Observable<CategoriaProgramaListResponse> {
    let p = new HttpParams();
    if (params.pageIndex != null) p = p.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) p = p.set('pageSize',  params.pageSize);
    if (params.query)             p = p.set('query',     params.query);
    return this.http.get<CategoriaProgramaListResponse>(this.baseUrl, { params: p });
  }

  getById(id: number): Observable<CategoriaProgramaItem> {
    return this.http.get<CategoriaProgramaItem>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<CategoriaProgramaItem>): Observable<CategoriaProgramaItem> {
    return this.http.post<CategoriaProgramaItem>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CategoriaProgramaItem>): Observable<CategoriaProgramaItem> {
    return this.http.put<CategoriaProgramaItem>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
