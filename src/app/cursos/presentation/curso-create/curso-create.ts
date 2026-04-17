import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { CursoService } from '../../application/services/curso.service';
import { CategoriaCurso, TipoCurso } from '../../domain/models/curso.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-curso-create',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './curso-create.html',
  styles: ``
})
export class CursoCreate {
  private cursoService = inject(CursoService);
  private toast        = inject(ToastService);
  private router       = inject(Router);
  private fb           = inject(FormBuilder);
  private http         = inject(HttpClient);

  submitting    = signal(false);
  categorias    = signal<CategoriaCurso[]>([]);
  tipos         = signal<TipoCurso[]>([]);
  uploadingImg  = signal(false);
  imgPreview    = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    nombre_programa:          ['', [Validators.required, Validators.maxLength(200)]],
    slug:                     ['', [Validators.maxLength(300)]],
    descripcion:              [''],
    objetivo:                 [''],
    dirigido:                 [''],
    requisitos:               [''],
    inversion:                [''],
    creditaje:                [''],
    nota:                     [''],
    foto:                     [''],
    imagen_banner_url:        [''],
    imagen_alt:               [''],
    url_video:                [''],
    url_whatsapp:             [''],
    inicio_actividades:       [''],
    finalizacion_actividades: [''],
    inicio_inscripciones:     [''],
    id_tipoprograma:          [null],
    categoria_web_id:         [null],
    estado_web:               ['borrador'],
    destacado:                [false],
    orden:                    [0],
    meta_titulo:              ['', [Validators.maxLength(300)]],
    meta_descripcion:         ['', [Validators.maxLength(500)]],
  });

  constructor() {
    this.cursoService.getCategorias().subscribe({
      next: (res) => this.categorias.set(res.data),
    });
    this.cursoService.getTipos().subscribe({
      next: (res) => this.tipos.set(res.data),
    });
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
        this.form.patchValue({ foto: res.url });
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
    this.form.patchValue({ foto: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg()) return;

    this.submitting.set(true);
    this.cursoService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Curso registrado exitosamente');
        this.router.navigate(['/senefco/cursos']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el curso'));
        this.submitting.set(false);
      }
    });
  }
}
