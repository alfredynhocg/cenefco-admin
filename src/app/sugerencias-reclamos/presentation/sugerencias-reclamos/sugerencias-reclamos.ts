import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe, TitleCasePipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { SugerenciaReclamoService } from '../../application/services/sugerencia-reclamo.service';
import { SugerenciaReclamoListResponse } from '../../domain/models/sugerencia-reclamo.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import Swal from 'sweetalert2';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: SugerenciaReclamoListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-sugerencias-reclamos',
  imports: [NgIcon, Pagination, PageTitle, RouterLink, SlicePipe, TitleCasePipe],
  templateUrl: './sugerencias-reclamos.html',
  styles: ``
})
export class SugerenciasReclamos {
  private sugerenciaService = inject(SugerenciaReclamoService);
  private toast             = inject(ToastService);

  searchQuery        = signal('');
  pageIndex          = signal(1);
  pageSize           = signal(15);
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
        this.sugerenciaService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get sugerencias() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()       { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()   { return this.state().type === 'loading'; }
  get error()       { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  estadoClass(estado: string): string {
    switch (estado) {
      case 'pendiente':  return 'bg-warning/20 text-warning';
      case 'en_proceso': return 'bg-info/20 text-info';
      case 'resuelto':   return 'bg-success/20 text-success';
      case 'cerrado':    return 'bg-default-100 text-default-500';
      default:           return 'bg-default-100 text-default-500';
    }
  }

  deleteSugerencia(id: number): void {
    Swal.fire({
      title: '¿Eliminar sugerencia/reclamo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.sugerenciaService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'Registro eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: (err: HttpErrorResponse) =>
            this.toast.error('Error', extractErrorMessage(err, 'No se pudo eliminar'))
        });
      }
    });
  }
}
