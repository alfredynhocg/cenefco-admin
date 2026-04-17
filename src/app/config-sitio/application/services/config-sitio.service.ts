import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigSitio } from '../../domain/models/config-sitio.model';

@Injectable({ providedIn: 'root' })
export class ConfigSitioService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/config-sitio';

  get(): Observable<ConfigSitio> {
    return this.http.get<ConfigSitio>(this.baseUrl);
  }

  update(data: Partial<ConfigSitio>): Observable<ConfigSitio> {
    return this.http.put<ConfigSitio>(this.baseUrl, data);
  }
}
