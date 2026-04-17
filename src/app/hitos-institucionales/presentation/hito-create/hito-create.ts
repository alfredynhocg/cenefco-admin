import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { HitoInstitucionalService } from '../../application/services/hito-institucional.service';
import { HitoInstitucional } from '../../domain/models/hito-institucional.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-hito-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './hito-create.html',
  styles: ``
})
export class HitoCreate {
  private fb      = inject(FormBuilder);
  private service = inject(HitoInstitucionalService);
  private toast   = inject(ToastService);
  private router  = inject(Router);

  submitting = signal(false);

  form = this.fb.group({
    anio:        ['', [Validators.required]],
    titulo:      ['', [Validators.required]],
    descripcion: [''],
    orden:       [0],
    activo:      [true],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.service.create(this.form.value as Partial<HitoInstitucional>).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Hito institucional creado correctamente');
        this.router.navigate(['/senefco/hitos-institucionales']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo crear el hito'));
        this.submitting.set(false);
      }
    });
  }
}
