import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DecretoMunicipal,
  DecretoMunicipalListParams,
  DecretoMunicipalListResponse,
  CreateDecretoMunicipalPayload,
} from '../../domain/models/decreto-municipal.model';

@Injectable({ providedIn: 'root' })
export class DecretoMunicipalService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/decretos-municipales';

  getAll(params: DecretoMunicipalListParams = {}): Observable<DecretoMunicipalListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<DecretoMunicipalListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<DecretoMunicipal> {
    return this.http.get<DecretoMunicipal>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateDecretoMunicipalPayload): Observable<DecretoMunicipal> {
    return this.http.post<DecretoMunicipal>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateDecretoMunicipalPayload>): Observable<DecretoMunicipal> {
    return this.http.put<DecretoMunicipal>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
