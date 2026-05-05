import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Articulo, ArticuloListParams, ArticuloListResponse, CreateArticuloPayload } from '../../domain/models/articulo.model';

@Injectable({ providedIn: 'root' })
export class ArticuloService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/articulos';

  getAll(params: ArticuloListParams = {}): Observable<ArticuloListResponse> {
    let p = new HttpParams();
    if (params.pageIndex != null) p = p.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) p = p.set('pageSize',  params.pageSize);
    if (params.query)             p = p.set('query',     params.query);
    p = p.set('conInactivos', 'true');
    return this.http.get<ArticuloListResponse>(this.baseUrl, { params: p });
  }

  getById(id: number): Observable<Articulo> {
    return this.http.get<Articulo>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateArticuloPayload): Observable<Articulo> {
    return this.http.post<Articulo>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateArticuloPayload>): Observable<Articulo> {
    return this.http.put<Articulo>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
