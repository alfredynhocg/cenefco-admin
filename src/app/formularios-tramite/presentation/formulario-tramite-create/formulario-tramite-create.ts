import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { FormularioTramiteService } from '../../application/services/formulario-tramite.service';
import { TramiteOpcion } from '../../domain/models/formulario-tramite.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-formulario-tramite-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './formulario-tramite-create.html',
  styles: ``
})
export class FormularioTramiteCreate {
  private fb                = inject(FormBuilder);
  private formularioService = inject(FormularioTramiteService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private http              = inject(HttpClient);

  submitting    = signal(false);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);
  tramites      = signal<TramiteOpcion[]>([]);

  form: FormGroup = this.fb.group({
    tramite_id:    [null],
    titulo:        ['', [Validators.required, Validators.maxLength(250)]],
    descripcion:   [''],
    version:       ['', [Validators.maxLength(20)]],
    archivo_url:   ['', [Validators.required]],
    archivo_nombre:[''],
    orden:         [0],
    vigente:       [true],
    publicado:     [false],
  });

  constructor() {
    this.formularioService.getTramites().subscribe({
      next: (res) => this.tramites.set(res.data),
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
    this.formularioService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Formulario registrado exitosamente');
        this.router.navigate(['/senefco/formularios-tramite']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el formulario'));
        this.submitting.set(false);
      }
    });
  }
}
