import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { DecretoMunicipalService } from '../../application/services/decreto-municipal.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-decreto-municipal-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './decreto-municipal-edit.html',
  styles: ``
})
export class DecretoMunicipalEdit implements OnInit {
  private fb             = inject(FormBuilder);
  private decretoService = inject(DecretoMunicipalService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private http           = inject(HttpClient);

  submitting    = signal(false);
  isLoading     = signal(true);
  uploadingFile = signal(false);
  fileName      = signal<string | null>(null);
  decretoId     = signal<number>(0);

  anioActual = new Date().getFullYear();
  anios = Array.from({ length: 10 }, (_, i) => this.anioActual - i);

  tipos = [
    { value: 'decreto',    label: 'Decreto Municipal' },
    { value: 'resolucion', label: 'Resolución Municipal' },
    { value: 'ordenanza',  label: 'Ordenanza Municipal' },
  ];

  form: FormGroup = this.fb.group({
    numero:             ['', [Validators.required, Validators.maxLength(50)]],
    tipo:               ['decreto', [Validators.required]],
    titulo:             ['', [Validators.required, Validators.maxLength(300)]],
    descripcion:        [''],
    pdf_url:            [''],
    pdf_nombre:         [''],
    estado:             ['borrador', [Validators.required]],
    fecha_promulgacion: [''],
    anio:               [this.anioActual, [Validators.required]],
    publicado_en_web:   [false],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.decretoId.set(id);

    this.decretoService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          numero:             data.numero,
          tipo:               data.tipo,
          titulo:             data.titulo,
          descripcion:        data.descripcion ?? '',
          pdf_url:            data.pdf_url ?? '',
          pdf_nombre:         data.pdf_nombre ?? '',
          estado:             data.estado,
          fecha_promulgacion: data.fecha_promulgacion ?? '',
          anio:               data.anio,
          publicado_en_web:   data.publicado_en_web,
        });
        if (data.pdf_nombre) this.fileName.set(data.pdf_nombre);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el decreto'));
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
      fecha_promulgacion: this.form.value.fecha_promulgacion || null,
    };

    this.decretoService.update(this.decretoId(), payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Decreto municipal actualizado exitosamente');
        this.router.navigate(['/senefco/decretos-municipales']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el decreto'));
        this.submitting.set(false);
      }
    });
  }
}
