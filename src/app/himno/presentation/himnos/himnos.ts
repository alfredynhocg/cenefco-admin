import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { HimnoService } from '../../application/services/himno.service';
import { HimnoListResponse } from '../../domain/models/himno.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: HimnoListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-himnos',
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './himnos.html',
  styles: ``
})
export class Himnos {
  private himnoService       = inject(HimnoService);
  private toast              = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroTipo             = signal('');
  private refreshTrigger = signal(0);

  tipos = [
    { value: 'municipal',    label: 'Municipal'    },
    { value: 'departamental',label: 'Departamental'},
    { value: 'nacional',     label: 'Nacional'     },
    { value: 'otro',         label: 'Otro'         },
  ];

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    tipo:      this.filtroTipo(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.himnoService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get himnos()    { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()     { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading() { return this.state().type === 'loading'; }
  get error()     { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroTipo(event: Event): void {
    this.filtroTipo.set((event.target as HTMLSelectElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  tipoBadgeClass(tipo: string): string {
    const map: Record<string, string> = {
      municipal:     'bg-primary/15 text-primary',
      departamental: 'bg-info/15 text-info',
      nacional:      'bg-success/15 text-success',
      otro:          'bg-default-200 text-default-500',
    };
    return map[tipo] ?? 'bg-default-200 text-default-600';
  }

  tipoLabel(tipo: string): string {
    return this.tipos.find(t => t.value === tipo)?.label ?? tipo;
  }

  deleteHimno(id: number): void {
    Swal.fire({
      title: '¿Eliminar himno?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.himnoService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El himno ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el himno')
        });
      }
    });
  }
}
