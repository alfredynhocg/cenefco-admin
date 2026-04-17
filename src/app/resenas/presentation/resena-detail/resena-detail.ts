import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ResenaService } from '../../application/services/resena.service';
import { Resena } from '../../domain/models/resena.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-resena-detail',
  imports: [NgIcon, PageTitle, RouterLink, SlicePipe, ReactiveFormsModule],
  templateUrl: './resena-detail.html',
  styles: ``
})
export class ResenaDetail implements OnInit {
  private service = inject(ResenaService);
  private toast   = inject(ToastService);
  private fb      = inject(FormBuilder);
  private route   = inject(ActivatedRoute);
  private router  = inject(Router);

  loading    = signal(true);
  item       = signal<Resena | null>(null);
  submitting = signal(false);

  estadoForm       = signal('pendiente');
  verificadoForm   = signal(false);
  destacadaForm    = signal(false);
  motivoRechazo    = signal('');

  private id!: number;

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(this.id).subscribe({
      next: (data) => {
        this.item.set(data);
        this.estadoForm.set(data.estado);
        this.verificadoForm.set(data.verificado);
        this.destacadaForm.set(data.destacada);
        this.motivoRechazo.set(data.motivo_rechazo ?? '');
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la reseña'));
        this.router.navigate(['/senefco/resenas']);
      }
    });
  }

  onEstadoChange(event: Event): void {
    this.estadoForm.set((event.target as HTMLSelectElement).value);
  }

  guardar(): void {
    this.submitting.set(true);
    this.service.update(this.id, {
      estado:         this.estadoForm(),
      verificado:     this.verificadoForm(),
      destacada:      this.destacadaForm(),
      motivo_rechazo: this.motivoRechazo() || null,
    }).subscribe({
      next: (updated) => {
        this.item.set(updated);
        this.toast.success('¡Actualizada!', 'Reseña actualizada correctamente');
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la reseña'));
        this.submitting.set(false);
      }
    });
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'bg-warning/15 text-warning',
      aprobado:  'bg-success/15 text-success',
      rechazado: 'bg-danger/15 text-danger',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  estrellas(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
