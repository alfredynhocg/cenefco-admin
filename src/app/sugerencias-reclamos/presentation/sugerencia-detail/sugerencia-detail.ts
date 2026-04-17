import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe, TitleCasePipe } from '@angular/common';
import { SugerenciaReclamoService } from '../../application/services/sugerencia-reclamo.service';
import { SugerenciaReclamo } from '../../domain/models/sugerencia-reclamo.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-sugerencia-detail',
  imports: [RouterLink, NgIcon, PageTitle, SlicePipe, TitleCasePipe],
  templateUrl: './sugerencia-detail.html',
  styles: ``
})
export class SugerenciaDetail implements OnInit {
  private sugerenciaService = inject(SugerenciaReclamoService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);

  loading    = signal(true);
  submitting = signal(false);
  sugerencia = signal<SugerenciaReclamo | null>(null);

  respuestaForm  = signal('');
  estadoForm     = signal('resuelto');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.sugerenciaService.getById(id).subscribe({
      next: (data) => {
        this.sugerencia.set(data);
        this.estadoForm.set(data.estado === 'pendiente' ? 'resuelto' : data.estado);
        if (data.respuesta) this.respuestaForm.set(data.respuesta);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la sugerencia'));
        this.router.navigate(['/senefco/sugerencias-reclamos']);
      }
    });
  }

  guardarRespuesta(): void {
    const sug = this.sugerencia();
    if (!sug) return;
    if (!this.respuestaForm().trim()) {
      this.toast.error('Error', 'La respuesta no puede estar vacía');
      return;
    }
    this.submitting.set(true);
    this.sugerenciaService.responder(sug.id, {
      respuesta: this.respuestaForm(),
      estado:    this.estadoForm(),
    }).subscribe({
      next: (updated) => {
        this.sugerencia.set(updated);
        this.toast.success('¡Guardado!', 'Respuesta enviada correctamente');
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar la respuesta'));
        this.submitting.set(false);
      }
    });
  }

  estadoClass(estado: string): string {
    switch (estado) {
      case 'pendiente':  return 'bg-warning/20 text-warning';
      case 'en_proceso': return 'bg-info/20 text-info';
      case 'resuelto':   return 'bg-success/20 text-success';
      case 'cerrado':    return 'bg-default-100 text-default-500';
      default:           return 'bg-default-100 text-default-500';
    }
  }
}
