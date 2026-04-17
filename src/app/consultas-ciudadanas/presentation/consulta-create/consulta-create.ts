import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ConsultaCiudadanaService } from '../../application/services/consulta-ciudadana.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-consulta-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './consulta-create.html',
  styles: ``
})
export class ConsultaCreate {
  private fb              = inject(FormBuilder);
  private consultaService = inject(ConsultaCiudadanaService);
  private toast           = inject(ToastService);
  private router          = inject(Router);

  submitting = signal(false);

  form: FormGroup = this.fb.group({
    ciudadano_nombre:   ['', [Validators.required, Validators.maxLength(200)]],
    ciudadano_ci:       [''],
    ciudadano_email:    ['', [Validators.email]],
    ciudadano_telefono: [''],
    tipo:               ['consulta', [Validators.required]],
    asunto:             ['', [Validators.required, Validators.maxLength(300)]],
    descripcion:        ['', [Validators.required]],
    estado:             ['pendiente'],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.consultaService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Registrada!', 'Consulta ciudadana registrada exitosamente');
        this.router.navigate(['/senefco/consultas-ciudadanas']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la consulta'));
        this.submitting.set(false);
      }
    });
  }
}
