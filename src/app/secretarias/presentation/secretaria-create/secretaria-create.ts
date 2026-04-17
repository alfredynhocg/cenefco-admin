import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SecretariaService } from '../../application/services/secretaria.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-secretaria-create',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './secretaria-create.html',
  styles: ``
})
export class SecretariaCreate {
  private secretariaService = inject(SecretariaService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private fb                = inject(FormBuilder);

  submitting = signal(false);

  form: FormGroup = this.fb.group({
    nombre:            ['', [Validators.required, Validators.maxLength(200)]],
    sigla:             ['', [Validators.maxLength(200)]],
    atribuciones:      [''],
    direccion_fisica:  ['', [Validators.maxLength(200)]],
    telefono:          ['', [Validators.maxLength(50)]],
    email:             ['', [Validators.email, Validators.maxLength(150)]],
    horario_atencion:  ['', [Validators.maxLength(50)]],
    foto_titular_url:  ['', [Validators.maxLength(255)]],
    orden_organigrama: [0],
    activa:            [true],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.secretariaService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Creada!', 'Secretaría registrada exitosamente');
        this.router.navigate(['/senefco/secretarias']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la secretaría'));
        this.submitting.set(false);
      }
    });
  }
}
