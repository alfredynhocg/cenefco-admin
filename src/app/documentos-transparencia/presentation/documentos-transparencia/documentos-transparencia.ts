import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DocumentoTransparenciaService } from '../../application/services/documento-transparencia.service';
import { DocumentoTransparenciaListResponse } from '../../domain/models/documento-transparencia.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: DocumentoTransparenciaListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-documentos-transparencia',
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './documentos-transparencia.html',
  styles: ``
})
export class DocumentosTransparencia {
  private documentoService   = inject(DocumentoTransparenciaService);
  private toast              = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroCategoria        = signal('');
  filtroAnio             = signal('');
  private refreshTrigger = signal(0);

  anios = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  categorias = [
    { value: 'presupuesto',         label: 'Presupuesto' },
    { value: 'contrato',            label: 'Contrato' },
    { value: 'resolucion',          label: 'Resolución' },
    { value: 'ordenanza',           label: 'Ordenanza' },
    { value: 'informe',             label: 'Informe' },
    { value: 'declaracion_bienes',  label: 'Declaración de Bienes' },
    { value: 'plan_anual',          label: 'Plan Anual' },
    { value: 'rendicion_cuentas',   label: 'Rendición de Cuentas' },
    { value: 'otro',                label: 'Otro' },
  ];

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    categoria: this.filtroCategoria(),
    anio:      this.filtroAnio(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.documentoService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get documentos() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()      { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()  { return this.state().type === 'loading'; }
  get error()      { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroChange(field: 'categoria' | 'anio', event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (field === 'categoria') this.filtroCategoria.set(value);
    if (field === 'anio')      this.filtroAnio.set(value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  categoriaBadgeClass(categoria: string): string {
    const map: Record<string, string> = {
      presupuesto:        'bg-primary/15 text-primary',
      contrato:           'bg-info/15 text-info',
      resolucion:         'bg-warning/15 text-warning',
      ordenanza:          'bg-success/15 text-success',
      informe:            'bg-default-200 text-default-600',
      declaracion_bienes: 'bg-danger/15 text-danger',
      plan_anual:         'bg-violet-100 text-violet-600',
      rendicion_cuentas:  'bg-orange-100 text-orange-600',
      otro:               'bg-default-200 text-default-500',
    };
    return map[categoria] ?? 'bg-default-200 text-default-600';
  }

  categoriaLabel(categoria: string): string {
    const found = this.categorias.find(c => c.value === categoria);
    return found ? found.label : categoria;
  }

  deleteDocumento(id: number): void {
    Swal.fire({
      title: '¿Eliminar documento?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.documentoService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El documento ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el documento')
        });
      }
    });
  }
}
