import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { AuditoriaService } from '../../application/services/auditoria.service';
import { AuditoriaListResponse } from '../../domain/models/auditoria.model';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: AuditoriaListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-auditorias',
  imports: [NgIcon, SlicePipe, Pagination, PageTitle, RouterLink],
  templateUrl: './auditorias.html',
  styles: ``
})
export class Auditorias {
  private auditoriaService = inject(AuditoriaService);

  searchQuery  = signal('');
  pageIndex    = signal(1);
  pageSize     = signal(15);
  filtroAccion = signal('');
  filtroModulo = signal('');
  fechaDesde   = signal('');
  fechaHasta   = signal('');

  private params = computed(() => ({
    query:       this.searchQuery(),
    pageIndex:   this.pageIndex(),
    pageSize:    this.pageSize(),
    accion:      this.filtroAccion(),
    modulo:      this.filtroModulo(),
    fecha_desde: this.fechaDesde(),
    fecha_hasta: this.fechaHasta(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.auditoriaService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get auditorias() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()      { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()  { return this.state().type === 'loading'; }
  get error()      { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroChange(field: 'accion' | 'modulo' | 'fechaDesde' | 'fechaHasta', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    if (field === 'accion')      this.filtroAccion.set(value);
    if (field === 'modulo')      this.filtroModulo.set(value);
    if (field === 'fechaDesde')  this.fechaDesde.set(value);
    if (field === 'fechaHasta')  this.fechaHasta.set(value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  accionBadgeClass(accion: string): string {
    const map: Record<string, string> = {
      crear:    'bg-success/15 text-success',
      editar:   'bg-info/15 text-info',
      eliminar: 'bg-danger/15 text-danger',
      login:    'bg-primary/15 text-primary',
      logout:   'bg-default-200 text-default-600',
    };
    return map[accion.toLowerCase()] ?? 'bg-warning/15 text-warning';
  }
}
