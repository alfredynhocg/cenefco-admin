import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { RoleService } from '../../../roles/application/services/role.service';
import { PERMISOS_DISPONIBLES } from '../../../roles/domain/models/role.model';
import { PageTitle } from '../../../common/components/page-title/page-title';

@Component({
  selector: 'app-rol-create',
  imports: [FormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './rol-create.html',
  styles: ``
})
export class RolCreate {
  private service = inject(RoleService);
  private router  = inject(Router);

  readonly grupos = PERMISOS_DISPONIBLES;

  nombre      = '';
  descripcion = '';
  activo      = true;
  permisos    = new Set<string>();

  loading = signal(false);
  error   = signal('');

  tienePermiso(key: string): boolean {
    return this.permisos.has(key);
  }

  togglePermiso(key: string): void {
    if (this.permisos.has(key)) this.permisos.delete(key);
    else this.permisos.add(key);
  }

  toggleGrupo(keys: string[]): void {
    const todosSeleccionados = keys.every(k => this.permisos.has(k));
    if (todosSeleccionados) keys.forEach(k => this.permisos.delete(k));
    else keys.forEach(k => this.permisos.add(k));
  }

  grupoCompleto(keys: string[]): boolean {
    return keys.every(k => this.permisos.has(k));
  }

  grupoKeys(grupo: typeof PERMISOS_DISPONIBLES[0]): string[] {
    return grupo.permisos.map(p => p.key);
  }

  guardar(): void {
    if (!this.nombre.trim()) { this.error.set('El nombre del rol es requerido.'); return; }
    this.loading.set(true);
    this.error.set('');

    this.service.create({
      nombre:      this.nombre.trim(),
      descripcion: this.descripcion || null,
      activo:      this.activo,
      permisos:    Array.from(this.permisos),
    }).subscribe({
      next: () => this.router.navigate(['/senefco/roles']),
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.errors?.nombre?.[0] ?? err?.error?.message ?? 'Error al crear el rol.';
        this.error.set(msg);
      },
    });
  }
}
