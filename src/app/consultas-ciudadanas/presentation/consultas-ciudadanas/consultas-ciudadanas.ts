import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ConsultaCiudadanaService } from '../../application/services/consulta-ciudadana.service';
import { ConsultaCiudadanaListResponse } from '../../domain/models/consulta-ciudadana.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: ConsultaCiudadanaListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-consultas-ciudadanas',
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './consultas-ciudadanas.html',
  styles: ``
})
export class ConsultasCiudadanas {
  private consultaService = inject(ConsultaCiudadanaService);
  private toast           = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroTipo             = signal('');
  filtroEstado           = signal('');
  private refreshTrigger = signal(0);

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    tipo:      this.filtroTipo(),
    estado:    this.filtroEstado(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.consultaService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get consultas()  { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()      { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()  { return this.state().type === 'loading'; }
  get error()      { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroChange(field: 'tipo' | 'estado', event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'tipo')   this.filtroTipo.set(value);
    if (field === 'estado') this.filtroEstado.set(value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente:   'bg-warning/15 text-warning',
      en_proceso:  'bg-info/15 text-info',
      respondido:  'bg-success/15 text-success',
      cerrado:     'bg-default-200 text-default-500',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  tipoBadgeClass(tipo: string): string {
    const map: Record<string, string> = {
      consulta:   'bg-primary/15 text-primary',
      queja:      'bg-danger/15 text-danger',
      sugerencia: 'bg-success/15 text-success',
      denuncia:   'bg-warning/15 text-warning',
      solicitud:  'bg-info/15 text-info',
    };
    return map[tipo] ?? 'bg-default-200 text-default-600';
  }

  deleteConsulta(id: number): void {
    Swal.fire({
      title: '¿Eliminar consulta?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.consultaService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminada!', 'La consulta ha sido eliminada');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar la consulta')
        });
      }
    });
  }
}
