import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Tramite, TramiteListResponse, TramiteListParams,
  TipoTramiteListResponse, UnidadResponsableListResponse
} from '../../domain/models/tramite.model';

@Injectable({ providedIn: 'root' })
export class TramiteService {
  private http = inject(HttpClient);
  private readonly baseUrl          = '/api/v1/tramites';
  private readonly tiposUrl         = '/api/v1/tipos-tramite';
  private readonly unidadesUrl      = '/api/v1/unidades-responsables';

  getAll(params: TramiteListParams = {}): Observable<TramiteListResponse> {
    return this.http.get<TramiteListResponse>(this.baseUrl, { params: params as Record<string, string | number> });
  }

  getById(id: number): Observable<Tramite> {
    return this.http.get<Tramite>(`${this.baseUrl}/${id}`);
  }

  getTiposTramite(): Observable<TipoTramiteListResponse> {
    return this.http.get<TipoTramiteListResponse>(this.tiposUrl, { params: { pageSize: 1000 } });
  }

  getUnidadesResponsables(): Observable<UnidadResponsableListResponse> {
    return this.http.get<UnidadResponsableListResponse>(this.unidadesUrl, { params: { pageSize: 1000 } });
  }

  create(data: Partial<Tramite>): Observable<Tramite> {
    return this.http.post<Tramite>(this.baseUrl, data);
  }

  update(id: number, data: Partial<Tramite>): Observable<Tramite> {
    return this.http.put<Tramite>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
