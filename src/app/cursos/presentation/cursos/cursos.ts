import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import * as XLSX from 'xlsx';
import { Pagination } from '../../../common/components/pagination/pagination';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { CursoService } from '../../application/services/curso.service';
import { ZoomService } from '../../application/services/zoom.service';
import { Curso, CursoListResponse } from '../../domain/models/curso.model';
import { ZoomMeeting, ZoomRecording } from '../../domain/models/zoom.model';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';

type ApiState =
  | { type: 'loading' }
  | { type: 'success'; response: CursoListResponse }
  | { type: 'error' };

type ZoomVista = 'reuniones' | 'grabaciones' | 'nueva';

const LOADING: ApiState = { type: 'loading' };
const ERROR:   ApiState = { type: 'error' };

@Component({
  selector: 'app-cursos',
  imports: [NgIcon, Pagination, PageTitle, RouterLink],
  templateUrl: './cursos.html',
  styles: ``
})
export class Cursos {
  private cursoService = inject(CursoService);
  private zoomService  = inject(ZoomService);
  private toast        = inject(ToastService);

  searchQuery    = signal('');
  pageIndex      = signal(1);
  pageSize       = signal(10);
  private refreshTrigger = signal(0);

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.cursoService.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  get cursos()    { const s = this.state(); return s.type === 'success' ? s.response.data : []; }
  get total()     { const s = this.state(); return s.type === 'success' ? s.response.total : 0; }
  get isLoading() { return this.state().type === 'loading'; }
  get error()     { return this.state().type === 'error'; }

  qrCurso   = signal<Curso | null>(null);
  qrDataUrl = signal<string | null>(null);

