import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { HistoriaMunicipioService } from '../../application/services/historia-municipio.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-historia-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './historia-create.html',
  styles: ``
})
export class HistoriaCreate {
  private fb              = inject(FormBuilder);
  private historiaService = inject(HistoriaMunicipioService);
  private toast           = inject(ToastService);
  private router          = inject(Router);
  private http            = inject(HttpClient);

  submitting      = signal(false);
  uploadingImagen = signal(false);

  form: FormGroup = this.fb.group({
    titulo:       ['', [Validators.required, Validators.maxLength(250)]],
    contenido:    [''],
    fecha_inicio: [''],
    fecha_fin:    [''],
    imagen_url:   [''],
    orden:        [0],
    activo:       [true],
  });

  onImagenSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingImagen.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ imagen_url: res.url });
        this.uploadingImagen.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
        this.uploadingImagen.set(false);
        input.value = '';
      }
    });
  }

  removeImagen(): void {
    this.form.patchValue({ imagen_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImagen()) return;

    const value = this.form.value;
    const payload = {
      ...value,
      fecha_inicio: value.fecha_inicio || null,
      fecha_fin:    value.fecha_fin    || null,
    };

    this.submitting.set(true);
    this.historiaService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Entrada registrada exitosamente');
        this.router.navigate(['/senefco/historia-municipio']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la entrada'));
        this.submitting.set(false);
      }
    });
  }
}
