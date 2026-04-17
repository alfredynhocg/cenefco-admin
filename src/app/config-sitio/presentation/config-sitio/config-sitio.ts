import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ConfigSitioService } from '../../application/services/config-sitio.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-config-sitio',
  imports: [NgIcon, PageTitle, ReactiveFormsModule],
  templateUrl: './config-sitio.html',
  styles: ``
})
export class ConfigSitio implements OnInit {
  private fb               = inject(FormBuilder);
  private configSitioService = inject(ConfigSitioService);
  private toast            = inject(ToastService);
  private http             = inject(HttpClient);

  loading          = signal(true);
  saving           = signal(false);
  uploadingLogo    = signal(false);
  uploadingFavicon = signal(false);
  logoPreview      = signal<string | null>(null);
  faviconPreview   = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    nombre:              ['', [Validators.required, Validators.maxLength(200)]],
    slogan:              [''],
    descripcion:         [''],
    logo_url:            [''],
    favicon_url:         [''],
    email_contacto:      ['', [Validators.email]],
    telefono:            [''],
    direccion:           [''],
    ciudad:              [''],
    pais:                ['Bolivia'],
    latitud:             [null],
    longitud:            [null],
    horario_atencion:    [''],
    meta_titulo:         [''],
    meta_descripcion:    [''],
    meta_keywords:       [''],
    google_analytics_id: [''],
    activo:              [true],
  });

  ngOnInit(): void {
    this.configSitioService.get().subscribe({
      next: (data) => {
        this.form.patchValue({
          nombre:              data.nombre,
          slogan:              data.slogan ?? '',
          descripcion:         data.descripcion ?? '',
          logo_url:            data.logo_url ?? '',
          favicon_url:         data.favicon_url ?? '',
          email_contacto:      data.email_contacto ?? '',
          telefono:            data.telefono ?? '',
          direccion:           data.direccion ?? '',
          ciudad:              data.ciudad ?? '',
          pais:                data.pais ?? 'Bolivia',
          latitud:             data.latitud ?? null,
          longitud:            data.longitud ?? null,
          horario_atencion:    data.horario_atencion ?? '',
          meta_titulo:         data.meta_titulo ?? '',
          meta_descripcion:    data.meta_descripcion ?? '',
          meta_keywords:       data.meta_keywords ?? '',
          google_analytics_id: data.google_analytics_id ?? '',
          activo:              data.activo,
        });
        if (data.logo_url)    this.logoPreview.set(data.logo_url);
        if (data.favicon_url) this.faviconPreview.set(data.favicon_url);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la configuración del sitio'));
        this.loading.set(false);
      }
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.logoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploadingLogo.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ logo_url: res.url });
        this.uploadingLogo.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el logo'));
        this.logoPreview.set(this.form.get('logo_url')?.value || null);
        this.uploadingLogo.set(false);
        input.value = '';
      }
    });
  }

  onFaviconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.faviconPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploadingFavicon.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ favicon_url: res.url });
        this.uploadingFavicon.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el favicon'));
        this.faviconPreview.set(this.form.get('favicon_url')?.value || null);
        this.uploadingFavicon.set(false);
        input.value = '';
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingLogo() || this.uploadingFavicon()) return;

    this.saving.set(true);
    this.configSitioService.update(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Guardado!', 'Configuración del sitio actualizada correctamente');
        this.saving.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la configuración'));
        this.saving.set(false);
      }
    });
  }
}
