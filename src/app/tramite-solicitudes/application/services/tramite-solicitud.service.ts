import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TramiteSolicitud,
  TramiteSolicitudListResponse,
  TramiteSolicitudListParams,
} from '../../domain/models/tramite-solicitud.model';

@Injectable({ providedIn: 'root' })
export class TramiteSolicitudService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/tramite-solicitudes';

  getAll(p: TramiteSolicitudListParams = {}): Observable<TramiteSolicitudListResponse> {
    let params = new HttpParams();
    if (p.pageIndex != null) params = params.set('pageIndex', p.pageIndex);
    if (p.pageSize  != null) params = params.set('pageSize',  p.pageSize);
    if (p.query)             params = params.set('query',     p.query);
    if (p.estado)            params = params.set('estado',    p.estado);
    if (p.tramite_id != null) params = params.set('tramite_id', p.tramite_id);
    return this.http.get<TramiteSolicitudListResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<TramiteSolicitud> {
    return this.http.get<TramiteSolicitud>(`${this.baseUrl}/${id}`);
  }

  avanzar(id: number, observacion?: string): Observable<{ message: string; etapa_actual: number; estado: string }> {
    return this.http.post<{ message: string; etapa_actual: number; estado: string }>(
      `${this.baseUrl}/${id}/avanzar`,
      { observacion }
    );
  }

  cancelar(id: number, motivo?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${id}/cancelar`, { motivo });
  }
}
