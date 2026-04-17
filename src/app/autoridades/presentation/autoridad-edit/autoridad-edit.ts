import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AutoridadService } from '../../application/services/autoridad.service';
import { Secretaria } from '../../domain/models/autoridad.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-autoridad-edit',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './autoridad-edit.html',
  styles: ``
})
export class AutoridadEdit {
  private autoridadService  = inject(AutoridadService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private fb                = inject(FormBuilder);
  private http              = inject(HttpClient);

  submitting       = signal(false);
  loadingAutoridad = signal(true);
  uploadingFoto    = signal(false);
  fotoPreview      = signal<string | null>(null);
  secretarias      = signal<Secretaria[]>([]);
  autoridadId      = signal<number | null>(null);

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

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.autoridadId.set(id);

    this.autoridadService.getAll({ pageSize: 1000 }).subscribe({
      next: (res) => {
        const autoridad = res.data.find(a => a.id === id);
        if (autoridad) {
          this.form.patchValue({
            secretaria_id:       autoridad.secretaria_id ?? null,
            nombre:              autoridad.nombre,
            apellido:            autoridad.apellido,
            cargo:               autoridad.cargo,
            tipo:                autoridad.tipo,
            perfil_profesional:  autoridad.perfil_profesional ?? '',
            email_institucional: autoridad.email_institucional ?? '',
            foto_url:            autoridad.foto_url ?? '',
            orden:               autoridad.orden,
            activo:              autoridad.activo,
            fecha_inicio_cargo:  autoridad.fecha_inicio_cargo ?? '',
            fecha_fin_cargo:     autoridad.fecha_fin_cargo ?? '',
          });
          if (autoridad.foto_url) {
            this.fotoPreview.set(autoridad.foto_url);
          }
        } else {
          this.toast.error('Error', 'Autoridad no encontrada');
          this.router.navigate(['/senefco/autoridades']);
        }
        this.loadingAutoridad.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la autoridad'));
        this.loadingAutoridad.set(false);
        this.router.navigate(['/senefco/autoridades']);
      }
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
        this.fotoPreview.set(this.form.get('foto_url')?.value || null);
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

    const id = this.autoridadId();
    if (!id) return;

    this.submitting.set(true);
    this.autoridadService.update(id, this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizada!', 'Autoridad actualizada exitosamente');
        this.router.navigate(['/senefco/autoridades']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la autoridad'));
        this.submitting.set(false);
      }
    });
  }
}
