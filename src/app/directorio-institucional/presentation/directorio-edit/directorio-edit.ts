import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DirectorioService } from '../../application/services/directorio.service';
import { Secretaria } from '../../domain/models/directorio.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-directorio-edit',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './directorio-edit.html',
  styles: ``
})
export class DirectorioEdit implements OnInit {
  private directorioService = inject(DirectorioService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private fb                = inject(FormBuilder);
  private http              = inject(HttpClient);

  submitting    = signal(false);
  isLoading     = signal(true);
  uploadingFoto = signal(false);
  fotoPreview   = signal<string | null>(null);
  secretarias   = signal<Secretaria[]>([]);
  entryId       = signal<number>(0);

  form: FormGroup = this.fb.group({
    secretaria_id:     [null],
    nombre:            ['', [Validators.required, Validators.maxLength(150)]],
    descripcion:       [''],
    responsable:       ['', [Validators.maxLength(150)]],
    cargo_responsable: ['', [Validators.maxLength(150)]],
    telefono:          ['', [Validators.maxLength(30)]],
    telefono_interno:  ['', [Validators.maxLength(20)]],
    email:             ['', [Validators.email]],
    ubicacion:         ['', [Validators.maxLength(200)]],
    horario:           ['', [Validators.maxLength(200)]],
    foto_url:          [''],
    orden:             [0],
    activo:            [true],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.entryId.set(id);

    this.directorioService.getSecretarias().subscribe({
      next: (res) => this.secretarias.set(res.data),
    });

    this.directorioService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        if (data.foto_url) this.fotoPreview.set(data.foto_url);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la entrada'));
        this.isLoading.set(false);
      }
    });
  }

  onFotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingFoto.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        const path = res.url.replace(/^https?:\/\/[^/]+/, '');
        this.fotoPreview.set(path);
        this.form.patchValue({ foto_url: path });
        this.uploadingFoto.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
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
    this.submitting.set(true);
    this.directorioService.update(this.entryId(), this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizada!', 'Entrada actualizada exitosamente');
        this.router.navigate(['/senefco/directorio-institucional']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la entrada'));
        this.submitting.set(false);
      }
    });
  }
}
