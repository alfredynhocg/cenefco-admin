import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EstadoProyectoService } from '../../application/services/estado-proyecto.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-estado-proyecto-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './estado-proyecto-create.html',
  styles: ``
})
export class EstadoProyectoCreate {
  private fb              = inject(FormBuilder);
  private proyectoService = inject(EstadoProyectoService);
  private toast           = inject(ToastService);
  private router          = inject(Router);
  private http            = inject(HttpClient);

  submitting   = signal(false);
  uploadingImg = signal(false);
  imgPreview   = signal<string | null>(null);

  estados = [
    { value: 'planificacion', label: 'Planificación' },
    { value: 'en_ejecucion',  label: 'En Ejecución'  },
    { value: 'paralizado',    label: 'Paralizado'     },
    { value: 'concluido',     label: 'Concluido'      },
    { value: 'cancelado',     label: 'Cancelado'      },
  ];

  form: FormGroup = this.fb.group({
    nombre:             ['', [Validators.required, Validators.maxLength(250)]],
    descripcion:        [''],
    secretaria:         [''],
    categoria:          [''],
    ubicacion:          [''],
    presupuesto:        [0, [Validators.min(0)]],
    estado:             ['planificacion', [Validators.required]],
    porcentaje_avance:  [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    fecha_inicio:       [''],
    fecha_fin_estimada: [''],
    fecha_fin_real:     [''],
    imagen_url:         [''],
    publicado:          [false],
  });

  onImgSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.imgPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploadingImg.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ imagen_url: res.url });
        this.uploadingImg.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
        this.imgPreview.set(null);
        this.uploadingImg.set(false);
        input.value = '';
      }
    });
  }

  removeImg(): void {
    this.imgPreview.set(null);
    this.form.patchValue({ imagen_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg()) return;

    this.submitting.set(true);
    const v = this.form.value;
    const payload = {
      ...v,
      presupuesto:       Number(v.presupuesto),
      porcentaje_avance: Number(v.porcentaje_avance),
      fecha_inicio:       v.fecha_inicio       || null,
      fecha_fin_estimada: v.fecha_fin_estimada || null,
      fecha_fin_real:     v.fecha_fin_real     || null,
    };

    this.proyectoService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Proyecto registrado exitosamente');
        this.router.navigate(['/senefco/estados-proyecto']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el proyecto'));
        this.submitting.set(false);
      }
    });
  }
}
