import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcenefco, SubcenefcoListResponse, SubcenefcoListParams, CreateSubcenefcoPayload } from '../../domain/models/subcenefco.model';

@Injectable({ providedIn: 'root' })
export class SubcenefcoService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/subcenefcos';

  getAll(params: SubcenefcoListParams = {}): Observable<SubcenefcoListResponse> {
    return this.http.get<SubcenefcoListResponse>(this.baseUrl, { params: params as Record<string, string | number> });
  }

  getById(id: number): Observable<Subcenefco> {
    return this.http.get<Subcenefco>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateSubcenefcoPayload): Observable<Subcenefco> {
    return this.http.post<Subcenefco>(this.baseUrl, data);
  }

  update(id: number, data: Partial<CreateSubcenefcoPayload>): Observable<Subcenefco> {
    return this.http.put<Subcenefco>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
