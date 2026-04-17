import { ChangeDetectorRef, Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ComunicadoService } from '../../application/services/comunicado.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-comunicado-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './comunicado-edit.html',
  styles: ``
})
export class ComunicadoEdit implements OnInit {
  private fb                = inject(FormBuilder);
  private comunicadoService = inject(ComunicadoService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private http              = inject(HttpClient);
  private cdr               = inject(ChangeDetectorRef);

  submitting         = signal(false);
  loadingComunicado  = signal(true);
  uploadingImg       = signal(false);
  uploadingFile      = signal(false);
  imgPreview         = signal<string | null>(null);
  fileName           = signal<string | null>(null);
  private id!: number;

  form: FormGroup = this.fb.group({
    titulo:            ['', [Validators.required, Validators.maxLength(300)]],
    resumen:           [''],
    cuerpo:            [''],
    imagen_url:        [''],
    archivo_url:       [''],
    estado:            ['borrador'],
    destacado:         [false],
    fecha_publicacion: [''],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.comunicadoService.getById(this.id).subscribe({
      next: (c) => {
        this.form.patchValue({
          titulo:            c.titulo,
          resumen:           c.resumen ?? '',
          cuerpo:            c.cuerpo ?? '',
          imagen_url:        c.imagen_url ?? '',
          archivo_url:       c.archivo_url ?? '',
          estado:            c.estado,
          destacado:         c.destacado,
          fecha_publicacion: c.fecha_publicacion ? c.fecha_publicacion.substring(0, 10) : '',
        });
        if (c.imagen_url) {
          const url = c.imagen_url.startsWith('/storage/') || c.imagen_url.startsWith('http')
            ? c.imagen_url
            : '/storage/' + c.imagen_url;
          this.imgPreview.set(url);
          this.form.patchValue({ imagen_url: url });
        }
        if (c.archivo_url) {
          const normalizedFile = c.archivo_url.startsWith('/storage/') || c.archivo_url.startsWith('http')
            ? c.archivo_url
            : '/storage/' + c.archivo_url;
          this.form.patchValue({ archivo_url: normalizedFile });
          const parts = normalizedFile.split('/');
          this.fileName.set(parts[parts.length - 1]);
        }
        this.loadingComunicado.set(false);
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el comunicado'));
        this.router.navigate(['/senefco/comunicados']);
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
        this.form.patchValue({ imagen_url: res.url });
        this.uploadingImg.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
        this.imgPreview.set(this.form.get('imagen_url')?.value || null);
        this.uploadingImg.set(false);
        input.value = '';
      }
    });
  }

  removeImg(): void {
    this.imgPreview.set(null);
    this.form.patchValue({ imagen_url: '' });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingFile.set(true);
    this.fileName.set(file.name);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/file', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ archivo_url: res.url });
        this.uploadingFile.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el archivo'));
        this.uploadingFile.set(false);
        input.value = '';
      }
    });
  }

  removeFile(): void {
    this.fileName.set(null);
    this.form.patchValue({ archivo_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg() || this.uploadingFile()) return;

    this.submitting.set(true);
    const payload = {
      ...this.form.value,
      fecha_publicacion: this.form.value.fecha_publicacion || null,
    };

    this.comunicadoService.update(this.id, payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Comunicado actualizado exitosamente');
        this.router.navigate(['/senefco/comunicados']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el comunicado'));
        this.submitting.set(false);
      }
    });
  }
}
