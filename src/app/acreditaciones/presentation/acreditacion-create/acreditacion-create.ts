import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AcreditacionService } from '../../application/services/acreditacion.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-acreditacion-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './acreditacion-create.html' })
export class AcreditacionCreate {
  private service = inject(AcreditacionService); private toast = inject(ToastService);
  private router  = inject(Router); private fb = inject(FormBuilder);
  submitting = signal(false);

  form = this.fb.group({
    nombre:            ['', [Validators.required, Validators.maxLength(300)]],
    entidad_otorgante: ['', [Validators.required, Validators.maxLength(200)]],
    tipo:              [''],
    descripcion:       [''],
    logo_url:          [''],
    logo_alt:          [''],
    url_verificacion:  [''],
    fecha_obtencion:   [''],
    fecha_vencimiento: [''],
    orden:             [0],
    activo:            [true],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Creada!', 'Acreditación registrada'); this.router.navigate(['/senefco/acreditaciones']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
