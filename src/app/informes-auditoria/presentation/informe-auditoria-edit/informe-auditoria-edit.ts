import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { InformeAuditoriaService } from '../../application/services/informe-auditoria.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-informe-auditoria-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './informe-auditoria-edit.html',
  styles: ``
})
export class InformeAuditoriaEdit implements OnInit {
  private fb             = inject(FormBuilder);
  private informeService = inject(InformeAuditoriaService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private http           = inject(HttpClient);

  submitting    = signal(false);
  isLoading     = signal(true);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);
  informeId     = signal<number>(0);

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

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.informeId.set(id);

    this.informeService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          nombre:           data.nombre,
          descripcion:      data.descripcion ?? '',
          pdf_url:          data.pdf_url ?? '',
          pdf_nombre:       data.pdf_nombre ?? '',
          estado:           data.estado,
          fecha:            data.fecha ?? '',
          anio:             data.anio,
          publicado_en_web: data.publicado_en_web,
        });
        if (data.pdf_nombre) this.fileName.set(data.pdf_nombre);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el informe'));
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
        this.form.patchValue({ pdf_url: res.url, pdf_nombre: file.name });
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

    this.informeService.update(this.informeId(), payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Informe de auditoría actualizado exitosamente');
        this.router.navigate(['/senefco/informes-auditoria']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el informe'));
        this.submitting.set(false);
      }
    });
  }
}
