import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SubcenefcoService } from '../../application/services/subcenefco.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-subcenefco-create',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './subcenefco-create.html',
  styles: ``
})
export class SubcenefcoCreate {
  private subcenefcoService = inject(SubcenefcoService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private fb                = inject(FormBuilder);

  submitting = signal(false);

  form: FormGroup = this.fb.group({
    nombre:               ['', [Validators.required, Validators.maxLength(200)]],
    zona_cobertura:       [''],
    direccion_fisica:     [''],
    telefono:             [''],
    email:                ['', [Validators.email]],
    imagen_url:           [''],
    latitud:              [null],
    longitud:             [null],
    tramites_disponibles: [''],
    activa:               [true],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.subcenefcoService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'SubCENEFCO registrado exitosamente');
        this.router.navigate(['/senefco/subcenefcos']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el SubCENEFCO'));
        this.submitting.set(false);
      }
    });
  }
}
