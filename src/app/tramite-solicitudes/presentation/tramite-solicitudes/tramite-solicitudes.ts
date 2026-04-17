import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { Pagination } from '../../../common/components/pagination/pagination';
import { TramiteSolicitudService } from '../../application/services/tramite-solicitud.service';
import { TramiteSolicitudListResponse } from '../../domain/models/tramite-solicitud.model';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: TramiteSolicitudListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR: ApiState   = { type: 'error' };

@Component({
  selector: 'app-tramite-solicitudes',
  standalone: true,
  imports: [NgIcon, RouterLink, PageTitle, Pagination],
  templateUrl: './tramite-solicitudes.html',
})
export class TramiteSolicitudes {
  private service = inject(TramiteSolicitudService);

  searchQuery  = signal('');
  estadoFiltro = signal('');
  pageIndex    = signal(1);
  pageSize     = signal(10);

  private params = computed(() => ({
    query:     this.searchQuery(),
    estado:    this.estadoFiltro() || undefined,
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.service.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get solicitudes() { const s = this.state(); return s.type === 'success' ? s.response.data  : []; }
  get total()       { const s = this.state(); return s.type === 'success' ? s.response.total : 0;  }
  get isLoading()   { return this.state().type === 'loading'; }
  get hasError()    { return this.state().type === 'error';   }

  onSearch(e: Event) {
    this.searchQuery.set((e.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onEstadoChange(e: Event) {
    this.estadoFiltro.set((e.target as HTMLSelectElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number) { this.pageIndex.set(page); }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      en_proceso: 'bg-warning/15 text-warning',
      completado: 'bg-success/15 text-success',
      cancelado:  'bg-danger/15 text-danger',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      en_proceso: 'En proceso',
      completado: 'Completado',
      cancelado:  'Cancelado',
    };
    return map[estado] ?? estado;
  }

  progresoWidth(etapaActual: number, totalEtapas = 6): string {
    return Math.round((etapaActual / totalEtapas) * 100) + '%';
  }

  progresoColor(estado: string): string {
    if (estado === 'completado') return 'bg-success';
    if (estado === 'cancelado')  return 'bg-danger';
    return 'bg-primary';
  }
}
