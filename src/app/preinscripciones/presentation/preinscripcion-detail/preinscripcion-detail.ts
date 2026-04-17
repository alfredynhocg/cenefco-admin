import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe } from '@angular/common';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { PreinscripcionService } from '../../application/services/preinscripcion.service';
import { Preinscripcion } from '../../domain/models/preinscripcion.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-preinscripcion-detail',
  imports: [NgIcon, PageTitle, RouterLink, SlicePipe],
  templateUrl: './preinscripcion-detail.html',
  styles: ``
})
export class PreinscripcionDetail implements OnInit {
  private service = inject(PreinscripcionService);
  private toast   = inject(ToastService);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  loadingItem  = signal(true);
  item         = signal<Preinscripcion | null>(null);
  estadoForm   = signal('pendiente');
  submitting   = signal(false);

  private id!: number;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(this.id).subscribe({
      next: (data) => {
        this.item.set(data);
        this.estadoForm.set(data.estado);
        this.loadingItem.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la preinscripción'));
        this.router.navigate(['/senefco/preinscripciones']);
      }
    });
  }

  onEstadoChange(event: Event): void {
    this.estadoForm.set((event.target as HTMLSelectElement).value);
  }

  guardarEstado(): void {
    this.submitting.set(true);
    this.service.updateEstado(this.id, this.estadoForm()).subscribe({
      next: (updated) => {
        this.item.set(updated);
        this.toast.success('¡Actualizado!', 'El estado ha sido actualizado correctamente');
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el estado'));
        this.submitting.set(false);
      }
    });
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente:   'bg-warning/15 text-warning',
      revisado:    'bg-info/15 text-info',
      aceptado:    'bg-success/15 text-success',
      rechazado:   'bg-danger/15 text-danger',
      contactado:  'bg-purple-100 text-purple-700',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }
}
