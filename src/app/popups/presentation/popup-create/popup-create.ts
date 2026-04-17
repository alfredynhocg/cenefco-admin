import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PopupService } from '../../application/services/popup.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-popup-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './popup-create.html' })
export class PopupCreate {
  private service = inject(PopupService); private toast = inject(ToastService);
  private router  = inject(Router); private fb = inject(FormBuilder);
  submitting = signal(false);

  form = this.fb.group({
    titulo:                   [''],
    contenido:                [''],
    imagen_url:               [''],
    enlace_url:               [''],
    enlace_texto:             [''],
    posicion:                 ['center'],
    delay_segundos:           [3],
    mostrar_una_vez_sesion:   [true],
    mostrar_una_vez_siempre:  [false],
    paginas_mostrar:          [''],
    activo:                   [false],
    fecha_inicio:             [''],
    fecha_fin:                [''],
  });

  onSubmit(): void {
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Creado!', 'Popup registrado'); this.router.navigate(['/senefco/popups']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
