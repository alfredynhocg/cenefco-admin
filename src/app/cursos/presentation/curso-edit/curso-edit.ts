import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { CursoService } from '../../application/services/curso.service';
import { CategoriaCurso, TipoCurso } from '../../domain/models/curso.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { CursoImagenes } from '../../../common/components/curso-imagenes/curso-imagenes';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-curso-edit',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle, CursoImagenes, CKEditorModule],
  templateUrl: './curso-edit.html',
  styles: ``
})
export class CursoEdit implements OnInit {
  private cursoService = inject(CursoService);
  private toast        = inject(ToastService);
  private router       = inject(Router);
  private route        = inject(ActivatedRoute);
  private fb           = inject(FormBuilder);

  private http   = inject(HttpClient);

  submitting      = signal(false);
  Editor          = ClassicEditor as any;
  private ckEditor: any = null;
  onEditorReady(editor: any) { this.ckEditor = editor; }
  loadingCurso  = signal(true);
  categorias    = signal<CategoriaCurso[]>([]);
  tipos         = signal<TipoCurso[]>([]);
  uploadingImg  = signal(false);
  imgPreview    = signal<string | null>(null);
  uploadingPdf  = signal(false);
  pdfName       = signal<string | null>(null);
  private id!: number;

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
    titulo_documento1:        [''],
    documento1:               [''],
    imagen_banner_url:        [''],
    imagen_alt:               [''],
    url_video:                [''],
    url_whatsapp:             [''],
    url_whatsapp2:            [''],
    imagenes:                 [[] as string[]],
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
    mensaje_exito:            [''],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.cursoService.getCategorias().subscribe({
      next: (res) => this.categorias.set(res.data),
    });
    this.cursoService.getTipos().subscribe({
      next: (res) => this.tipos.set(res.data),
    });

    this.cursoService.getById(this.id).subscribe({
      next: (curso) => {
        this.form.patchValue({
          nombre_programa:          curso.nombre_programa,
          slug:                     curso.slug,
          descripcion:              curso.descripcion,
          objetivo:                 curso.objetivo,
          dirigido:                 curso.dirigido,
          requisitos:               curso.requisitos,
          inversion:                curso.inversion,
          creditaje:                curso.creditaje,
          nota:                     curso.nota,
          foto:                     curso.foto,
          titulo_documento1:        curso.titulo_documento1,
          documento1:               curso.documento1,
          imagen_banner_url:        curso.imagen_banner_url,
          imagen_alt:               curso.imagen_alt,
          url_video:                curso.url_video,
          url_whatsapp:             curso.url_whatsapp,
          url_whatsapp2:            curso.url_whatsapp2,
          imagenes:                 Array.isArray(curso.imagenes) ? curso.imagenes : (typeof curso.imagenes === 'string' ? JSON.parse(curso.imagenes) : []),
          inicio_actividades:       curso.inicio_actividades,
          finalizacion_actividades: curso.finalizacion_actividades,
          inicio_inscripciones:     curso.inicio_inscripciones,
          id_tipoprograma:          curso.id_tipoprograma,
          categoria_web_id:         curso.categoria_web_id,
          estado_web:               curso.estado_web,
          destacado:                curso.destacado,
          orden:                    curso.orden,
          meta_titulo:              curso.meta_titulo,
          meta_descripcion:         curso.meta_descripcion,
          mensaje_exito:            curso.mensaje_exito,
        });
        if (curso.foto) this.imgPreview.set(curso.foto);
        if (curso.documento1) this.pdfName.set(curso.titulo_documento1 ?? curso.documento1);
        this.loadingCurso.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el curso'));
        this.router.navigate(['/senefco/cursos']);
      }
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

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingPdf.set(true);
    this.pdfName.set(file.name);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/file', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ documento1: res.url });
        this.uploadingPdf.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el documento'));
        this.pdfName.set(null);
        this.form.patchValue({ documento1: '' });
        this.uploadingPdf.set(false);
        input.value = '';
      }
    });
  }

  removePdf(): void {
    this.pdfName.set(null);
    this.form.patchValue({ documento1: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg() || this.uploadingPdf()) return;
    if (this.ckEditor) this.form.get('mensaje_exito')?.setValue(this.ckEditor.getData());

    this.submitting.set(true);
    this.cursoService.update(this.id, this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Curso actualizado exitosamente');
        this.router.navigate(['/senefco/cursos']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el curso'));
        this.submitting.set(false);
      }
    });
  }
}
