import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SecretariaService } from '../../application/services/secretaria.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-secretaria-edit',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './secretaria-edit.html',
  styles: ``
})
export class SecretariaEdit implements OnInit {
  private secretariaService = inject(SecretariaService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private fb                = inject(FormBuilder);

  submitting = signal(false);
  loading    = signal(true);
  private id!: number;

  form: FormGroup = this.fb.group({
    nombre:            ['', [Validators.required, Validators.maxLength(200)]],
    sigla:             ['', [Validators.maxLength(200)]],
    atribuciones:      [''],
    direccion_fisica:  ['', [Validators.maxLength(200)]],
    telefono:          ['', [Validators.maxLength(50)]],
    email:             ['', [Validators.email, Validators.maxLength(150)]],
    horario_atencion:  ['', [Validators.maxLength(50)]],
    foto_titular_url:  ['', [Validators.maxLength(255)]],
    orden_organigrama: [0],
    activa:            [true],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.secretariaService.getById(this.id).subscribe({
      next: (sec) => {
        this.form.patchValue({
          nombre:            sec.nombre,
          sigla:             sec.sigla,
          atribuciones:      sec.atribuciones,
          direccion_fisica:  sec.direccion_fisica,
          telefono:          sec.telefono,
          email:             sec.email,
          horario_atencion:  sec.horario_atencion,
          foto_titular_url:  sec.foto_titular_url,
          orden_organigrama: sec.orden_organigrama,
          activa:            sec.activa,
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la secretaría'));
        this.router.navigate(['/senefco/secretarias']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.secretariaService.update(this.id, this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizada!', 'Secretaría actualizada exitosamente');
        this.router.navigate(['/senefco/secretarias']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar la secretaría'));
        this.submitting.set(false);
      }
    });
  }
}
