import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DocentePerfilService } from '../../application/services/docente-perfil.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-docente-perfil-create', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './docente-perfil-create.html' })
export class DocentePerfilCreate {
  private service = inject(DocentePerfilService); private toast = inject(ToastService);
  private router  = inject(Router); private fb = inject(FormBuilder);
  submitting = signal(false);

  form = this.fb.group({
    nombre_completo:  ['', [Validators.required, Validators.maxLength(300)]],
    titulo_academico: [''],
    especialidad:     [''],
    biografia:        [''],
    foto_url:         [''],
    foto_alt:         [''],
    email_publico:    [''],
    linkedin_url:     [''],
    twitter_url:      [''],
    sitio_web_url:    [''],
    tipo:             ['docente'],
    mostrar_en_web:   [true],
    orden:            [0],
    estado:           ['publicado'],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.create(this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Creado!', 'Docente registrado'); this.router.navigate(['/senefco/docentes-perfil']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar')); this.submitting.set(false); }
    });
  }
}
