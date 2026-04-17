import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ubicacion } from '../../domain/models/ubicacion.model';

@Injectable({ providedIn: 'root' })
export class UbicacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/ubicaciones';

  getAll(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.baseUrl);
  }

  create(data: { nombre: string; activo: boolean }): Observable<Ubicacion> {
    return this.http.post<Ubicacion>(this.baseUrl, data);
  }

  update(id: number, data: Partial<Ubicacion>): Observable<Ubicacion> {
    return this.http.put<Ubicacion>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
