import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { GaleriaService } from '../../application/services/galeria.service';
import { GaleriaItemListResponse } from '../../domain/models/galeria.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import Swal from 'sweetalert2';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: GaleriaItemListResponse }
  | { type: 'error' };

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-galeria-items',
  standalone: true,
  imports: [NgIcon, PageTitle, RouterLink],
  templateUrl: './galeria-items.html',
  styles: ``
})
export class GaleriaItems {
  private galeriaService = inject(GaleriaService);
  private toast          = inject(ToastService);
  private http           = inject(HttpClient);
  private route          = inject(ActivatedRoute);

  galeriaId    = signal<number>(Number(this.route.snapshot.paramMap.get('galeriaId')));
  galeriaNombre = signal<string>('');
  uploading    = signal(false);
  private refreshTrigger = signal(0);

  private params = computed(() => ({
    galeria_id: this.galeriaId(),
    pageSize:   200,
    refresh:    this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.galeriaService.getItems(p).pipe(
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
    this.galeriaService.getById(this.galeriaId()).subscribe({
      next: (g) => this.galeriaNombre.set(g.titulo),
      error: () => {}
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    this.uploading.set(true);
    let pending = files.length;

    files.forEach(file => {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
        next: (res) => {
          this.galeriaService.createItem({
            galeria_id: this.galeriaId(),
            tipo:       'foto',
            url:        res.url,
          }).subscribe({
            next: () => {
              pending--;
              if (pending === 0) {
                this.uploading.set(false);
                this.toast.success('¡Listo!', 'Imágenes subidas correctamente');
                this.refreshTrigger.update(n => n + 1);
                input.value = '';
              }
            },
            error: () => {
              pending--;
              if (pending === 0) {
                this.uploading.set(false);
                this.refreshTrigger.update(n => n + 1);
              }
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          pending--;
          this.toast.error('Error', extractErrorMessage(err, `No se pudo subir ${file.name}`));
          if (pending === 0) {
            this.uploading.set(false);
            input.value = '';
          }
        }
      });
    });
  }

  deleteItem(id: number): void {
    Swal.fire({
      title: '¿Eliminar archivo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.galeriaService.deleteItem(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'Archivo eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: (err: HttpErrorResponse) => this.toast.error('Error', extractErrorMessage(err, 'No se pudo eliminar'))
        });
      }
    });
  }
}
