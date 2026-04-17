import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NoticiaService } from '../../application/services/noticia.service';
import { CategoriaNoticia, Etiqueta } from '../../domain/models/noticia.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-noticia-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle, CKEditorModule],
  templateUrl: './noticia-edit.html',
  styles: ``
})
export class NoticiaEdit {
  public Editor: any = ClassicEditor;
  public editorConfig = {
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'link',
      'bulletedList', 'numberedList',
      'blockQuote', 'undo', 'redo'
    ]
  };
  private noticiaService = inject(NoticiaService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private fb             = inject(FormBuilder);
  private http           = inject(HttpClient);

  submitting      = signal(false);
  loadingNoticia  = signal(true);
  uploadingImg    = signal(false);
  imgPreview      = signal<string | null>(null);
  noticiaId       = signal<number | null>(null);
  categorias      = signal<CategoriaNoticia[]>([]);
  etiquetas       = signal<Etiqueta[]>([]);
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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.noticiaId.set(id);

    this.noticiaService.getCategorias().subscribe({ next: (r) => this.categorias.set(r.data) });
    this.noticiaService.getEtiquetas().subscribe({ next: (r) => this.etiquetas.set(r.data) });

    this.noticiaService.getById(id).subscribe({
      next: (noticia) => {
        this.form.patchValue({
          categoria_id:         noticia.categoria_id,
          titulo:               noticia.titulo,
          entradilla:           noticia.entradilla ?? '',
          cuerpo:               noticia.cuerpo ?? '',
          imagen_principal_url: noticia.imagen_principal_url ?? '',
          imagen_alt:           noticia.imagen_alt ?? '',
          estado:               noticia.estado,
          destacada:            noticia.destacada,
          fecha_publicacion:    noticia.fecha_publicacion ? noticia.fecha_publicacion.substring(0, 10) : '',
          meta_titulo:          noticia.meta_titulo ?? '',
          meta_descripcion:     noticia.meta_descripcion ?? '',
        });
        if (noticia.imagen_principal_url) {
          const url = noticia.imagen_principal_url.startsWith('/storage/') || noticia.imagen_principal_url.startsWith('http')
            ? noticia.imagen_principal_url
            : '/storage/' + noticia.imagen_principal_url;
          this.imgPreview.set(url);
          this.form.patchValue({ imagen_principal_url: url });
        }
        if (noticia.etiquetas?.length) {
          this.etiquetasSeleccionadas.set(new Set(noticia.etiquetas.map(e => e.id)));
        }
        this.loadingNoticia.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la noticia'));
        this.loadingNoticia.set(false);
        this.router.navigate(['/senefco/noticias']);
      }
    });
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
        this.imgPreview.set(this.form.get('imagen_principal_url')?.value || null);
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

    const id = this.noticiaId();
    if (!id) return;

    this.submitting.set(true);
    const payload = {
      ...this.form.value,
      etiquetas: Array.from(this.etiquetasSeleccionadas()),
      fecha_publicacion: this.form.value.fecha_publicacion || null,
    };

    this.noticiaService.update(id, payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizada!', 'Noticia actualizada exitosamente');
        this.router.navigate(['/senefco/noticias']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la noticia'));
        this.submitting.set(false);
      }
    });
  }
}
