import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuService } from '../../application/services/menu.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-menu-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './menu-create.html',
  styles: ``
})
export class MenuCreate {
  private menuService = inject(MenuService);
  private toast       = inject(ToastService);
  private router      = inject(Router);
  private fb          = inject(FormBuilder);

  submitting = signal(false);

  form: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.maxLength(80)]],
    descripcion: [''],
    activo:      [true],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    this.menuService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Menú registrado exitosamente');
        this.router.navigate(['/senefco/menus']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el menú'));
        this.submitting.set(false);
      }
    });
  }
}
