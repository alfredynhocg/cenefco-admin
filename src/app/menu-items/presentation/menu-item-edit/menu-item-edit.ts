import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuItemService } from '../../application/services/menu-item.service';
import { MenuService } from '../../../menus/application/services/menu.service';
import { MenuItem } from '../../domain/models/menu-item.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-menu-item-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './menu-item-edit.html',
  styles: ``
})
export class MenuItemEdit {
  private menuItemService = inject(MenuItemService);
  private menuService     = inject(MenuService);
  private toast           = inject(ToastService);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private fb              = inject(FormBuilder);

  submitting   = signal(false);
  loadingItem  = signal(true);
  itemId       = signal<number | null>(null);
  menuId       = signal<number | null>(null);
  menuNombre   = signal<string>('');
  siblings     = signal<MenuItem[]>([]);

  form: FormGroup = this.fb.group({
    etiqueta:           ['', [Validators.required, Validators.maxLength(150)]],
    url:                [''],
    parent_id:          [null],
    orden:              [0],
    icono:              [''],
    activo:             [true],
    abrir_nueva_ventana:[false],
  });

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemId.set(id);

    this.menuItemService.getById(id).subscribe({
      next: (item) => {
        this.menuId.set(item.menu_id);
        this.form.patchValue({
          etiqueta:            item.etiqueta,
          url:                 item.url ?? '',
          parent_id:           item.parent_id,
          orden:               item.orden,
          icono:               item.icono ?? '',
          activo:              item.activo,
          abrir_nueva_ventana: item.abrir_nueva_ventana,
        });
        this.loadingItem.set(false);

        this.menuService.getById(item.menu_id).subscribe({
          next: (menu) => this.menuNombre.set(menu.nombre),
          error: () => {}
        });
        this.menuItemService.getAll({ menu_id: item.menu_id, pageSize: 200 }).subscribe({
          next: (res) => this.siblings.set(res.data.filter(s => s.id !== id)),
          error: () => {}
        });
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el ítem'));
        this.loadingItem.set(false);
        this.router.navigate(['/senefco/menus']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const id     = this.itemId();
    const menuId = this.menuId();
    if (!id || !menuId) return;

    this.submitting.set(true);
    const val = this.form.value;
    this.menuItemService.update(id, {
      menu_id:             menuId,
      etiqueta:            val.etiqueta,
      url:                 val.url || null,
      parent_id:           val.parent_id ? Number(val.parent_id) : null,
      orden:               Number(val.orden) || 0,
      icono:               val.icono || null,
      activo:              val.activo,
      abrir_nueva_ventana: val.abrir_nueva_ventana,
    }).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Ítem actualizado exitosamente');
        this.router.navigate(['/senefco/menu-items', menuId]);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el ítem'));
        this.submitting.set(false);
      }
    });
  }
}
