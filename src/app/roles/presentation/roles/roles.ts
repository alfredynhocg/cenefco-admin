import { ChangeDetectorRef, Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { RoleService } from '../../../roles/application/services/role.service';
import { Role, PERMISOS_DISPONIBLES } from '../../../roles/domain/models/role.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { extractErrorMessage } from '../../../utils/http-error';

const MODULO_COLORS: Record<string, string> = {
  Ventas:     'bg-blue-100 text-blue-700',
  Caja:       'bg-emerald-100 text-emerald-700',
  Inventario: 'bg-orange-100 text-orange-700',
  Compras:    'bg-purple-100 text-purple-700',
  Usuarios:   'bg-rose-100 text-rose-700',
  Reportes:   'bg-amber-100 text-amber-700',
};

@Component({
  selector: 'app-roles',
  imports: [RouterLink, NgIcon, PageTitle],
  templateUrl: './roles.html',
  styles: ``
})
export class Roles implements OnInit {
  private service = inject(RoleService);
  private cdr     = inject(ChangeDetectorRef);

  roles    = signal<Role[]>([]);
  loading  = signal(true);
  deleting = signal<number | null>(null);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: data => { this.roles.set(data); this.loading.set(false); this.cdr.detectChanges(); },
      error: ()   => { this.loading.set(false); this.cdr.detectChanges(); },
    });
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este rol? Esta acción no se puede deshacer.')) return;
    this.deleting.set(id);
    this.service.delete(id).subscribe({
      next: () => { this.deleting.set(null); this.roles.update(l => l.filter(r => r.id !== id)); },
      error: () => this.deleting.set(null),
    });
  }

  permisosAgrupados(permisos: string[]): { modulo: string; icon: string; color: string; labels: string[] }[] {
    if (permisos.includes('*')) return [];
    return PERMISOS_DISPONIBLES
      .map(g => ({
        modulo: g.modulo,
        icon:   g.icon,
        color:  MODULO_COLORS[g.modulo] ?? 'bg-default-100 text-default-600',
        labels: g.permisos.filter(p => permisos.includes(p.key)).map(p => p.label),
      }))
      .filter(g => g.labels.length > 0);
  }
}
