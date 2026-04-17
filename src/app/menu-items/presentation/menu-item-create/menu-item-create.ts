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
  selector: 'app-menu-item-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './menu-item-create.html',
  styles: ``
})
export class MenuItemCreate {
  private menuItemService = inject(MenuItemService);
  private menuService     = inject(MenuService);
  private toast           = inject(ToastService);
  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private fb              = inject(FormBuilder);

  submitting  = signal(false);
  menuId      = signal<number>(Number(this.route.snapshot.paramMap.get('menuId')));
  menuNombre  = signal<string>('');
  siblings    = signal<MenuItem[]>([]);

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
    this.menuService.getById(this.menuId()).subscribe({
      next: (menu) => this.menuNombre.set(menu.nombre),
      error: () => {}
    });
    this.menuItemService.getAll({ menu_id: this.menuId(), pageSize: 200 }).subscribe({
      next: (res) => this.siblings.set(res.data),
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    const val = this.form.value;
    this.menuItemService.create({
      menu_id:             this.menuId(),
      etiqueta:            val.etiqueta,
      url:                 val.url || null,
      parent_id:           val.parent_id ? Number(val.parent_id) : null,
      orden:               Number(val.orden) || 0,
      icono:               val.icono || null,
      activo:              val.activo,
      abrir_nueva_ventana: val.abrir_nueva_ventana,
    }).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Ítem registrado exitosamente');
        this.router.navigate(['/senefco/menu-items', this.menuId()]);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el ítem'));
        this.submitting.set(false);
      }
    });
  }
}
