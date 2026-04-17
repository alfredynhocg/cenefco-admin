import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { PreinscripcionService } from '../../application/services/preinscripcion.service';
import { PreinscripcionListResponse } from '../../domain/models/preinscripcion.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import Swal from 'sweetalert2';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: PreinscripcionListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-preinscripciones',
  imports: [NgIcon, Pagination, PageTitle, SlicePipe],
  templateUrl: './preinscripciones.html',
  styles: ``
})
export class Preinscripciones {
  private preinscripcionService = inject(PreinscripcionService);
  private toast                 = inject(ToastService);
  private router                = inject(Router);

  searchQuery    = signal('');
  pageIndex      = signal(1);
  pageSize       = signal(10);
  filtroEstado   = signal('');
  private refreshTrigger = signal(0);

  private params = computed(() => ({
    query:      this.searchQuery(),
    pageIndex:  this.pageIndex(),
    pageSize:   this.pageSize(),
    estado:     this.filtroEstado(),
    refresh:    this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.preinscripcionService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get preinscripciones() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()            { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()        { return this.state().type === 'loading'; }
  get error()            { return this.state().type === 'error'; }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente:   'bg-warning/15 text-warning',
      revisado:    'bg-info/15 text-info',
      aceptado:    'bg-success/15 text-success',
      rechazado:   'bg-danger/15 text-danger',
      contactado:  'bg-purple-100 text-purple-700',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroEstado(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  goToDetail(id: number): void {
    this.router.navigate(['/senefco/preinscripcion-detail', id]);
  }

  deletePreinscripcion(id: number): void {
    Swal.fire({
      title: '¿Eliminar preinscripción?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.preinscripcionService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminada!', 'La preinscripción ha sido eliminada');
            this.refreshTrigger.update(n => n + 1);
          },
          error: (err: HttpErrorResponse) =>
            this.toast.error('Error', extractErrorMessage(err, 'No se pudo eliminar la preinscripción'))
        });
      }
    });
  }
}
