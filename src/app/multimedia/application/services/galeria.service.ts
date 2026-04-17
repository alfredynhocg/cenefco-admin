import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Galeria, GaleriaListParams, GaleriaListResponse, CreateGaleriaPayload,
  GaleriaItem, GaleriaItemListParams, GaleriaItemListResponse, CreateGaleriaItemPayload,
} from '../../domain/models/galeria.model';

@Injectable({ providedIn: 'root' })
export class GaleriaService {
  private http = inject(HttpClient);
  private readonly baseUrl     = '/api/v1/galerias';
  private readonly itemsUrl    = '/api/v1/galeria-items';

  // ─── Galerías ─────────────────────────────────────────────────────────────

  getAll(params: GaleriaListParams = {}): Observable<GaleriaListResponse> {
    let p = new HttpParams();
    if (params.pageIndex != null) p = p.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) p = p.set('pageSize',  params.pageSize);
    if (params.query)             p = p.set('query',     params.query);
    return this.http.get<GaleriaListResponse>(this.baseUrl, { params: p });
  }

  getById(id: number): Observable<Galeria> {
    return this.http.get<Galeria>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateGaleriaPayload): Observable<Galeria> {
    return this.http.post<Galeria>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateGaleriaPayload>): Observable<Galeria> {
    return this.http.put<Galeria>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ─── Items ────────────────────────────────────────────────────────────────

  getItems(params: GaleriaItemListParams = {}): Observable<GaleriaItemListResponse> {
    let p = new HttpParams();
    if (params.galeria_id != null) p = p.set('galeria_id', params.galeria_id);
    if (params.pageIndex  != null) p = p.set('pageIndex',  params.pageIndex);
    if (params.pageSize   != null) p = p.set('pageSize',   params.pageSize);
    return this.http.get<GaleriaItemListResponse>(this.itemsUrl, { params: p });
  }

  getItemById(id: number): Observable<GaleriaItem> {
    return this.http.get<GaleriaItem>(`${this.itemsUrl}/${id}`);
  }

  createItem(data: CreateGaleriaItemPayload): Observable<GaleriaItem> {
    return this.http.post<GaleriaItem>(this.itemsUrl, data);
  }

  updateItem(id: number, data: Partial<CreateGaleriaItemPayload>): Observable<GaleriaItem> {
    return this.http.put<GaleriaItem>(`${this.itemsUrl}/${id}`, data);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.itemsUrl}/${id}`);
  }
}
