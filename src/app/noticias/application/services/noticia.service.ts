import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Noticia,
  NoticiaListParams,
  NoticiaListResponse,
  CreateNoticiaPayload,
  CategoriaNoticiaListResponse,
  EtiquetaListResponse,
} from '../../domain/models/noticia.model';

@Injectable({ providedIn: 'root' })
export class NoticiaService {
  private http = inject(HttpClient);
  private readonly baseUrl        = '/api/v1/noticias';
  private readonly categoriasUrl  = '/api/v1/categorias-noticia';
  private readonly etiquetasUrl   = '/api/v1/etiquetas';

  getAll(params: NoticiaListParams = {}): Observable<NoticiaListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<NoticiaListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.baseUrl}/${id}`);
  }

  getCategorias(): Observable<CategoriaNoticiaListResponse> {
    return this.http.get<CategoriaNoticiaListResponse>(this.categoriasUrl);
  }

  getEtiquetas(): Observable<EtiquetaListResponse> {
    return this.http.get<EtiquetaListResponse>(this.etiquetasUrl);
  }

  create(data: CreateNoticiaPayload): Observable<Noticia> {
    return this.http.post<Noticia>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateNoticiaPayload>): Observable<Noticia> {
    return this.http.put<Noticia>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
