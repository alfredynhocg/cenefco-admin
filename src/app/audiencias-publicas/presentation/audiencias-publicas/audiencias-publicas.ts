import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { AudienciaPublicaService } from '../../application/services/audiencia-publica.service';
import { AudienciaPublicaListResponse } from '../../domain/models/audiencia-publica.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: AudienciaPublicaListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-audiencias-publicas',
  imports: [NgIcon, SlicePipe, Pagination, PageTitle, RouterLink],
  templateUrl: './audiencias-publicas.html',
  styles: ``
})
export class AudienciasPublicas {
  private audienciaService = inject(AudienciaPublicaService);
  private toast  = inject(ToastService);

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
        this.audienciaService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get audiencias() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()      { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()  { return this.state().type === 'loading'; }
  get error()      { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  tipoBadgeClass(tipo: string): string {
    const map: Record<string, string> = {
      inicial:     'bg-info/15 text-info',
      seguimiento: 'bg-warning/15 text-warning',
      cierre:      'bg-success/15 text-success',
    };
    return map[tipo] ?? 'bg-default-200 text-default-600';
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      convocada:  'bg-info/15 text-info',
      realizada:  'bg-success/15 text-success',
      cancelada:  'bg-danger/15 text-danger',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  deleteAudiencia(id: number): void {
    Swal.fire({
      title: '¿Eliminar audiencia pública?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.audienciaService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'La audiencia pública ha sido eliminada');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar la audiencia pública')
        });
      }
    });
  }
}
