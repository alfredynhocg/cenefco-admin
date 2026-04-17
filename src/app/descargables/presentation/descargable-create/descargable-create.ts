import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DescargableService } from '../../application/services/descargable.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-descargable-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './descargable-create.html' })
export class DescargableCreate {
  private service = inject(DescargableService); private toast = inject(ToastService);
  private router  = inject(Router); private fb = inject(FormBuilder);
  submitting = signal(false);

  form = this.fb.group({
    nombre:             ['', [Validators.required, Validators.maxLength(300)]],
    tipo:               [''],
    archivo_url:        ['', [Validators.required]],
    imagen_portada_url: [''],
    programa_id:        [null as number | null],
    requiere_datos:     [true],
    orden:              [0],
    activo:             [true],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Creado!', 'Descargable registrado'); this.router.navigate(['/senefco/descargables']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
