import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { HistoriaMunicipioService } from '../../application/services/historia-municipio.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-historia-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './historia-edit.html',
  styles: ``
})
export class HistoriaEdit implements OnInit {
  private fb              = inject(FormBuilder);
  private historiaService = inject(HistoriaMunicipioService);
  private toast           = inject(ToastService);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private http            = inject(HttpClient);

  submitting      = signal(false);
  loadingData     = signal(true);
  uploadingImagen = signal(false);
  historiaId      = 0;

  form: FormGroup = this.fb.group({
    titulo:       ['', [Validators.required, Validators.maxLength(250)]],
    contenido:    [''],
    fecha_inicio: [''],
    fecha_fin:    [''],
    imagen_url:   [''],
    orden:        [0],
    activo:       [true],
  });

  ngOnInit(): void {
    this.historiaId = Number(this.route.snapshot.paramMap.get('id'));
    this.historiaService.getById(this.historiaId).subscribe({
      next: (data) => {
        this.form.patchValue({
          ...data,
          fecha_inicio: data.fecha_inicio ?? '',
          fecha_fin:    data.fecha_fin    ?? '',
        });
        this.loadingData.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la entrada'));
        this.router.navigate(['/senefco/historia-municipio']);
      }
    });
  }

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
    this.historiaService.update(this.historiaId, payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Entrada actualizada exitosamente');
        this.router.navigate(['/senefco/historia-municipio']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la entrada'));
        this.submitting.set(false);
      }
    });
  }
}
