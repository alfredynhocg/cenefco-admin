import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuService } from '../../application/services/menu.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-menu-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './menu-edit.html',
  styles: ``
})
export class MenuEdit {
  private menuService = inject(MenuService);
  private toast       = inject(ToastService);
  private router      = inject(Router);
  private route       = inject(ActivatedRoute);
  private fb          = inject(FormBuilder);

  submitting   = signal(false);
  loadingMenu  = signal(true);
  menuId       = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.maxLength(80)]],
    descripcion: [''],
    activo:      [true],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.menuId.set(id);

    this.menuService.getById(id).subscribe({
      next: (menu) => {
        this.form.patchValue({
          nombre:      menu.nombre,
          descripcion: menu.descripcion ?? '',
          activo:      menu.activo,
        });
        this.loadingMenu.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el menú'));
        this.loadingMenu.set(false);
        this.router.navigate(['/senefco/menus']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const id = this.menuId();
    if (!id) return;

    this.submitting.set(true);
    this.menuService.update(id, this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Menú actualizado exitosamente');
        this.router.navigate(['/senefco/menus']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el menú'));
        this.submitting.set(false);
      }
    });
  }
}
