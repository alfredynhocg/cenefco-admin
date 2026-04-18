import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { WhatsappService } from '../../../whatsapp/application/services/whatsapp.service';
import { WhatsappAsesor, WhatsappMensaje } from '../../../whatsapp/domain/models/whatsapp.model';
import { AsesorService } from '../../../asesores/application/services/asesor.service';
import { Asesor } from '../../../asesores/domain/models/asesor.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';

@Component({
  selector: 'app-whatsapp-mensajes',
  imports: [DatePipe, RouterLink, NgIcon, FormsModule, PageTitle],
  templateUrl: './whatsapp-mensajes.html',
  styles: ``
})
export class WhatsappMensajes implements OnInit, OnDestroy {
  private service      = inject(WhatsappService);
  private asesorService = inject(AsesorService);
  private route        = inject(ActivatedRoute);
  private toast        = inject(ToastService);

  mensajes       = signal<WhatsappMensaje[]>([]);
  loading        = signal(true);
  enviando       = signal(false);
  atendiendo     = signal(false);
  conversacionId = 0;
  phone          = '';
  nombre         = '';
  estado         = '';
  textoNuevo     = '';
  archivoAdjunto: File | null = null;
  captionAdjunto = '';
  tipoAdjunto: 'image' | 'document' = 'image';

  asesor         = signal<WhatsappAsesor | null>(null);
  asesoresDisp   = signal<Asesor[]>([]);
  asesorSelId    = signal<number | null>(null);
  asignando      = signal(false);
  showAsesorPanel = signal(false);

  get esSoporte(): boolean { return this.estado === 'soporte'; }

  private intervalo: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.conversacionId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
    this.intervalo = setInterval(() => this.loadSilencioso(), 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  load(): void {
    this.loading.set(true);
    this.service.getMensajes(this.conversacionId).subscribe({
      next: res => {
        this.mensajes.set(res.data);
        this.phone  = res.phone;
        this.nombre = res.nombre ?? '';
        this.estado = res.estado;
        this.asesor.set(res.asesor ?? null);
        this.asesorSelId.set(res.asesor_id ?? null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private loadSilencioso(): void {
    this.service.getMensajes(this.conversacionId).subscribe({
      next: res => {
        this.mensajes.set(res.data);
        this.estado = res.estado;
        this.asesor.set(res.asesor ?? null);
        this.asesorSelId.set(res.asesor_id ?? null);
      },
    });
  }

  abrirPanelAsesor(): void {
    this.showAsesorPanel.set(true);
    if (this.asesoresDisp().length === 0) {
      this.asesorService.getAll({ activo: true, pageSize: 50 }).subscribe({
        next: res => this.asesoresDisp.set(res.data),
      });
    }
  }

  asignarAsesor(): void {
    const id = this.asesorSelId();
    if (!id) return;
    this.asignando.set(true);
    this.asesorService.asignarAConversacion(this.conversacionId, id).subscribe({
      next: asesor => {
        this.asesor.set(asesor as any);
        this.showAsesorPanel.set(false);
        this.asignando.set(false);
        this.toast.success('Asesor asignado', `${asesor.nombre} quedó asignado a esta conversación.`);
      },
      error: () => {
        this.toast.error('Error', 'No se pudo asignar el asesor.');
        this.asignando.set(false);
      },
    });
  }

  marcarAtendido(): void {
    this.atendiendo.set(true);
    this.service.marcarAtendido(this.conversacionId).subscribe({
      next: () => {
        this.estado = 'menu';
        this.atendiendo.set(false);
        this.toast.success('Atendido', 'La conversación fue marcada como atendida. El bot retoma el control.');
      },
      error: () => {
        this.toast.error('Error', 'No se pudo marcar como atendida.');
        this.atendiendo.set(false);
      },
    });
  }

  onEnter(event: Event): void {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }

  onArchivoSeleccionado(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.archivoAdjunto = file;
    if (file) {
      this.tipoAdjunto = file.type === 'application/pdf' ? 'document' : 'image';
    }
  }

  limpiarAdjunto(): void {
    this.archivoAdjunto = null;
    this.captionAdjunto = '';
  }

  enviar(): void {
    if (!this.phone) return;

    if (this.archivoAdjunto) {
      this.enviando.set(true);
      this.service.enviarMedia([this.phone], this.tipoAdjunto, this.archivoAdjunto, this.captionAdjunto).subscribe({
        next: () => {
          this.limpiarAdjunto();
          this.enviando.set(false);
          this.loadSilencioso();
        },
        error: () => {
          this.toast.error('Error', 'No se pudo enviar el archivo.');
          this.enviando.set(false);
        },
      });
      return;
    }

    const texto = this.textoNuevo.trim();
    if (!texto) return;

    this.enviando.set(true);
    this.service.enviar(this.phone, texto).subscribe({
      next: () => {
        this.textoNuevo = '';
        this.enviando.set(false);
        this.loadSilencioso();
      },
      error: () => {
        this.toast.error('Error', 'No se pudo enviar el mensaje.');
        this.enviando.set(false);
      },
    });
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      text:               'Texto',
      interactive:        'Interactivo',
      interactive_list:   'Lista',
      interactive_buttons:'Botones',
      template:           'Plantilla',
      image:              'Imagen',
      audio:              'Audio',
      video:              'Video',
      document:           'Documento',
      location:           'Ubicación',
    };
    return map[tipo] ?? tipo;
  }
}
