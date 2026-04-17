import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AudienciaPublicaService } from '../../application/services/audiencia-publica.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-audiencia-publica-edit',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './audiencia-publica-edit.html',
  styles: ``
})
export class AudienciaPublicaEdit {
  private audienciaService  = inject(AudienciaPublicaService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private fb                = inject(FormBuilder);
  private http              = inject(HttpClient);

  submitting        = signal(false);
  loadingAudiencia  = signal(true);
  uploadingAfiche   = signal(false);
  uploadingActa     = signal(false);
  uploadingImagen   = signal(false);

  afichePreview     = signal<string | null>(null);
  actaFileName      = signal<string | null>(null);
  imagenesUrls      = signal<string[]>([]);

  private id!: number;

  form: FormGroup = this.fb.group({
    titulo:       ['', [Validators.required, Validators.maxLength(300)]],
    descripcion:  [''],
    tipo:                    ['inicial'],
    estado:                  ['convocada'],
    afiche_url:              [''],
    acta_url:                [''],
    enlace_virtual:          [''],
    video_url:               [''],
    asistentes:              [null],
    activo:                  [true],
  });

  constructor() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.audienciaService.getAll({ pageSize: 1000 }).subscribe({
      next: (res) => {
        const audiencia = res.data.find(a => a.id === this.id);
        if (audiencia) {
          this.form.patchValue({
            titulo:       audiencia.titulo,
            descripcion:  audiencia.descripcion ?? '',
            tipo:                   audiencia.tipo,
            estado:                 audiencia.estado,
            afiche_url:             audiencia.afiche_url ?? '',
            acta_url:               audiencia.acta_url ?? '',
            enlace_virtual:         audiencia.enlace_virtual ?? '',
            video_url:              audiencia.video_url ?? '',
            asistentes:             audiencia.asistentes,
            activo:                 audiencia.activo ?? true,
          });
          if (audiencia.afiche_url) this.afichePreview.set(audiencia.afiche_url);
          if (audiencia.acta_url) {
            const parts = audiencia.acta_url.split('/');
            this.actaFileName.set(parts[parts.length - 1]);
          }
          this.imagenesUrls.set(audiencia.imagenes ?? []);
        } else {
          this.toast.error('Error', 'Audiencia no encontrada');
          this.router.navigate(['/senefco/audiencias-publicas']);
        }
        this.loadingAudiencia.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la audiencia pública'));
        this.loadingAudiencia.set(false);
        this.router.navigate(['/senefco/audiencias-publicas']);
      }
    });
  }

  onAficheSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingAfiche.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        const path = res.url.replace(/^https?:\/\/[^/]+/, '');
        this.afichePreview.set(path);
        this.form.patchValue({ afiche_url: path });
        this.uploadingAfiche.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el afiche'));
        this.uploadingAfiche.set(false);
        input.value = '';
      }
    });
  }

  removeAfiche(): void {
    this.afichePreview.set(null);
    this.form.patchValue({ afiche_url: '' });
  }

  onActaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingActa.set(true);
    this.actaFileName.set(file.name);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/file', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ acta_url: res.url });
        this.uploadingActa.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir el acta'));
        this.uploadingActa.set(false);
        input.value = '';
      }
    });
  }

  removeActa(): void {
    this.actaFileName.set(null);
    this.form.patchValue({ acta_url: '' });
  }

  onImagenSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      this.uploadingImagen.set(true);
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
        next: (res) => {
          const path = res.url.replace(/^https?:\/\/[^/]+/, '');
          this.imagenesUrls.update(urls => [...urls, path]);
          this.uploadingImagen.set(false);
        },
        error: (_err: HttpErrorResponse) => {
          this.toast.error('Error', `No se pudo subir ${file.name}`);
          this.uploadingImagen.set(false);
        }
      });
    });
    input.value = '';
  }

  removeImagen(url: string): void {
    this.imagenesUrls.update(urls => urls.filter(u => u !== url));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingAfiche() || this.uploadingActa() || this.uploadingImagen()) return;

    this.submitting.set(true);
    const raw = this.form.value;

    const payload = {
      ...raw,
      asistentes:  raw.asistentes ? Number(raw.asistentes) : null,
      afiche_url:             raw.afiche_url || null,
      acta_url:               raw.acta_url || null,
      enlace_virtual:         raw.enlace_virtual || null,
      video_url:              raw.video_url || null,
      descripcion:            raw.descripcion || null,
      imagenes:               this.imagenesUrls(),
    };

    this.audienciaService.update(this.id, payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizada!', 'Audiencia pública actualizada exitosamente');
        this.router.navigate(['/senefco/audiencias-publicas']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la audiencia pública'));
        this.submitting.set(false);
      }
    });
  }
}
