import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TestimonioService } from '../../application/services/testimonio.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-testimonio-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './testimonio-create.html' })
export class TestimonioCreate {
  private service = inject(TestimonioService);
  private toast   = inject(ToastService);
  private router  = inject(Router);
  private fb      = inject(FormBuilder);
  submitting = signal(false);

  form = this.fb.group({
    nombre:       ['', [Validators.required, Validators.maxLength(200)]],
    cargo:        [''],
    empresa:      [''],
    testimonio:   ['', [Validators.required]],
    calificacion: [5, [Validators.min(1), Validators.max(5)]],
    foto_url:     [''],
    foto_alt:     [''],
    programa_id:  [null as number | null],
    destacado:    [false],
    orden:        [0],
    estado:       ['publicado'],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Creado!', 'Testimonio registrado'); this.router.navigate(['/senefco/testimonios']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
