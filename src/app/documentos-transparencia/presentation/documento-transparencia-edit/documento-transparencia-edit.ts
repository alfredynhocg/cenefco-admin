import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DocumentoTransparenciaService } from '../../application/services/documento-transparencia.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-documento-transparencia-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './documento-transparencia-edit.html',
  styles: ``
})
export class DocumentoTransparenciaEdit implements OnInit {
  private fb               = inject(FormBuilder);
  private documentoService = inject(DocumentoTransparenciaService);
  private toast            = inject(ToastService);
  private router           = inject(Router);
  private route            = inject(ActivatedRoute);
  private http             = inject(HttpClient);

  submitting    = signal(false);
  isLoading     = signal(true);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);
  documentoId   = signal<number>(0);

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

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.documentoId.set(id);

    this.documentoService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          ...data,
          fecha_publicacion: data.fecha_publicacion?.substring(0, 10) ?? '',
        });
        if (data.archivo_nombre) this.fileName.set(data.archivo_nombre);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el documento'));
        this.isLoading.set(false);
      }
    });
  }

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

    this.documentoService.update(this.documentoId(), payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Documento actualizado exitosamente');
        this.router.navigate(['/senefco/documentos-transparencia']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el documento'));
        this.submitting.set(false);
      }
    });
  }
}
