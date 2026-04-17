import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { HimnoService } from '../../application/services/himno.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-himno-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './himno-create.html',
  styles: ``
})
export class HimnoCreate {
  private fb           = inject(FormBuilder);
  private himnoService = inject(HimnoService);
  private toast        = inject(ToastService);
  private router       = inject(Router);
  private http         = inject(HttpClient);

  submitting      = signal(false);
  uploadingAudio  = signal(false);
  uploadingPartitura = signal(false);
  uploadingImagen = signal(false);
  audioFileName   = signal<string | null>(null);
  partituraFileName = signal<string | null>(null);

  tipos = [
    { value: 'municipal',     label: 'Municipal'     },
    { value: 'departamental', label: 'Departamental' },
    { value: 'nacional',      label: 'Nacional'      },
    { value: 'otro',          label: 'Otro'           },
  ];

  form: FormGroup = this.fb.group({
    tipo:          ['municipal', [Validators.required]],
    titulo:        ['', [Validators.required, Validators.maxLength(250)]],
    letra:         [''],
    autor_letra:   ['', [Validators.maxLength(150)]],
    autor_musica:  ['', [Validators.maxLength(150)]],
    audio_url:     [''],
    partitura_url: [''],
    imagen_url:    [''],
    descripcion:   [''],
    orden:         [0],
    activo:        [true],
  });

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingAudio.set(true);
    this.audioFileName.set(file.name);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/file', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ audio_url: res.url });
        this.uploadingAudio.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el audio'));
        this.audioFileName.set(null);
        this.form.patchValue({ audio_url: '' });
        this.uploadingAudio.set(false);
        input.value = '';
      }
    });
  }

  removeAudio(): void {
    this.audioFileName.set(null);
    this.form.patchValue({ audio_url: '' });
  }

  onPartituraSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingPartitura.set(true);
    this.partituraFileName.set(file.name);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/file', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ partitura_url: res.url });
        this.uploadingPartitura.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la partitura'));
        this.partituraFileName.set(null);
        this.form.patchValue({ partitura_url: '' });
        this.uploadingPartitura.set(false);
        input.value = '';
      }
    });
  }

  removePartitura(): void {
    this.partituraFileName.set(null);
    this.form.patchValue({ partitura_url: '' });
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
    if (this.uploadingAudio() || this.uploadingPartitura() || this.uploadingImagen()) return;

    this.submitting.set(true);
    this.himnoService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Himno registrado exitosamente');
        this.router.navigate(['/senefco/himnos']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el himno'));
        this.submitting.set(false);
      }
    });
  }
}
