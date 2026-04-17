import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InformeAuditoria, InformeAuditoriaListResponse, CreateInformeAuditoriaPayload } from '../../domain/models/informe-auditoria.model';

@Injectable({ providedIn: 'root' })
export class InformeAuditoriaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/informes-auditoria';

  getAll(params: { query?: string; pageIndex?: number; pageSize?: number }): Observable<InformeAuditoriaListResponse> {
    let p = new HttpParams()
      .set('pageIndex', params.pageIndex ?? 1)
      .set('pageSize',  params.pageSize  ?? 10)
      .set('query',     params.query     ?? '')
      .set('sort[key]', 'created_at')
      .set('sort[order]', 'desc');
    return this.http.get<InformeAuditoriaListResponse>(this.baseUrl, { params: p });
  }

  getById(id: number): Observable<InformeAuditoria> {
    return this.http.get<InformeAuditoria>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateInformeAuditoriaPayload): Observable<InformeAuditoria> {
    return this.http.post<InformeAuditoria>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<CreateInformeAuditoriaPayload>): Observable<InformeAuditoria> {
    return this.http.put<InformeAuditoria>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
