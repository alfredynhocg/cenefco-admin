import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GaleriaService } from '../../application/services/galeria.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-galeria-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './galeria-create.html',
  styles: ``
})
export class GaleriaCreate {
  private galeriaService = inject(GaleriaService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private fb             = inject(FormBuilder);
  private http           = inject(HttpClient);

  submitting   = signal(false);
  uploadingImg = signal(false);
  imgPreview   = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    titulo:      ['', [Validators.required, Validators.maxLength(200)]],
    descripcion: [''],
    portada_url: [''],
    tipo:        ['fotos'],
    orden:       [0],
    activo:      [true],
  });

  onPortadaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.imgPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploadingImg.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ portada_url: res.url });
        this.imgPreview.set(res.url);
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

  removePortada(): void {
    this.imgPreview.set(null);
    this.form.patchValue({ portada_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg()) return;

    this.submitting.set(true);
    const val = this.form.value;
    this.galeriaService.create({
      ...val,
      portada_url: val.portada_url || null,
      orden:       Number(val.orden) || 0,
    }).subscribe({
      next: () => {
        this.toast.success('¡Creada!', 'Galería registrada exitosamente');
        this.router.navigate(['/senefco/galerias']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la galería'));
        this.submitting.set(false);
      }
    });
  }
}