  async abrirQR(curso: Curso): Promise<void> {
    const base   = window.location.origin.replace('admin.', '').replace(':4200', '');
    const url    = curso.slug ? `${base}/programas/${curso.slug}` : `${base}/programas`;
    const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2, color: { dark: '#111827', light: '#ffffff' } });
    this.qrCurso.set(curso);
    this.qrDataUrl.set(dataUrl);
  }

  cerrarQR(): void {
    this.qrCurso.set(null);
    this.qrDataUrl.set(null);
  }

  descargarQR(): void {
    const url    = this.qrDataUrl();
    const nombre = this.qrCurso()?.nombre_programa ?? 'qr';
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  }

  sincronizandoId = signal<number | null>(null);

  sincronizarMoodle(curso: Curso): void {
    Swal.fire({
      title: '¿Crear en Moodle?',
      html: `Se creará el curso <b>${curso.nombre_programa}</b> en Moodle.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.sincronizandoId.set(curso.id_programa);
      this.cursoService.sincronizarMoodle(curso.id_programa).subscribe({
        next: (moodleCurso) => {
          this.sincronizandoId.set(null);
          this.toast.success('¡Creado en Moodle!', `Curso creado con ID ${moodleCurso.id}`);
        },
        error: () => {
          this.sincronizandoId.set(null);
          this.toast.error('Error', 'No se pudo crear el curso en Moodle');
        }
      });
    });
  }

  grabacionesModal    = signal(false);
  todasGrabaciones    = signal<ZoomRecording[]>([]);
  grabacionesCargando = signal(false);

  abrirTodasGrabaciones(): void {
    this.grabacionesModal.set(true);
    this.todasGrabaciones.set([]);
    this.grabacionesCargando.set(true);
    this.zoomService.grabaciones().subscribe({
      next: (res) => {
        this.todasGrabaciones.set(res.recordings);
        this.grabacionesCargando.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las grabaciones de Zoom');
        this.grabacionesCargando.set(false);
      }
    });
  }

  cerrarTodasGrabaciones(): void {
    this.grabacionesModal.set(false);
  }

  recargarGrabaciones(): void {
    this.todasGrabaciones.set([]);
    this.grabacionesCargando.set(true);
    this.zoomService.grabaciones().subscribe({
      next: (res) => {
        this.todasGrabaciones.set(res.recordings);
        this.grabacionesCargando.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las grabaciones');
        this.grabacionesCargando.set(false);
      }
    });
  }

  exportarCSV(): void {
    const rows = this.todasGrabaciones();
    if (!rows.length) return;

    const encabezados = ['Curso', 'Fecha', 'Duración (min)', 'Tipo', 'Tamaño (MB)', 'Link Play', 'Link Descarga'];
    const lineas = rows.map(r => [
      `"${(r.curso ?? '').replace(/"/g, '""')}"`,
      `"${r.fecha ?? ''}"`,
      r.duracion_min,
      r.tipo_archivo ?? '',
      r.tamanio_mb,
      r.link_play ?? '',
      r.link_descarga ?? '',
    ].join(','));

    const csv = '﻿' + encabezados.join(',') + '\n' + lineas.join('\n');
    this.descargarArchivo(csv, 'zoom_grabaciones.csv', 'text/csv;charset=utf-8;');
  }

  exportarExcel(): void {
    const rows = this.todasGrabaciones();
    if (!rows.length) return;

    const datos = rows.map(r => ({
      'Curso':           r.curso ?? '',
      'Fecha':           r.fecha ?? '',
      'Duración (min)':  r.duracion_min,
      'Tipo':            r.tipo_archivo ?? '',
      'Tamaño (MB)':     r.tamanio_mb,
      'Link Play':       r.link_play ?? '',
      'Link Descarga':   r.link_descarga ?? '',
    }));

    const hoja  = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Grabaciones');
    XLSX.writeFile(libro, 'zoom_grabaciones.xlsx');
  }

  private descargarArchivo(contenido: string, nombre: string, tipo: string): void {
    const blob = new Blob([contenido], { type: tipo });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  }

  zoomCurso      = signal<Curso | null>(null);
  zoomVista      = signal<ZoomVista>('reuniones');
  zoomReuniones  = signal<ZoomMeeting[]>([]);
  zoomGrabaciones = signal<ZoomRecording[]>([]);
  zoomCargando   = signal(false);
  zoomCreando    = signal(false);

  zoomTipo      = signal<'unica' | 'multisesion'>('unica');
  zoomTema      = signal('');
  zoomFecha     = signal('');
  zoomDuracion  = signal(60);
  zoomSesiones  = signal(2);
  zoomDias      = signal(7);

  abrirZoom(curso: Curso): void {
    this.zoomCurso.set(curso);
    this.zoomVista.set('reuniones');
    this.zoomTema.set(curso.nombre_programa);
    this.zoomTipo.set('unica');
    this.zoomFecha.set('');
    this.zoomReuniones.set([]);
    this.zoomGrabaciones.set([]);
    this.cargarReuniones();
  }

  cerrarZoom(): void {
    this.zoomCurso.set(null);
  }

  cambiarVistaZoom(vista: ZoomVista): void {
    this.zoomVista.set(vista);
    if (vista === 'grabaciones' && this.zoomGrabaciones().length === 0) {
      this.cargarGrabaciones();
    }
    if (vista === 'reuniones' && this.zoomReuniones().length === 0) {
      this.cargarReuniones();
    }
  }

  cargarReuniones(): void {
    this.zoomCargando.set(true);
    this.zoomService.listarReuniones().subscribe({
      next: (res) => {
        this.zoomReuniones.set(res.meetings);
        this.zoomCargando.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las reuniones de Zoom');
        this.zoomCargando.set(false);
      }
    });
  }

  cargarGrabaciones(): void {
    this.zoomCargando.set(true);
    this.zoomService.grabaciones().subscribe({
      next: (res) => {
        this.zoomGrabaciones.set(res.recordings);
        this.zoomCargando.set(false);
      },
      error: () => {
        this.toast.error('Error', 'No se pudieron cargar las grabaciones');
        this.zoomCargando.set(false);
      }
    });
  }

  crearReunionZoom(): void {
    if (!this.zoomFecha()) {
      this.toast.error('Formulario incompleto', 'Debes ingresar la fecha y hora de inicio');
      return;
    }

    this.zoomCreando.set(true);

    const payload = this.zoomTipo() === 'unica'
      ? {
          tipo: 'unica' as const,
          tema: this.zoomTema(),
          fecha_inicio: this.zoomFecha(),
          duracion_min: this.zoomDuracion(),
        }
      : {
          tipo: 'multisesion' as const,
          curso: this.zoomTema(),
          fecha_inicio: this.zoomFecha(),
          duracion_min: this.zoomDuracion(),
          n_sesiones: this.zoomSesiones(),
          dias_entre: this.zoomDias(),
        };

    this.zoomService.crearReunion(payload).subscribe({
      next: (res) => {
        this.zoomCreando.set(false);
        if (res.tipo === 'unica' && res.reunion) {
          this.toast.success('¡Reunión creada en Zoom!', `ID: ${res.reunion.id} | Contraseña: ${res.reunion.password}`);
        } else if (res.sesiones) {
          this.toast.success('¡Sesiones creadas en Zoom!', `${res.sesiones.length} sesiones programadas`);
        }
        this.zoomVista.set('reuniones');
        this.zoomReuniones.set([]);
        this.cargarReuniones();
      },
      error: () => {
        this.zoomCreando.set(false);
        this.toast.error('Error', 'No se pudo crear la reunión en Zoom');
      }
    });
  }

  formatFechaZoom(fecha: string): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-BO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(1);
  }

  onPageChange(page: number): void {
    this.pageIndex.set(page);
  }

  deleteCurso(id: number): void {
    Swal.fire({
      title: '¿Eliminar curso?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.cursoService.delete(id).subscribe({
          next: () => {
            this.toast.success('¡Eliminado!', 'El curso ha sido eliminado');
            this.refreshTrigger.update(n => n + 1);
          },
          error: () => this.toast.error('Error', 'No se pudo eliminar el curso')
        });
      }
    });
  }
}
