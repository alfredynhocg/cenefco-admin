import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DescuentoService } from '../../application/services/descuento.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-descuento-edit', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './descuento-edit.html' })
export class DescuentoEdit {
  private service = inject(DescuentoService); private toast = inject(ToastService);
  private router  = inject(Router); private route = inject(ActivatedRoute); private fb = inject(FormBuilder);
  submitting = signal(false); loading = signal(true);
  id = Number(this.route.snapshot.paramMap.get('id'));

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

  constructor() {
    this.service.getById(this.id).subscribe({
      next: (d) => { this.form.patchValue(d as any); this.loading.set(false); },
      error: () => { this.toast.error('Error', 'No se pudo cargar'); this.router.navigate(['/senefco/descuentos-promociones']); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.update(this.id, this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Actualizado!', 'Descuento actualizado'); this.router.navigate(['/senefco/descuentos-promociones']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar')); this.submitting.set(false); }
    });
  }
}
