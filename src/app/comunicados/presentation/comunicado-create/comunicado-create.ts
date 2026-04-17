import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ComunicadoService } from '../../application/services/comunicado.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-comunicado-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './comunicado-create.html',
  styles: ``
})
export class ComunicadoCreate {
  private fb                = inject(FormBuilder);
  private comunicadoService = inject(ComunicadoService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private http              = inject(HttpClient);

  submitting     = signal(false);
  uploadingImg   = signal(false);
  uploadingFile  = signal(false);
  imgPreview     = signal<string | null>(null);
  fileName       = signal<string | null>(null);

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
        this.imgPreview.set(null);
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
        this.fileName.set(null);
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

    this.comunicadoService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Comunicado registrado exitosamente');
        this.router.navigate(['/senefco/comunicados']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el comunicado'));
        this.submitting.set(false);
      }
    });
  }
}
