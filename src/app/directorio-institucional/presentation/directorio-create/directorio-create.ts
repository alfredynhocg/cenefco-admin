import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DirectorioService } from '../../application/services/directorio.service';
import { Secretaria } from '../../domain/models/directorio.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-directorio-create',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './directorio-create.html',
  styles: ``
})
export class DirectorioCreate {
  private directorioService = inject(DirectorioService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private fb                = inject(FormBuilder);
  private http              = inject(HttpClient);

  submitting    = signal(false);
  uploadingFoto = signal(false);
  fotoPreview   = signal<string | null>(null);
  secretarias   = signal<Secretaria[]>([]);

  form: FormGroup = this.fb.group({
    secretaria_id:     [null],
    nombre:            ['', [Validators.required, Validators.maxLength(150)]],
    descripcion:       [''],
    responsable:       ['', [Validators.maxLength(150)]],
    cargo_responsable: ['', [Validators.maxLength(150)]],
    telefono:          ['', [Validators.maxLength(30)]],
    telefono_interno:  ['', [Validators.maxLength(20)]],
    email:             ['', [Validators.email]],
    ubicacion:         ['', [Validators.maxLength(200)]],
    horario:           ['', [Validators.maxLength(200)]],
    foto_url:          [''],
    orden:             [0],
    activo:            [true],
  });

  constructor() {
    this.directorioService.getSecretarias().subscribe({
      next: (res) => this.secretarias.set(res.data),
    });
  }

  onFotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.fotoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploadingFoto.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ foto_url: res.url });
        this.uploadingFoto.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
        this.fotoPreview.set(null);
        this.uploadingFoto.set(false);
        input.value = '';
      }
    });
  }

  removeFoto(): void {
    this.fotoPreview.set(null);
    this.form.patchValue({ foto_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingFoto()) return;
    this.submitting.set(true);
    this.directorioService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Registrada!', 'Entrada creada exitosamente');
        this.router.navigate(['/senefco/directorio-institucional']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la entrada'));
        this.submitting.set(false);
      }
    });
  }
}
