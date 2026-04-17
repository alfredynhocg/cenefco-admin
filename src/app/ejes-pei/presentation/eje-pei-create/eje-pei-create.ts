import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EjePeiService } from '../../application/services/eje-pei.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-eje-pei-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './eje-pei-create.html',
  styles: ``
})
export class EjePeiCreate {
  private fb            = inject(FormBuilder);
  private ejePeiService = inject(EjePeiService);
  private toast         = inject(ToastService);
  private router        = inject(Router);
  private http          = inject(HttpClient);

  submitting    = signal(false);
  uploadingImg  = signal(false);
  imgPreview    = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.maxLength(200)]],
    descripcion: [''],
    color:       ['#3b82f6'],
    imagen_url:  [''],
    orden:       [0],
    activo:      [true],
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

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg()) return;
    this.submitting.set(true);
    this.ejePeiService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Eje PEI creado exitosamente');
        this.router.navigate(['/senefco/ejes-pei']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el eje PEI'));
        this.submitting.set(false);
      }
    });
  }
}
