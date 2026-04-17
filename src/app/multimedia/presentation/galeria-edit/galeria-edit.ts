import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GaleriaService } from '../../application/services/galeria.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-galeria-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './galeria-edit.html',
  styles: ``
})
export class GaleriaEdit {
  private galeriaService = inject(GaleriaService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private fb             = inject(FormBuilder);
  private http           = inject(HttpClient);

  submitting    = signal(false);
  loadingGaleria = signal(true);
  uploadingImg  = signal(false);
  imgPreview    = signal<string | null>(null);
  galeriaId     = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    titulo:      ['', [Validators.required, Validators.maxLength(200)]],
    descripcion: [''],
    portada_url: [''],
    tipo:        ['fotos'],
    orden:       [0],
    activo:      [true],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.galeriaId.set(id);

    this.galeriaService.getById(id).subscribe({
      next: (galeria) => {
        this.form.patchValue({
          titulo:      galeria.titulo,
          descripcion: galeria.descripcion ?? '',
          portada_url: galeria.portada_url ?? '',
          tipo:        galeria.tipo,
          orden:       galeria.orden,
          activo:      galeria.activo,
        });
        if (galeria.portada_url) this.imgPreview.set(galeria.portada_url);
        this.loadingGaleria.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la galería'));
        this.loadingGaleria.set(false);
        this.router.navigate(['/senefco/galerias']);
      }
    });
  }

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
        this.imgPreview.set(this.form.get('portada_url')?.value || null);
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

    const id = this.galeriaId();
    if (!id) return;

    this.submitting.set(true);
    const val = this.form.value;
    this.galeriaService.update(id, {
      ...val,
      portada_url: val.portada_url || null,
      orden:       Number(val.orden) || 0,
    }).subscribe({
      next: () => {
        this.toast.success('¡Actualizada!', 'Galería actualizada exitosamente');
        this.router.navigate(['/senefco/galerias']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la galería'));
        this.submitting.set(false);
      }
    });
  }
}
