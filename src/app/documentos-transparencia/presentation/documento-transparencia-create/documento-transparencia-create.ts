import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DocumentoTransparenciaService } from '../../application/services/documento-transparencia.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-documento-transparencia-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './documento-transparencia-create.html',
  styles: ``
})
export class DocumentoTransparenciaCreate {
  private fb               = inject(FormBuilder);
  private documentoService = inject(DocumentoTransparenciaService);
  private toast            = inject(ToastService);
  private router           = inject(Router);
  private http             = inject(HttpClient);

  submitting    = signal(false);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);

  anioActual = new Date().getFullYear();
  anios = Array.from({ length: 10 }, (_, i) => this.anioActual - i);

  categorias = [
    { value: 'presupuesto',         label: 'Presupuesto' },
    { value: 'contrato',            label: 'Contrato' },
    { value: 'resolucion',          label: 'Resolución' },
    { value: 'ordenanza',           label: 'Ordenanza' },
    { value: 'informe',             label: 'Informe' },
    { value: 'declaracion_bienes',  label: 'Declaración de Bienes' },
    { value: 'plan_anual',          label: 'Plan Anual' },
    { value: 'rendicion_cuentas',   label: 'Rendición de Cuentas' },
    { value: 'otro',                label: 'Otro' },
  ];

  form: FormGroup = this.fb.group({
    titulo:            ['', [Validators.required, Validators.maxLength(300)]],
    descripcion:       [''],
    categoria:         ['informe', [Validators.required]],
    anio:              [this.anioActual, [Validators.required]],
    archivo_url:       ['', [Validators.required]],
    archivo_nombre:    [''],
    publicado:         [false],
    fecha_publicacion: [''],
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
        this.form.patchValue({ archivo_url: res.url, archivo_nombre: file.name });
        this.uploadingFile.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el archivo'));
        this.fileName.set(null);
        this.form.patchValue({ archivo_url: '', archivo_nombre: '' });
        this.uploadingFile.set(false);
        input.value = '';
      }
    });
  }

  removeFile(): void {
    this.fileName.set(null);
    this.form.patchValue({ archivo_url: '', archivo_nombre: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingFile()) return;

    this.submitting.set(true);
    const payload = {
      ...this.form.value,
      fecha_publicacion: this.form.value.fecha_publicacion || null,
    };

    this.documentoService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Documento publicado exitosamente');
        this.router.navigate(['/senefco/documentos-transparencia']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el documento'));
        this.submitting.set(false);
      }
    });
  }
}
