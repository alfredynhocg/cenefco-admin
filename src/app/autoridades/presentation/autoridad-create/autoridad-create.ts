import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AutoridadService } from '../../application/services/autoridad.service';
import { Secretaria } from '../../domain/models/autoridad.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-autoridad-create',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './autoridad-create.html',
  styles: ``
})
export class AutoridadCreate {
  private autoridadService = inject(AutoridadService);
  private toast            = inject(ToastService);
  private router           = inject(Router);
  private fb               = inject(FormBuilder);
  private http             = inject(HttpClient);

  submitting    = signal(false);
  uploadingFoto = signal(false);
  fotoPreview   = signal<string | null>(null);
  secretarias   = signal<Secretaria[]>([]);

  tiposAutoridad = [
    { value: 'alcalde',    label: 'Alcalde' },
    { value: 'subalcalde', label: 'Subalcalde' },
    { value: 'secretario', label: 'Secretario' },
    { value: 'director',   label: 'Director' },
    { value: 'jefe',       label: 'Jefe' },
    { value: 'otro',       label: 'Otro' },
  ];

  form: FormGroup = this.fb.group({
    secretaria_id:       [null],
    nombre:              ['', [Validators.required, Validators.maxLength(100)]],
    apellido:            ['', [Validators.required, Validators.maxLength(100)]],
    cargo:               ['', [Validators.required, Validators.maxLength(100)]],
    tipo:                ['otro'],
    perfil_profesional:  [''],
    email_institucional: ['', [Validators.email]],
    foto_url:            [''],
    orden:               [0],
    activo:              [true],
    fecha_inicio_cargo:  [''],
    fecha_fin_cargo:     [''],
  });

  constructor() {
    this.autoridadService.getSecretarias().subscribe({
      next: (res) => this.secretarias.set(res.data),
    });
  }

  onFotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Mostrar preview local inmediatamente
    const reader = new FileReader();
    reader.onload = (e) => this.fotoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    // Subir al servidor
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
    this.autoridadService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Creada!', 'Autoridad registrada exitosamente');
        this.router.navigate(['/senefco/autoridades']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la autoridad'));
        this.submitting.set(false);
      }
    });
  }
}
