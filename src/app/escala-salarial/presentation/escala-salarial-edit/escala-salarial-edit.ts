import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EscalaSalarialService } from '../../application/services/escala-salarial.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-escala-salarial-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule, DecimalPipe],
  templateUrl: './escala-salarial-edit.html',
  styles: ``
})
export class EscalaSalarialEdit implements OnInit {
  private fb                    = inject(FormBuilder);
  private escalaSalarialService = inject(EscalaSalarialService);
  private toast                 = inject(ToastService);
  private router                = inject(Router);
  private route                 = inject(ActivatedRoute);

  submitting = signal(false);
  isLoading  = signal(true);
  itemId     = signal<number>(0);

  anioActual = new Date().getFullYear();
  anios      = Array.from({ length: 10 }, (_, i) => this.anioActual - i);

  form: FormGroup = this.fb.group({
    anio:            [this.anioActual, [Validators.required]],
    secretaria:      [''],
    cargo:           ['', [Validators.required, Validators.maxLength(200)]],
    nivel:           [''],
    categoria:       [''],
    salario_basico:  [0, [Validators.required, Validators.min(0)]],
    bono_antiguedad: [0, [Validators.min(0)]],
    bono_produccion: [0, [Validators.min(0)]],
    otros_bonos:     [0, [Validators.min(0)]],
    publicado:       [false],
  });

  get totalGanado(): number {
    const v = this.form.value;
    return (Number(v.salario_basico) || 0)
         + (Number(v.bono_antiguedad) || 0)
         + (Number(v.bono_produccion) || 0)
         + (Number(v.otros_bonos) || 0);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemId.set(id);

    this.escalaSalarialService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el registro'));
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);

    const v = this.form.value;
    const payload = {
      ...v,
      salario_basico:  Number(v.salario_basico),
      bono_antiguedad: Number(v.bono_antiguedad),
      bono_produccion: Number(v.bono_produccion),
      otros_bonos:     Number(v.otros_bonos),
    };

    this.escalaSalarialService.update(this.itemId(), payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Registro actualizado exitosamente');
        this.router.navigate(['/senefco/escala-salarial']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el registro'));
        this.submitting.set(false);
      }
    });
  }
}
