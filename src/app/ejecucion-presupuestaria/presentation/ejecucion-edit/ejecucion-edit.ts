import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EjecucionPresupuestariaService } from '../../application/services/ejecucion-presupuestaria.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-ejecucion-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './ejecucion-edit.html',
  styles: ``
})
export class EjecucionEdit implements OnInit {
  private fb               = inject(FormBuilder);
  private ejecucionService = inject(EjecucionPresupuestariaService);
  private toast            = inject(ToastService);
  private router           = inject(Router);
  private route            = inject(ActivatedRoute);
  private http             = inject(HttpClient);

  submitting    = signal(false);
  isLoading     = signal(true);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);
  ejecucionId   = signal<number>(0);

  anioActual = new Date().getFullYear();
  anios      = Array.from({ length: 10 }, (_, i) => this.anioActual - i);

  periodos = [
    { value: 'mensual',    label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral',  label: 'Semestral' },
    { value: 'anual',      label: 'Anual' },
  ];

  meses = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' },    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },  { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
  ];

  form: FormGroup = this.fb.group({
    anio:                  [this.anioActual, [Validators.required]],
    periodo:               ['mensual',       [Validators.required]],
    mes:                   [null],
    trimestre:             [null],
    semestre:              [null],
    unidad_ejecutora:      ['', [Validators.required, Validators.maxLength(200)]],
    programa:              [''],
    fuente_financiamiento: [''],
    presupuesto_inicial:   [0, [Validators.required, Validators.min(0)]],
    presupuesto_vigente:   [0, [Validators.required, Validators.min(0)]],
    ejecutado:             [0, [Validators.required, Validators.min(0)]],
    descripcion:           [''],
    archivo_url:           [''],
    archivo_nombre:        [''],
    publicado:             [false],
  });

  get periodoActual(): string { return this.form.get('periodo')?.value ?? 'mensual'; }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ejecucionId.set(id);

    this.ejecucionService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        if (data.archivo_nombre) this.fileName.set(data.archivo_nombre);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el registro'));
        this.isLoading.set(false);
      }
    });
  }

  onPeriodoChange(): void {
    this.form.patchValue({ mes: null, trimestre: null, semestre: null });
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
    const v = this.form.value;
    const payload = {
      ...v,
      presupuesto_inicial: Number(v.presupuesto_inicial),
      presupuesto_vigente: Number(v.presupuesto_vigente),
      ejecutado:           Number(v.ejecutado),
    };

    this.ejecucionService.update(this.ejecucionId(), payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Registro actualizado exitosamente');
        this.router.navigate(['/senefco/ejecucion-presupuestaria']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el registro'));
        this.submitting.set(false);
      }
    });
  }
}
