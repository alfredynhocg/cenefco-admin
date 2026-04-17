import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { CategoriaProgramaService } from '../../application/services/categoria-programa.service';
import { CategoriaProgramaItem } from '../../domain/models/categoria-programa.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-categoria-programa-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './categoria-programa-edit.html',
  styles: ``
})
export class CategoriaProgramaEdit implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(CategoriaProgramaService);
  private toast   = inject(ToastService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  submitting = signal(false);
  loading    = signal(true);
  private id!: number;

  form = this.fb.group({
    nombre:           ['', [Validators.required, Validators.maxLength(200)]],
    slug:             [''],
    descripcion:      [''],
    icono:            [''],
    color:            [''],
    orden:            [0],
    activo:           [true],
    meta_titulo:      [''],
    meta_descripcion: [''],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(this.id).subscribe({
      next: (item) => {
        this.form.patchValue({
          nombre:           item.nombre,
          slug:             item.slug,
          descripcion:      item.descripcion ?? '',
          icono:            item.icono ?? '',
          color:            item.color ?? '',
          orden:            item.orden,
          activo:           item.activo,
          meta_titulo:      item.meta_titulo ?? '',
          meta_descripcion: item.meta_descripcion ?? '',
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la categoría'));
        this.router.navigate(['/senefco/categorias-programa']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.service.update(this.id, this.form.value as Partial<CategoriaProgramaItem>).subscribe({
      next: () => {
        this.toast.success('¡Actualizada!', 'Categoría actualizada correctamente');
        this.router.navigate(['/senefco/categorias-programa']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la categoría'));
        this.submitting.set(false);
      }
    });
  }
}
