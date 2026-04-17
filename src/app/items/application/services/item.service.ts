import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Item,
  ItemListParams,
  ItemListResponse,
  CreateItemPayload,
} from '../../domain/models/item.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/items';

  getAll(params: ItemListParams = {}): Observable<ItemListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.tipo)              httpParams = httpParams.set('tipo',      params.tipo);
    return this.http.get<ItemListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateItemPayload): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateItemPayload>): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
