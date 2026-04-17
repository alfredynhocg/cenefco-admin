import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { EventoService } from '../../application/services/evento.service';
import { TipoEvento } from '../../domain/models/evento.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-evento-edit',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './evento-edit.html',
  styles: ``
})
export class EventoEdit {
  private eventoService = inject(EventoService);
  private toast         = inject(ToastService);
  private router        = inject(Router);
  private route         = inject(ActivatedRoute);
  private fb            = inject(FormBuilder);

  submitting  = signal(false);
  loadingEvento = signal(true);
  tiposEvento = signal<TipoEvento[]>([]);
  eventoId    = signal<number | null>(null);

  form: FormGroup = this.fb.group({
    tipo_evento_id:  [null, [Validators.required]],
    titulo:          ['', [Validators.required, Validators.maxLength(300)]],
    descripcion:     [''],
    lugar:           [''],
    fecha_inicio:    ['', [Validators.required]],
    fecha_fin:       [''],
    todo_el_dia:     [false],
    estado:          ['programado'],
    url_transmision: [''],
    publico:         [true],
  });

  constructor() {
    this.eventoService.getTipos().subscribe({
      next: (res) => this.tiposEvento.set(res.data),
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventoId.set(id);

    this.eventoService.getAll({ pageSize: 1000 }).subscribe({
      next: (res) => {
        const evento = res.data.find(e => e.id === id);
        if (evento) {
          this.form.patchValue({
            tipo_evento_id:  evento.tipo_evento_id,
            titulo:          evento.titulo,
            descripcion:     evento.descripcion ?? '',
            lugar:           evento.lugar ?? '',
            fecha_inicio:    evento.fecha_inicio ? evento.fecha_inicio.substring(0, 10) : '',
            fecha_fin:       evento.fecha_fin ? evento.fecha_fin.substring(0, 10) : '',
            todo_el_dia:     evento.todo_el_dia,
            estado:          evento.estado,
            url_transmision: evento.url_transmision ?? '',
            publico:         evento.publico,
          });
        } else {
          this.toast.error('Error', 'Evento no encontrado');
          this.router.navigate(['/senefco/eventos']);
        }
        this.loadingEvento.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el evento'));
        this.loadingEvento.set(false);
        this.router.navigate(['/senefco/eventos']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const id = this.eventoId();
    if (!id) return;

    this.submitting.set(true);
    this.eventoService.update(id, this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Evento actualizado exitosamente');
        this.router.navigate(['/senefco/eventos']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el evento'));
        this.submitting.set(false);
      }
    });
  }
}
