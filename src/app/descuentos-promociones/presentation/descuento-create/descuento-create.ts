import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DescuentoService } from '../../application/services/descuento.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-descuento-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './descuento-create.html' })
export class DescuentoCreate {
  private service = inject(DescuentoService); private toast = inject(ToastService);
  private router  = inject(Router); private fb = inject(FormBuilder);
  submitting = signal(false);

  form = this.fb.group({
    codigo:          ['', [Validators.required]],
    nombre:          ['', [Validators.required]],
    descripcion:     [''],
    tipo_descuento:  ['porcentaje'],
    valor:           [0, [Validators.required, Validators.min(0)]],
    monto_minimo:    [null as number | null],
    usos_maximos:    [null as number | null],
    usos_por_usuario:[1],
    programa_id:     [null as number | null],
    activo:          [true],
    fecha_inicio:    [''],
    fecha_fin:       [''],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Creado!', 'Descuento registrado'); this.router.navigate(['/senefco/descuentos-promociones']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
