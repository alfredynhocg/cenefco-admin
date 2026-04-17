import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { FormsModule } from '@angular/forms';
import { WhatsappService } from '../../../whatsapp/application/services/whatsapp.service';
import { WhatsappConversacion } from '../../../whatsapp/domain/models/whatsapp.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';

@Component({
  selector: 'app-whatsapp-conversaciones',
  imports: [DatePipe, RouterLink, NgIcon, FormsModule, PageTitle],
  templateUrl: './whatsapp-conversaciones.html',
  styles: ``
})
export class WhatsappConversaciones implements OnInit {
  private service = inject(WhatsappService);
  private toast   = inject(ToastService);

  conversaciones = signal<WhatsappConversacion[]>([]);
  total          = signal(0);
  loading        = signal(true);
  enviando       = signal(false);

  pageIndex    = 1;
  pageSize     = 15;
  query        = '';
  estadoFiltro = '';

  seleccionados = new Set<number>();
  mensajeEnvio  = '';
  archivoAdjunto: File | null = null;
  captionAdjunto = '';
  tipoAdjunto: 'image' | 'document' = 'image';

  readonly estados = [
    { value: '',                    label: 'Todos' },
    { value: 'soporte',             label: '🔴 Soporte' },
    { value: 'menu',                label: 'Menú' },
    { value: 'tramites_lista',      label: 'Trámites' },
    { value: 'tramite_detalle',     label: 'Detalle trámite' },
    { value: 'noticias',            label: 'Noticias' },
    { value: 'eventos',             label: 'Eventos' },
    { value: 'secretarias',         label: 'Secretarías' },
    { value: 'audiencias_publicas', label: 'Audiencias Públicas' },
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.seleccionados.clear();
    this.service.getConversaciones({
      pageIndex: this.pageIndex,
      pageSize:  this.pageSize,
      query:     this.query,
      estado:    this.estadoFiltro,
    }).subscribe({
      next: res => {
        this.conversaciones.set(res.data);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  search(): void { this.pageIndex = 1; this.load(); }

  changePage(page: number): void { this.pageIndex = page; this.load(); }

  get totalPages(): number {
    return Math.ceil(this.total() / this.pageSize);
  }

  toggleSeleccion(id: number): void {
    if (this.seleccionados.has(id)) {
      this.seleccionados.delete(id);
    } else {
      this.seleccionados.add(id);
    }
  }

  toggleTodos(): void {
    if (this.todosSeleccionados) {
      this.seleccionados.clear();
    } else {
      this.conversaciones().forEach(c => this.seleccionados.add(c.id));
    }
  }

  get todosSeleccionados(): boolean {
    const convs = this.conversaciones();
    return convs.length > 0 && convs.every(c => this.seleccionados.has(c.id));
  }

  get algunoSeleccionado(): boolean { return this.seleccionados.size > 0; }

  get phonesSeleccionados(): string[] {
    return this.conversaciones()
      .filter(c => this.seleccionados.has(c.id))
      .map(c => c.phone);
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.archivoAdjunto = file;
    if (file) {
      this.tipoAdjunto = file.type === 'application/pdf' ? 'document' : 'image';
    }
  }

  limpiarAdjunto(): void {
    this.archivoAdjunto = null;
    this.captionAdjunto = '';
  }

  enviarASeleccionados(): void {
    const phones = this.phonesSeleccionados;
    this.enviando.set(true);

    if (this.archivoAdjunto) {
      this.service.enviarMedia(phones, this.tipoAdjunto, this.archivoAdjunto, this.captionAdjunto).subscribe({
        next: (res) => { this.onEnvioOk(res.exitosos); this.limpiarAdjunto(); },
        error: () => { this.toast.error('Error', 'No se pudo enviar el archivo.'); this.enviando.set(false); },
      });
      return;
    }

    if (!this.mensajeEnvio.trim()) {
      this.toast.warning('Atención', 'Escribe un mensaje o adjunta un archivo.');
      this.enviando.set(false);
      return;
    }

    if (phones.length === 1) {
      this.service.enviar(phones[0], this.mensajeEnvio).subscribe({
        next: () => { this.onEnvioOk(1); },
        error: () => { this.toast.error('Error', 'No se pudo enviar el mensaje.'); this.enviando.set(false); },
      });
    } else {
      this.service.enviarMasivo(phones, this.mensajeEnvio).subscribe({
        next: (res) => { this.onEnvioOk(res.exitosos); },
        error: () => { this.toast.error('Error', 'No se pudo enviar el mensaje.'); this.enviando.set(false); },
      });
    }
  }

  private onEnvioOk(exitosos: number): void {
    this.toast.success('Enviado', `Mensaje enviado a ${exitosos} contacto(s).`);
    this.mensajeEnvio = '';
    this.seleccionados.clear();
    this.enviando.set(false);
  }

  badgeClass(estado: string): string {
    const map: Record<string, string> = {
      menu:               'bg-default-100 text-default-600',
      tramites_lista:     'bg-info/10 text-info',
      tramite_detalle:    'bg-info/10 text-info',
      noticias:           'bg-primary/10 text-primary',
      noticia_detalle:    'bg-primary/10 text-primary',
      eventos:            'bg-warning/10 text-warning',
      evento_detalle:     'bg-warning/10 text-warning',
      secretarias:        'bg-violet-100 text-violet-600',
      secretaria_detalle: 'bg-violet-100 text-violet-600',
      audiencias_publicas:'bg-teal-100 text-teal-600',
      soporte:            'bg-danger/15 text-danger font-semibold',
    };
    return map[estado] ?? 'bg-default-100 text-default-500';
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      menu:               'Menú',
      tramites_lista:     'Trámites',
      tramite_detalle:    'Trámite',
      noticias:           'Noticias',
      noticia_detalle:    'Noticia',
      eventos:            'Eventos',
      evento_detalle:     'Evento',
      secretarias:        'Secretarías',
      secretaria_detalle: 'Secretaría',
      audiencias_publicas:'Audiencias',
      soporte:            '🔴 Soporte',
    };
    return map[estado] ?? estado;
  }

  contextoResumen(ctx: Record<string, any> | null): string {
    if (!ctx) return '';
    if (ctx['tramite_id'])    return `Trámite #${ctx['tramite_id']}`;
    if (ctx['noticia_id'])    return `Noticia #${ctx['noticia_id']}`;
    if (ctx['evento_id'])     return `Evento #${ctx['evento_id']}`;
    if (ctx['secretaria_id']) return `Secretaría #${ctx['secretaria_id']}`;
    return '';
  }
}
