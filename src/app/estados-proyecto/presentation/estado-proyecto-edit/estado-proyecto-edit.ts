import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EstadoProyectoService } from '../../application/services/estado-proyecto.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-estado-proyecto-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './estado-proyecto-edit.html',
  styles: ``
})
export class EstadoProyectoEdit implements OnInit {
  private fb              = inject(FormBuilder);
  private proyectoService = inject(EstadoProyectoService);
  private toast           = inject(ToastService);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private http            = inject(HttpClient);

  submitting   = signal(false);
  isLoading    = signal(true);
  uploadingImg = signal(false);
  imgPreview   = signal<string | null>(null);
  proyectoId   = signal<number>(0);

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

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.proyectoId.set(id);

    this.proyectoService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          ...data,
          fecha_inicio:       data.fecha_inicio?.substring(0, 10)       ?? '',
          fecha_fin_estimada: data.fecha_fin_estimada?.substring(0, 10) ?? '',
          fecha_fin_real:     data.fecha_fin_real?.substring(0, 10)     ?? '',
        });
        if (data.imagen_url) this.imgPreview.set(data.imagen_url);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el proyecto'));
        this.isLoading.set(false);
      }
    });
  }

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
      presupuesto:        Number(v.presupuesto),
      porcentaje_avance:  Number(v.porcentaje_avance),
      fecha_inicio:       v.fecha_inicio       || null,
      fecha_fin_estimada: v.fecha_fin_estimada || null,
      fecha_fin_real:     v.fecha_fin_real     || null,
    };

    this.proyectoService.update(this.proyectoId(), payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Proyecto actualizado exitosamente');
        this.router.navigate(['/senefco/estados-proyecto']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el proyecto'));
        this.submitting.set(false);
      }
    });
  }
}
