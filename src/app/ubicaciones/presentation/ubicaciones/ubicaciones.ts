import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { UbicacionService } from '../../application/services/ubicacion.service';
import { Ubicacion } from '../../domain/models/ubicacion.model';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-ubicaciones',
  standalone: true,
  imports: [NgIcon, PageTitle],
  templateUrl: './ubicaciones.html',
})
export class Ubicaciones implements OnInit {
  private ubicacionService = inject(UbicacionService);
  private toast            = inject(ToastService);
  private cdr              = inject(ChangeDetectorRef);

  ubicaciones = signal<Ubicacion[]>([]);
  loading     = signal(true);
  saving      = signal(false);
  nuevoNombre = signal('');
  deletingId  = signal<number | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.ubicacionService.getAll().subscribe({
      next: (data) => {
        this.ubicaciones.set(data);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudieron cargar las ubicaciones.'));
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  onNuevoNombre(event: Event): void {
    this.nuevoNombre.set((event.target as HTMLInputElement).value);
  }

  agregarUbicacion(): void {
    const nombre = this.nuevoNombre().trim();
    if (!nombre) return;
    this.saving.set(true);
    this.ubicacionService.create({ nombre, activo: true }).subscribe({
      next: () => {
        this.toast.success('Ubicación creada', `"${nombre}" fue agregada correctamente.`);
        this.nuevoNombre.set('');
        this.saving.set(false);
        this.load();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo crear la ubicación.'));
        this.saving.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  toggleActivo(ubicacion: Ubicacion): void {
    this.ubicacionService.update(ubicacion.id, { activo: !ubicacion.activo }).subscribe({
      next: () => {
        this.toast.success('Actualizada', `Ubicación ${!ubicacion.activo ? 'activada' : 'desactivada'}.`);
        this.load();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la ubicación.'));
        this.cdr.detectChanges();
      }
    });
  }

  confirmarEliminar(ubicacion: Ubicacion): void {
    this.deletingId.set(ubicacion.id);
    this.cdr.detectChanges();
  }

  cancelarEliminar(): void {
    this.deletingId.set(null);
    this.cdr.detectChanges();
  }

  eliminarUbicacion(id: number): void {
    this.ubicacionService.delete(id).subscribe({
      next: () => {
        this.toast.success('Eliminada', 'La ubicación fue eliminada.');
        this.deletingId.set(null);
        this.load();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo eliminar la ubicación.'));
        this.deletingId.set(null);
        this.cdr.detectChanges();
      }
    });
  }
}
