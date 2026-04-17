import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { MenuItemService } from '../../application/services/menu-item.service';
import { MenuItemListResponse } from '../../domain/models/menu-item.model';
import { MenuService } from '../../../menus/application/services/menu.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import Swal from 'sweetalert2';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: MenuItemListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './menu-items.html',
  styles: ``
})
export class MenuItems {
  private menuItemService = inject(MenuItemService);
  private menuService     = inject(MenuService);
  private toast           = inject(ToastService);
  private route           = inject(ActivatedRoute);

  menuId    = signal<number>(Number(this.route.snapshot.paramMap.get('menuId')));
  menuNombre = signal<string>('');

  searchQuery          = signal('');
  pageIndex            = signal(1);
  pageSize             = signal(50);
  private refreshTrigger = signal(0);

  private params = computed(() => ({
    menu_id:   this.menuId(),
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.menuItemService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get items()     { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()     { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading() { return this.state().type === 'loading'; }
  get error()     { return this.state().type === 'error'; }

  constructor() {
    this.menuService.getById(this.menuId()).subscribe({
      next: (menu) => this.menuNombre.set(menu.nombre),
      error: () => {}
    });
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  getParentLabel(parentId: number | null): string {
    if (!parentId) return '—';
    const parent = this.items.find(i => i.id === parentId);
    return parent ? parent.etiqueta : `#${parentId}`;
  }

  deleteItem(id: number): void {
    Swal.fire({
      title: '¿Eliminar ítem?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.menuItemService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'Ítem eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: (err: HttpErrorResponse) => this.toast.error('Error', extractErrorMessage(err, 'No se pudo eliminar el ítem'))
        });
      }
    });
  }
}
