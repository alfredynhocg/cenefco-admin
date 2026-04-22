import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { CursoService } from '../../application/services/curso.service';
import { Curso, CursoListResponse } from '../../domain/models/curso.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: CursoListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-cursos',
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './cursos.html',
  styles: ``
})
export class Cursos {
  private cursoService = inject(CursoService);
  private toast        = inject(ToastService);

  searchQuery     = signal('');
  pageIndex       = signal(1);
  pageSize        = signal(10);
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
        this.cursoService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get cursos()    { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()     { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading() { return this.state().type === 'loading'; }
  get error()     { return this.state().type === 'error'; }

  qrCurso        = signal<Curso | null>(null);
  qrDataUrl      = signal<string | null>(null);
  sincronizandoId = signal<number | null>(null);

  async abrirQR(curso: Curso): Promise<void> {
    const base = window.location.origin.replace('admin.', '').replace(':4200', '');
    const url  = curso.slug
      ? `${base}/programas/${curso.slug}`
      : `${base}/programas`;
    const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2, color: { dark: '#111827', light: '#ffffff' } });
    this.qrCurso.set(curso);
    this.qrDataUrl.set(dataUrl);
  }

  cerrarQR(): void {
    this.qrCurso.set(null);
    this.qrDataUrl.set(null);
  }

  descargarQR(): void {
    const url = this.qrDataUrl();
    const nombre = this.qrCurso()?.nombre_programa ?? 'qr';
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  sincronizarMoodle(curso: Curso): void {
    Swal.fire({
      title: '¿Crear en Moodle?',
      html: `Se creará el curso <b>${curso.nombre_programa}</b> en Moodle.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.sincronizandoId.set(curso.id_programa);
      this.cursoService.sincronizarMoodle(curso.id_programa).subscribe({
        next: (moodleCurso) => {
          this.sincronizandoId.set(null);
          this.toast.success('¡Creado en Moodle!', `Curso creado con ID ${moodleCurso.id}`);
        },
        error: () => {
          this.sincronizandoId.set(null);
          this.toast.error('Error', 'No se pudo crear el curso en Moodle');
        }
      });
    });
  }

  deleteCurso(id: number): void {
    Swal.fire({
      title: '¿Eliminar curso?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.cursoService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El curso ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el curso')
        });
      }
    });
  }
}
