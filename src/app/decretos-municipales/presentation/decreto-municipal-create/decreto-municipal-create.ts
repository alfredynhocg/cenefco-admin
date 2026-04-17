import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DecretoMunicipalService } from '../../application/services/decreto-municipal.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-decreto-municipal-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './decreto-municipal-create.html',
  styles: ``
})
export class DecretoMunicipalCreate {
  private fb             = inject(FormBuilder);
  private decretoService = inject(DecretoMunicipalService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private http           = inject(HttpClient);

  submitting    = signal(false);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);

  anioActual = new Date().getFullYear();
  anios = Array.from({ length: 10 }, (_, i) => this.anioActual - i);

  tipos = [
    { value: 'decreto',    label: 'Decreto Municipal' },
    { value: 'resolucion', label: 'Resolución Municipal' },
    { value: 'ordenanza',  label: 'Ordenanza Municipal' },
  ];

  form: FormGroup = this.fb.group({
    numero:             ['', [Validators.required, Validators.maxLength(50)]],
    tipo:               ['decreto', [Validators.required]],
    titulo:             ['', [Validators.required, Validators.maxLength(300)]],
    descripcion:        [''],
    pdf_url:            [''],
    pdf_nombre:         [''],
    estado:             ['borrador', [Validators.required]],
    fecha_promulgacion: [''],
    anio:               [this.anioActual, [Validators.required]],
    publicado_en_web:   [false],
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
      fecha_promulgacion: this.form.value.fecha_promulgacion || null,
    };

    this.decretoService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Decreto municipal registrado exitosamente');
        this.router.navigate(['/senefco/decretos-municipales']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el decreto'));
        this.submitting.set(false);
      }
    });
  }
}
