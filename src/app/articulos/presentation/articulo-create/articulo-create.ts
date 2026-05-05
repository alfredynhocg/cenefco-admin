import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ArticuloService } from '../../application/services/articulo.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-articulo-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './articulo-create.html' })
export class ArticuloCreate {
  private service = inject(ArticuloService); private toast = inject(ToastService);
  private router  = inject(Router); private fb = inject(FormBuilder);
  submitting = signal(false);
  private autoId = Math.floor(Date.now() / 1000);

  form = this.fb.group({
    id_art:    [this.autoId, [Validators.required]],
    num_art:   [this.autoId, [Validators.required]],
    titulo:    ['', [Validators.required, Validators.maxLength(200)]],
    autor:     [null as number | null],
    contenido: [''],
    id_cat_art:[null as number | null],
    estado:    [1],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Creado!', 'Artículo registrado'); this.router.navigate(['/senefco/articulos']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
