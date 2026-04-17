import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DocumentoTransparencia,
  DocumentoTransparenciaListParams,
  DocumentoTransparenciaListResponse,
  CreateDocumentoPayload,
} from '../../domain/models/documento-transparencia.model';

@Injectable({ providedIn: 'root' })
export class DocumentoTransparenciaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/documentos-transparencia';

  getAll(params: DocumentoTransparenciaListParams = {}): Observable<DocumentoTransparenciaListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    if (params.categoria)         httpParams = httpParams.set('categoria', params.categoria);
    if (params.anio)              httpParams = httpParams.set('anio',      params.anio);
    if (params.publicado)         httpParams = httpParams.set('publicado', params.publicado);
    return this.http.get<DocumentoTransparenciaListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<DocumentoTransparencia> {
    return this.http.get<DocumentoTransparencia>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateDocumentoPayload): Observable<DocumentoTransparencia> {
    return this.http.post<DocumentoTransparencia>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateDocumentoPayload>): Observable<DocumentoTransparencia> {
    return this.http.put<DocumentoTransparencia>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
