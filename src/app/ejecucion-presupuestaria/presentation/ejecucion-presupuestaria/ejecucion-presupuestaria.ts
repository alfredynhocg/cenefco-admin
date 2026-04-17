import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DecimalPipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EjecucionPresupuestariaService } from '../../application/services/ejecucion-presupuestaria.service';
import { EjecucionPresupuestariaListResponse } from '../../domain/models/ejecucion-presupuestaria.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: EjecucionPresupuestariaListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-ejecucion-presupuestaria',
  imports: [NgIcon, Pagination, PageTitle, RouterLink, DecimalPipe],
  templateUrl: './ejecucion-presupuestaria.html',
  styles: ``
})
export class EjecucionPresupuestaria {
  private ejecucionService   = inject(EjecucionPresupuestariaService);
  private toast              = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroAnio             = signal('');
  filtroPeriodo          = signal('');
  private refreshTrigger = signal(0);

  anios   = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  periodos = [
    { value: 'mensual',     label: 'Mensual' },
    { value: 'trimestral',  label: 'Trimestral' },
    { value: 'semestral',   label: 'Semestral' },
    { value: 'anual',       label: 'Anual' },
  ];

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    anio:      this.filtroAnio(),
    periodo:   this.filtroPeriodo(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.ejecucionService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get ejecuciones() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()       { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()   { return this.state().type === 'loading'; }
  get error()       { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroChange(field: 'anio' | 'periodo', event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'anio')    this.filtroAnio.set(value);
    if (field === 'periodo') this.filtroPeriodo.set(value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  porcentajeClass(pct: number): string {
    if (pct >= 90) return 'bg-success';
    if (pct >= 60) return 'bg-info';
    if (pct >= 30) return 'bg-warning';
    return 'bg-danger';
  }

  periodoBadgeClass(periodo: string): string {
    const map: Record<string, string> = {
      mensual:    'bg-primary/15 text-primary',
      trimestral: 'bg-info/15 text-info',
      semestral:  'bg-warning/15 text-warning',
      anual:      'bg-success/15 text-success',
    };
    return map[periodo] ?? 'bg-default-200 text-default-600';
  }

  periodoLabel(periodo: string): string {
    const found = this.periodos.find(p => p.value === periodo);
    return found ? found.label : periodo;
  }

  deleteEjecucion(id: number): void {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.ejecucionService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El registro ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el registro')
        });
      }
    });
  }
}
