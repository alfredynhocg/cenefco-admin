import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { InformeAuditoriaService } from '../../application/services/informe-auditoria.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-informe-auditoria-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './informe-auditoria-create.html',
  styles: ``
})
export class InformeAuditoriaCreate {
  private fb             = inject(FormBuilder);
  private informeService = inject(InformeAuditoriaService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private http           = inject(HttpClient);

  submitting    = signal(false);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);

  anioActual = new Date().getFullYear();
  anios = Array.from({ length: 10 }, (_, i) => this.anioActual - i);

  form: FormGroup = this.fb.group({
    nombre:           ['', [Validators.required, Validators.maxLength(300)]],
    descripcion:      [''],
    pdf_url:          [''],
    pdf_nombre:       [''],
    estado:           ['borrador', [Validators.required]],
    fecha:            [''],
    anio:             [this.anioActual, [Validators.required]],
    publicado_en_web: [false],
  });

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
        this.form.patchValue({ pdf_url: res.url, pdf_nombre: file.name });
        this.uploadingFile.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el archivo'));
        this.fileName.set(null);
        this.form.patchValue({ pdf_url: '', pdf_nombre: '' });
        this.uploadingFile.set(false);
        input.value = '';
      }
    });
  }

  removeFile(): void {
    this.fileName.set(null);
    this.form.patchValue({ pdf_url: '', pdf_nombre: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingFile()) return;

    this.submitting.set(true);
    const payload = {
      ...this.form.value,
      fecha: this.form.value.fecha || null,
    };

    this.informeService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Informe de auditoría registrado exitosamente');
        this.router.navigate(['/senefco/informes-auditoria']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el informe'));
        this.submitting.set(false);
      }
    });
  }
}
