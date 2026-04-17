import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../../domain/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private http = inject(HttpClient);

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>('/api/v1/roles');
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`/api/v1/roles/${id}`);
  }

  create(data: Partial<Role>): Observable<Role> {
    return this.http.post<Role>('/api/v1/roles', data);
  }

  update(id: number, data: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`/api/v1/roles/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/roles/${id}`);
  }
}
