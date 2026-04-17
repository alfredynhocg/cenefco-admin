import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { TramiteSolicitudService } from '../../application/services/tramite-solicitud.service';
import { TramiteSolicitud } from '../../domain/models/tramite-solicitud.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tramite-solicitud-detalle',
  standalone: true,
  imports: [NgIcon, RouterLink, PageTitle],
  templateUrl: './tramite-solicitud-detalle.html',
})
export class TramiteSolicitudDetalle implements OnInit {
  private service = inject(TramiteSolicitudService);
  private route   = inject(ActivatedRoute);
  private toast   = inject(ToastService);
  private cdr     = inject(ChangeDetectorRef);

  solicitud = signal<TramiteSolicitud | null>(null);
  isLoading = signal(true);
  saving    = signal(false);

  private get id(): number {
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() { this.cargar(); }

  cargar() {
    this.isLoading.set(true);
    this.service.getById(this.id).subscribe({
      next: (data) => {
        this.solicitud.set(data);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Error', 'No se pudo cargar la solicitud.');
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  async avanzar() {
    const sol = this.solicitud();
    if (!sol) return;

    const etapaActual = sol.etapas?.find(e => e.activa);
    const etapaSig    = sol.etapas?.find(e => e.orden === (etapaActual?.orden ?? 0) + 1);

    const { value: obs } = await Swal.fire({
      title: etapaSig
        ? `Avanzar a: "${etapaSig.nombre}"`
        : 'Completar trámite',
      input: 'textarea',
      inputLabel: 'Observación para el ciudadano (opcional)',
      inputPlaceholder: 'Ej: Documentos verificados correctamente...',
      showCancelButton: true,
      confirmButtonText: etapaSig ? 'Avanzar etapa' : 'Marcar como completado',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0ea5e9',
    });

    if (obs === undefined) return;

    this.saving.set(true);
    this.service.avanzar(sol.id, obs || undefined).subscribe({
      next: () => {
        this.toast.success('¡Etapa avanzada!', 'La solicitud fue actualizada.');
        this.cargar();
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.error('Error', err?.error?.message ?? 'No se pudo avanzar la etapa.');
        this.saving.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  async cancelar() {
    const sol = this.solicitud();
    if (!sol) return;

    const { value: motivo } = await Swal.fire({
      title: '¿Cancelar esta solicitud?',
      text: 'Esta acción no se puede deshacer.',
      input: 'textarea',
      inputLabel: 'Motivo de cancelación',
      inputPlaceholder: 'Describe el motivo...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar solicitud',
      cancelButtonText: 'No',
      confirmButtonColor: '#ef4444',
    });

    if (motivo === undefined) return;

    this.saving.set(true);
    this.service.cancelar(sol.id, motivo || undefined).subscribe({
      next: () => {
        this.toast.success('Solicitud cancelada', 'La solicitud fue cancelada.');
        this.cargar();
        this.saving.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudo cancelar la solicitud.');
        this.saving.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      en_proceso: 'bg-warning/15 text-warning',
      completado: 'bg-success/15 text-success',
      cancelado:  'bg-danger/15 text-danger',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  estadoLabel(estado: string): string {
    return { en_proceso: 'En proceso', completado: 'Completado', cancelado: 'Cancelado' }[estado] ?? estado;
  }

  progreso(sol: TramiteSolicitud): number {
    const total = sol.etapas?.length ?? 6;
    return Math.round((sol.etapa_actual / total) * 100);
  }

  formatFecha(iso: string): string {
    return iso.slice(0, 16).replace('T', ' ');
  }
}
