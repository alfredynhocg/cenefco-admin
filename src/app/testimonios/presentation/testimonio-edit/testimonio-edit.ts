import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TestimonioService } from '../../application/services/testimonio.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-testimonio-edit', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './testimonio-edit.html' })
export class TestimonioEdit {
  private service = inject(TestimonioService);
  private toast   = inject(ToastService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private fb      = inject(FormBuilder);
  submitting = signal(false); loading = signal(true);
  id = Number(this.route.snapshot.paramMap.get('id'));

  form = this.fb.group({
    nombre:       ['', [Validators.required, Validators.maxLength(200)]],
    cargo:        [''], empresa: [''],
    testimonio:   ['', [Validators.required]],
    calificacion: [5, [Validators.min(1), Validators.max(5)]],
    foto_url: [''], foto_alt: [''],
    programa_id:  [null as number | null],
    destacado:    [false], orden: [0], estado: ['publicado'],
  });

  constructor() {
    this.service.getById(this.id).subscribe({
      next: (data) => { this.form.patchValue(data as any); this.loading.set(false); },
      error: () => { this.toast.error('Error', 'No se pudo cargar el testimonio'); this.router.navigate(['/senefco/testimonios']); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.update(this.id, this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Actualizado!', 'Testimonio actualizado'); this.router.navigate(['/senefco/testimonios']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar')); this.submitting.set(false); }
    });
  }
}
