import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { IndicadorGestionService } from '../../application/services/indicador-gestion.service';
import { IndicadorGestionListResponse, IndicadorCategoria, IndicadorEstado } from '../../domain/models/indicador-gestion.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../../utils/http-error';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: IndicadorGestionListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-indicadores',
  imports: [NgIcon, Pagination, PageTitle, RouterLink, DecimalPipe],
  templateUrl: './indicadores.html',
  styles: ``
})
export class Indicadores {
  private indicadorService = inject(IndicadorGestionService);
  private toast            = inject(ToastService);

  searchQuery            = signal('');
  pageIndex              = signal(1);
  pageSize               = signal(10);
  filtroCategoria        = signal('');
  filtroEstado           = signal('');
  private refreshTrigger = signal(0);

  categorias = [
    { value: 'social',           label: 'Social'           },
    { value: 'economico',        label: 'Económico'        },
    { value: 'infraestructura',  label: 'Infraestructura'  },
    { value: 'salud',            label: 'Salud'            },
    { value: 'educacion',        label: 'Educación'        },
    { value: 'medioambiente',    label: 'Medio Ambiente'   },
    { value: 'seguridad',        label: 'Seguridad'        },
    { value: 'otro',             label: 'Otro'             },
  ];

  estados = [
    { value: 'en_meta',     label: 'En Meta'     },
    { value: 'por_encima',  label: 'Por Encima'  },
    { value: 'por_debajo',  label: 'Por Debajo'  },
    { value: 'sin_dato',    label: 'Sin Dato'    },
  ];

  private params = computed(() => ({
    query:      this.searchQuery(),
    pageIndex:  this.pageIndex(),
    pageSize:   this.pageSize(),
    categoria:  this.filtroCategoria(),
    estado:     this.filtroEstado(),
    refresh:    this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.indicadorService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get indicadores() { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()       { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()   { return this.state().type === 'loading'; }
  get error()       { return this.state().type === 'error'; }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onFiltroCategoria(event: Event): void {
    this.filtroCategoria.set((event.target as HTMLSelectElement).value);
    this.pageIndex.set(1);
  }

  onFiltroEstado(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  categoriaLabel(cat: IndicadorCategoria): string {
    return this.categorias.find(c => c.value === cat)?.label ?? cat;
  }

  categoriaBadgeClass(cat: IndicadorCategoria): string {
    const map: Record<string, string> = {
      social:          'bg-primary/15 text-primary',
      economico:       'bg-warning/15 text-warning',
      infraestructura: 'bg-info/15 text-info',
      salud:           'bg-success/15 text-success',
      educacion:       'bg-purple-500/15 text-purple-500',
      medioambiente:   'bg-teal-500/15 text-teal-500',
      seguridad:       'bg-danger/15 text-danger',
      otro:            'bg-default-200 text-default-500',
    };
    return map[cat] ?? 'bg-default-200 text-default-500';
  }

  estadoBadgeClass(estado: IndicadorEstado): string {
    const map: Record<string, string> = {
      en_meta:    'bg-success/15 text-success',
      por_encima: 'bg-info/15 text-info',
      por_debajo: 'bg-danger/15 text-danger',
      sin_dato:   'bg-default-200 text-default-500',
    };
    return map[estado] ?? 'bg-default-200 text-default-500';
  }

  estadoLabel(estado: IndicadorEstado): string {
    return this.estados.find(e => e.value === estado)?.label ?? estado;
  }

  calcularPorcentaje(valorActual: number | null, meta: number | null): number | null {
    if (valorActual == null || meta == null || meta === 0) return null;
    return Math.min((valorActual / meta) * 100, 100);
  }

  deleteIndicador(id: number): void {
    Swal.fire({
      title: '¿Eliminar indicador?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.indicadorService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El indicador ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el indicador')
        });
      }
    });
  }
}
