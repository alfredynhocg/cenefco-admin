import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { FormularioTramiteService } from '../../application/services/formulario-tramite.service';
import { TramiteOpcion } from '../../domain/models/formulario-tramite.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-formulario-tramite-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './formulario-tramite-edit.html',
  styles: ``
})
export class FormularioTramiteEdit implements OnInit {
  private fb                = inject(FormBuilder);
  private formularioService = inject(FormularioTramiteService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private http              = inject(HttpClient);

  submitting    = signal(false);
  isLoading     = signal(true);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);
  formularioId  = signal<number>(0);
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

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.formularioId.set(id);

    this.formularioService.getTramites().subscribe({
      next: (res) => this.tramites.set(res.data),
    });

    this.formularioService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        if (data.archivo_nombre) this.fileName.set(data.archivo_nombre);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el formulario'));
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
    this.formularioService.update(this.formularioId(), this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Formulario actualizado exitosamente');
        this.router.navigate(['/senefco/formularios-tramite']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el formulario'));
        this.submitting.set(false);
      }
    });
  }
}
