import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preinscripcion, PreinscripcionListResponse, PreinscripcionListParams } from '../../domain/models/preinscripcion.model';

@Injectable({ providedIn: 'root' })
export class PreinscripcionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/preinscripciones';

  getAll(params: PreinscripcionListParams = {}): Observable<PreinscripcionListResponse> {
    let p = new HttpParams();
    if (params.pageIndex  != null) p = p.set('pageIndex',   params.pageIndex);
    if (params.pageSize   != null) p = p.set('pageSize',    params.pageSize);
    if (params.query)              p = p.set('query',        params.query);
    if (params.estado)             p = p.set('estado',       params.estado);
    if (params.programa_id != null) p = p.set('programa_id', params.programa_id);
    return this.http.get<PreinscripcionListResponse>(this.baseUrl, { params: p });
  }

  getById(id: number): Observable<Preinscripcion> {
    return this.http.get<Preinscripcion>(`${this.baseUrl}/${id}`);
  }

  updateEstado(id: number, estado: string): Observable<Preinscripcion> {
    return this.http.put<Preinscripcion>(`${this.baseUrl}/${id}`, { estado });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
