import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { FormularioTramiteService } from '../../application/services/formulario-tramite.service';
import { FormularioTramiteListResponse } from '../../domain/models/formulario-tramite.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: FormularioTramiteListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-formularios-tramite',
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './formularios-tramite.html',
  styles: ``
})
export class FormulariosTramite {
  private formularioService  = inject(FormularioTramiteService);
  private toast              = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroVigente          = signal('');
  private refreshTrigger = signal(0);

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    vigente:   this.filtroVigente(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.formularioService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get formularios() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()       { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()   { return this.state().type === 'loading'; }
  get error()       { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroVigente(event: Event): void {
    this.filtroVigente.set((event.target as HTMLSelectElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  deleteFormulario(id: number): void {
    Swal.fire({
      title: '¿Eliminar formulario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.formularioService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El formulario ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el formulario')
        });
      }
    });
  }
}
