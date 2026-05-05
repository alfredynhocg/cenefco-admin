import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { CartaGeneradaService } from '../../application/services/carta-generada.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-carta-generada-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './carta-generada-create.html' })
export class CartaGeneradaCreate {
  private service = inject(CartaGeneradaService); private toast = inject(ToastService);
  private router  = inject(Router); private fb = inject(FormBuilder);
  submitting = signal(false);
  private autoId = Math.floor(Date.now() / 1000);

  form = this.fb.group({
    id_cartagen:                  [this.autoId, [Validators.required]],
    num_carta:                    [this.autoId],
    id_us:                        [null as number | null],
    id_cartamod:                  [null as number | null],
    textocarta:                   [''],
    textocarta1:                  [''],
    textocarta3:                  [''],
    usar_encabezado_pie_estandar: [1],
    cp_nro_contrato:              [null as number | null],
    cp_gestion_contrato:          [''],
    estado:                       [1],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Generada!', 'Carta generada correctamente'); this.router.navigate(['/senefco/cartas-generadas']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
