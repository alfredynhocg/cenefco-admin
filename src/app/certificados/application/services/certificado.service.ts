import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CertPlantilla, CertPlantillaListResponse,
  CertCampo, CertCampoListResponse,
  ListaAprobadoListResponse,
  CertificadoListResponse, GenerarLoteResult,
} from '../../domain/models/certificado.model';

@Injectable({ providedIn: 'root' })
export class CertificadoService {
  private http = inject(HttpClient);

  getPlantillas(params: { pageIndex?: number; pageSize?: number; soloActivos?: boolean } = {}): Observable<CertPlantillaListResponse> {
    let p = new HttpParams();
    if (params.pageIndex  != null) p = p.set('pageIndex',   params.pageIndex);
    if (params.pageSize   != null) p = p.set('pageSize',    params.pageSize);
    if (params.soloActivos)        p = p.set('soloActivos', 'true');
    return this.http.get<CertPlantillaListResponse>('/api/v1/cert-plantillas', { params: p });
  }

  getPlantillaById(id: number): Observable<CertPlantilla> {
    return this.http.get<CertPlantilla>(`/api/v1/cert-plantillas/${id}`);
  }

  createPlantilla(data: Partial<CertPlantilla>): Observable<CertPlantilla> {
    return this.http.post<CertPlantilla>('/api/v1/cert-plantillas', data);
  }

  updatePlantilla(id: number, data: Partial<CertPlantilla>): Observable<CertPlantilla> {
    return this.http.put<CertPlantilla>(`/api/v1/cert-plantillas/${id}`, data);
  }

  deletePlantilla(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/cert-plantillas/${id}`);
  }

  uploadImagenPlantilla(file: File): Observable<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>('/api/v1/upload/image', fd);
  }

  getCampos(plantillaId: number): Observable<CertCampoListResponse> {
    return this.http.get<CertCampoListResponse>('/api/v1/cert-plantilla-campos', {
      params: new HttpParams().set('plantilla_id', plantillaId).set('pageSize', 100),
    });
  }

  createCampo(data: Partial<CertCampo>): Observable<CertCampo> {
    return this.http.post<CertCampo>('/api/v1/cert-plantilla-campos', data);
  }

  updateCampo(id: number, data: Partial<CertCampo>): Observable<CertCampo> {
    return this.http.put<CertCampo>(`/api/v1/cert-plantilla-campos/${id}`, data);
  }

  deleteCampo(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/cert-plantilla-campos/${id}`);
  }

  getAprobados(params: { pageIndex?: number; pageSize?: number; imparte_id?: number } = {}): Observable<ListaAprobadoListResponse> {
    let p = new HttpParams();
    if (params.pageIndex  != null) p = p.set('pageIndex',  params.pageIndex);
    if (params.pageSize   != null) p = p.set('pageSize',   params.pageSize);
    if (params.imparte_id != null) p = p.set('imparte_id', params.imparte_id);
    return this.http.get<ListaAprobadoListResponse>('/api/v1/lista-aprobados', { params: p });
  }

  createAprobado(data: any): Observable<any> {
    return this.http.post('/api/v1/lista-aprobados', data);
  }

  deleteAprobado(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/lista-aprobados/${id}`);
  }

  getCertificados(params: { pageIndex?: number; pageSize?: number; imparte_id?: number } = {}): Observable<CertificadoListResponse> {
    let p = new HttpParams();
    if (params.pageIndex  != null) p = p.set('pageIndex',  params.pageIndex);
    if (params.pageSize   != null) p = p.set('pageSize',   params.pageSize);
    if (params.imparte_id != null) p = p.set('imparte_id', params.imparte_id);
    return this.http.get<CertificadoListResponse>('/api/v1/certificados', { params: p });
  }

  generarLote(imparteId: number, plantillaId: number): Observable<GenerarLoteResult> {
    return this.http.post<GenerarLoteResult>('/api/v1/certificados/generar-lote', {
      imparte_id: imparteId,
      plantilla_id: plantillaId,
    });
  }

  deleteCertificado(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/certificados/${id}`);
  }
}
