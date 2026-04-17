import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Curso,
  CursoListParams,
  CursoListResponse,
  CreateCursoPayload,
  CategoriaCursoListResponse,
  TipoCursoListResponse,
} from '../../domain/models/curso.model';

@Injectable({ providedIn: 'root' })
export class CursoService {
  private http = inject(HttpClient);
  private readonly baseUrl      = '/api/v1/cursos';
  private readonly categoriasUrl = '/api/v1/categorias-programa';
  private readonly tiposUrl      = '/api/v1/tipos-programa';

  getAll(params: CursoListParams = {}): Observable<CursoListResponse> {
    let httpParams = new HttpParams();
    if (params.pageIndex != null) httpParams = httpParams.set('pageIndex', params.pageIndex);
    if (params.pageSize  != null) httpParams = httpParams.set('pageSize',  params.pageSize);
    if (params.query)             httpParams = httpParams.set('query',     params.query);
    return this.http.get<CursoListResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateCursoPayload): Observable<Curso> {
    return this.http.post<Curso>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateCursoPayload>): Observable<Curso> {
    return this.http.put<Curso>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCategorias(): Observable<CategoriaCursoListResponse> {
    return this.http.get<CategoriaCursoListResponse>(this.categoriasUrl);
  }

  getTipos(): Observable<TipoCursoListResponse> {
    return this.http.get<TipoCursoListResponse>(this.tiposUrl);
  }
}
