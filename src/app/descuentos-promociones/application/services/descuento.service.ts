import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Descuento, DescuentoListParams, DescuentoListResponse, CreateDescuentoPayload } from '../../domain/models/descuento.model';

@Injectable({ providedIn: 'root' })
export class DescuentoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/descuentos-promociones';

  getAll(params: DescuentoListParams = {}): Observable<DescuentoListResponse> {
    let p = new HttpParams();
    if (params.pageIndex != null) p = p.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) p = p.set('pageSize',  params.pageSize);
    if (params.query)             p = p.set('query',     params.query);
    return this.http.get<DescuentoListResponse>(this.baseUrl, { params: p });
  }

  getById(id: number): Observable<Descuento> {
    return this.http.get<Descuento>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateDescuentoPayload): Observable<Descuento> {
    return this.http.post<Descuento>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateDescuentoPayload>): Observable<Descuento> {
    return this.http.put<Descuento>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
