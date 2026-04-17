import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DecretoMunicipalService } from '../../application/services/decreto-municipal.service';
import { DecretoMunicipalListResponse } from '../../domain/models/decreto-municipal.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: DecretoMunicipalListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-decretos-municipales',
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './decretos-municipales.html',
  styles: ``
})
export class DecretosMunicipales {
  private decretoService = inject(DecretoMunicipalService);
  private toast          = inject(ToastService);

  searchQuery      = signal('');
  pageIndex        = signal(1);
  pageSize         = signal(10);
  private refreshTrigger = signal(0);

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.decretoService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get decretos()  { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()     { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading() { return this.state().type === 'loading'; }
  get hasError()  { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      borrador:  'bg-default-200 text-default-600',
      publicado: 'bg-success/15 text-success',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  tipoBadgeClass(tipo: string): string {
    const map: Record<string, string> = {
      decreto:    'bg-primary/10 text-primary',
      resolucion: 'bg-warning/15 text-warning',
      ordenanza:  'bg-info/15 text-info',
    };
    return map[tipo] ?? 'bg-default-200 text-default-600';
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      decreto:    'Decreto',
      resolucion: 'Resolución',
      ordenanza:  'Ordenanza',
    };
    return map[tipo] ?? tipo;
  }

  deleteDecreto(id: number): void {
    Swal.fire({
      title: '¿Eliminar decreto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.decretoService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El decreto ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el decreto')
        });
      }
    });
  }
}
