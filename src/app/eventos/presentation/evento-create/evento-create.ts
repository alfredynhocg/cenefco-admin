import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { EventoService } from '../../application/services/evento.service';
import { TipoEvento } from '../../domain/models/evento.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-evento-create',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './evento-create.html',
  styles: ``
})
export class EventoCreate {
  private eventoService = inject(EventoService);
  private toast         = inject(ToastService);
  private router        = inject(Router);
  private fb            = inject(FormBuilder);

  submitting  = signal(false);
  tiposEvento = signal<TipoEvento[]>([]);

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
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting.set(true);
    this.eventoService.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'Evento registrado exitosamente');
        this.router.navigate(['/senefco/eventos']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el evento'));
        this.submitting.set(false);
      }
    });
  }
}
