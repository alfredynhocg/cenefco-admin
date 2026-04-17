import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DocentePerfilService } from '../../application/services/docente-perfil.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import { HttpErrorResponse } from '@angular/common/http';

@Component({ selector: 'app-docente-perfil-edit', imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle], templateUrl: './docente-perfil-edit.html' })
export class DocentePerfilEdit {
  private service = inject(DocentePerfilService); private toast = inject(ToastService);
  private router  = inject(Router); private route = inject(ActivatedRoute); private fb = inject(FormBuilder);
  submitting = signal(false); loading = signal(true);
  id = Number(this.route.snapshot.paramMap.get('id'));

  form = this.fb.group({
    nombre_completo: ['', [Validators.required]], titulo_academico: [''], especialidad: [''],
    biografia: [''], foto_url: [''], foto_alt: [''], email_publico: [''],
    linkedin_url: [''], twitter_url: [''], sitio_web_url: [''],
    tipo: ['docente'], mostrar_en_web: [true], orden: [0], estado: ['publicado'],
  });

  constructor() {
    this.service.getById(this.id).subscribe({
      next: (d) => { this.form.patchValue(d as any); this.loading.set(false); },
      error: () => { this.toast.error('Error', 'No se pudo cargar'); this.router.navigate(['/senefco/docentes-perfil']); }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.service.update(this.id, this.form.value as any).subscribe({
      next: () => { this.toast.success('¡Actualizado!', 'Docente actualizado'); this.router.navigate(['/senefco/docentes-perfil']); },
      error: (err: HttpErrorResponse) => { this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar')); this.submitting.set(false); }
    });
  }
}
