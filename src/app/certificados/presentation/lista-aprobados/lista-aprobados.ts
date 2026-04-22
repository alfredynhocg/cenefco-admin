import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { Pagination } from '../../../common/components/pagination/pagination';
import { ToastService } from '../../../common/application/services/toast.service';
import { CertificadoService } from '../../application/services/certificado.service';
import { ListaAprobadoListResponse } from '../../domain/models/certificado.model';
import { extractErrorMessage } from '../../../utils/http-error';
import Swal from 'sweetalert2';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: ListaAprobadoListResponse }
  | { type: 'error' };

@Component({
  selector: 'app-lista-aprobados',
  imports: [NgIcon, PageTitle, Pagination],
  templateUrl: './lista-aprobados.html',
  styles: ``
})
export class ListaAprobados {
  private service = inject(CertificadoService);
  private toast   = inject(ToastService);

  pageIndex  = signal(1);
  pageSize   = signal(15);
  filtroImp  = signal<number | null>(null);
  private refresh = signal(0);

  private params = computed(() => ({
    pageIndex:  this.pageIndex(),
    pageSize:   this.pageSize(),
    imparte_id: this.filtroImp() ?? undefined,
    refresh:    this.refresh(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.service.getAprobados(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith({ type: 'loading' } as ApiState),
          catchError(() => of({ type: 'error' } as ApiState)),
        )
      ),
      startWith({ type: 'loading' } as ApiState),
    ),
    { requireSync: true }
  );

  get aprobados()  { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()      { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading()  { return this.state().type === 'loading'; }
  get isError()    { return this.state().type === 'error'; }

  onFiltrarImp(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    this.filtroImp.set(v ? +v : null);
    this.pageIndex.set(1);
  }
  onPageChange(p: number): void { this.pageIndex.set(p); }

  // ─── Formulario ───────────────────────────────────────────────────────────
  showForm  = signal(false);
  guardando = signal(false);
  form = signal({ imparte_id: null as number | null, usuario_id: null as number | null,
    nota_final: null as number | null, condicion: 'aprobado', observacion: '' });

  mostrarForm(): void {
    this.form.set({ imparte_id: null, usuario_id: null, nota_final: null, condicion: 'aprobado', observacion: '' });
    this.showForm.set(true);
  }

  cancelar(): void { this.showForm.set(false); }

  onField(field: string, value: any): void {
    this.form.update(f => ({ ...f, [field]: value }));
  }

  guardar(): void {
    const f = this.form();
    if (!f.imparte_id || !f.usuario_id) {
      this.toast.warning('Faltan datos', 'Ingrese imparte_id y usuario_id.');
      return;
    }
    this.guardando.set(true);
    this.service.createAprobado(f).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success('¡Guardado!', 'Aprobado registrado correctamente.');
        this.showForm.set(false);
        this.refresh.update(n => n + 1);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);
        this.toast.error('Error', extractErrorMessage(err));
      },
    });
  }

  deleteAprobado(id: number): void {
    Swal.fire({ title: '¿Eliminar este registro?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonText: 'Cancelar', confirmButtonText: 'Sí, eliminar',
    }).then(r => {
      if (!r.isConfirmed) return;
      this.service.deleteAprobado(id).subscribe({
        next: () => { this.toast.success('Eliminado', 'Registro eliminado.'); this.refresh.update(n => n + 1); },
        error: (err: HttpErrorResponse) => this.toast.error('Error', extractErrorMessage(err)),
      });
    });
  }

  condicionBadge(condicion: string): string {
    return condicion === 'aprobado' ? 'bg-success/15 text-success' : 'bg-info/15 text-info';
  }

  estadoCertBadge(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'bg-warning/15 text-warning',
      generado:  'bg-success/15 text-success',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }
}
