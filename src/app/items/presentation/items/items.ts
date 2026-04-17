import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ItemService } from '../../application/services/item.service';
import { ItemListResponse, ItemTipo } from '../../domain/models/item.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: ItemListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-items',
  imports: [NgIcon, Pagination, PageTitle, RouterLink, DecimalPipe],
  templateUrl: './items.html',
  styles: ``
})
export class Items {
  private itemService = inject(ItemService);
  private toast       = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroTipo             = signal('');
  private refreshTrigger = signal(0);

  tipos = [
    { value: 'servicio',  label: 'Servicio'  },
    { value: 'tramite',   label: 'Trámite'   },
    { value: 'producto',  label: 'Producto'  },
    { value: 'recurso',   label: 'Recurso'   },
    { value: 'otro',      label: 'Otro'      },
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
        this.itemService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get items()    { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()    { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading(){ return this.state().type === 'loading'; }
  get error()    { return this.state().type === 'error'; }

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

  tipoLabel(tipo: ItemTipo): string {
    return this.tipos.find(t => t.value === tipo)?.label ?? tipo;
  }

  tipoBadgeClass(tipo: ItemTipo): string {
    const map: Record<string, string> = {
      servicio: 'bg-primary/15 text-primary',
      tramite:  'bg-warning/15 text-warning',
      producto: 'bg-success/15 text-success',
      recurso:  'bg-info/15 text-info',
      otro:     'bg-default-200 text-default-500',
    };
    return map[tipo] ?? 'bg-default-200 text-default-500';
  }

  deleteItem(id: number): void {
    Swal.fire({
      title: '¿Eliminar ítem?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.itemService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El ítem ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el ítem')
        });
      }
    });
  }
}
