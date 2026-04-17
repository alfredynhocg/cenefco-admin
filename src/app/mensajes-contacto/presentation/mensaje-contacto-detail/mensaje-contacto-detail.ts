import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { MensajeContactoService } from '../../application/services/mensaje-contacto.service';
import { MensajeContacto } from '../../domain/models/mensaje-contacto.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';

@Component({
  selector: 'app-mensaje-contacto-detail',
  standalone: true,
  imports: [NgIcon, FormsModule, PageTitle, RouterLink, SlicePipe],
  templateUrl: './mensaje-contacto-detail.html',
})
export class MensajeContactoDetail {
  private service = inject(MensajeContactoService);
  private toast   = inject(ToastService);
  private route   = inject(ActivatedRoute);
  private cdr     = inject(ChangeDetectorRef);

  mensaje  = signal<MensajeContacto | null>(null);
  loading  = signal(true);
  saving   = signal(false);
  respuesta = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe({
      next: (data) => {
        this.mensaje.set(data);
        if (data.respuesta) this.respuesta.set(data.respuesta);
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Error', 'No se pudo cargar el mensaje');
        this.loading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente:   'bg-warning/15 text-warning',
      respondido:  'bg-success/15 text-success',
      archivado:   'bg-default-200 text-default-500',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  onSubmit(): void {
    const m = this.mensaje();
    if (!m || !this.respuesta().trim()) return;

    this.saving.set(true);
    this.service.responder(m.id, { respuesta: this.respuesta(), estado: 'respondido' }).subscribe({
      next: (updated) => {
        this.mensaje.set(updated);
        this.toast.success('Respondido', 'La respuesta fue enviada correctamente');
        this.saving.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Error', 'No se pudo enviar la respuesta');
        this.saving.set(false);
        this.cdr.detectChanges();
      }
    });
  }
}
