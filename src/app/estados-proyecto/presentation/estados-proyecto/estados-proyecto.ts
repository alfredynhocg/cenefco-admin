import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DecimalPipe } from '@angular/common';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EstadoProyectoService } from '../../application/services/estado-proyecto.service';
import { EstadoProyectoListResponse } from '../../domain/models/estado-proyecto.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: EstadoProyectoListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-estados-proyecto',
  imports: [NgIcon, Pagination, PageTitle, RouterLink, DecimalPipe],
  templateUrl: './estados-proyecto.html',
  styles: ``
})
export class EstadosProyecto {
  private proyectoService = inject(EstadoProyectoService);
  private toast           = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroEstado           = signal('');
  private refreshTrigger = signal(0);

  estados = [
    { value: 'planificacion', label: 'Planificación' },
    { value: 'en_ejecucion',  label: 'En Ejecución'  },
    { value: 'paralizado',    label: 'Paralizado'     },
    { value: 'concluido',     label: 'Concluido'      },
    { value: 'cancelado',     label: 'Cancelado'      },
  ];

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    estado:    this.filtroEstado(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.proyectoService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get proyectos() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()     { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading() { return this.state().type === 'loading'; }
  get error()     { return this.state().type === 'error'; }

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

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      planificacion: 'bg-info/15 text-info',
      en_ejecucion:  'bg-warning/15 text-warning',
      paralizado:    'bg-danger/15 text-danger',
      concluido:     'bg-success/15 text-success',
      cancelado:     'bg-default-200 text-default-500',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  estadoLabel(estado: string): string {
    return this.estados.find(e => e.value === estado)?.label ?? estado;
  }

  avanceBarClass(pct: number): string {
    if (pct >= 90) return 'bg-success';
    if (pct >= 60) return 'bg-info';
    if (pct >= 30) return 'bg-warning';
    return 'bg-danger';
  }

  deleteProyecto(id: number): void {
    Swal.fire({
      title: '¿Eliminar proyecto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.proyectoService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El proyecto ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el proyecto')
        });
      }
    });
  }
}
