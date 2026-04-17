import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NoticiaService } from '../../application/services/noticia.service';
import { CategoriaNoticia, Etiqueta } from '../../domain/models/noticia.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-noticia-create',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './noticia-create.html',
  styles: ``
})
export class NoticiaCreate {
  private noticiaService = inject(NoticiaService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private fb             = inject(FormBuilder);
  private http           = inject(HttpClient);

  submitting     = signal(false);
  uploadingImg   = signal(false);
  imgPreview     = signal<string | null>(null);
  categorias     = signal<CategoriaNoticia[]>([]);
  etiquetas      = signal<Etiqueta[]>([]);
  etiquetasSeleccionadas = signal<Set<number>>(new Set());

  form: FormGroup = this.fb.group({
    categoria_id:        [null, [Validators.required]],
    titulo:              ['', [Validators.required, Validators.maxLength(300)]],
    entradilla:          [''],
    cuerpo:              [''],
    imagen_principal_url:[''],
    imagen_alt:          [''],
    estado:              ['borrador'],
    destacada:           [false],
    fecha_publicacion:   [''],
    meta_titulo:         [''],
    meta_descripcion:    [''],
  });

  constructor() {
    this.noticiaService.getCategorias().subscribe({ next: (r) => this.categorias.set(r.data) });
    this.noticiaService.getEtiquetas().subscribe({ next: (r) => this.etiquetas.set(r.data) });
  }

  toggleEtiqueta(id: number): void {
    const set = new Set(this.etiquetasSeleccionadas());
    if (set.has(id)) set.delete(id); else set.add(id);
    this.etiquetasSeleccionadas.set(set);
  }

  tieneEtiqueta(id: number): boolean {
    return this.etiquetasSeleccionadas().has(id);
  }

  onImgSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.imgPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploadingImg.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ imagen_principal_url: res.url });
        this.uploadingImg.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
        this.imgPreview.set(null);
        this.uploadingImg.set(false);
        input.value = '';
      }
    });
  }

  removeImg(): void {
    this.imgPreview.set(null);
    this.form.patchValue({ imagen_principal_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg()) return;

    this.submitting.set(true);
    const payload = {
      ...this.form.value,
      etiquetas: Array.from(this.etiquetasSeleccionadas()),
      fecha_publicacion: this.form.value.fecha_publicacion || null,
    };

    this.noticiaService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Creada!', 'Noticia registrada exitosamente');
        this.router.navigate(['/senefco/noticias']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la noticia'));
        this.submitting.set(false);
      }
    });
  }
}
