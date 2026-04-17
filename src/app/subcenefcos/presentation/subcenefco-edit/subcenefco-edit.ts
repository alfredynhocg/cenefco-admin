import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SubcenefcoService } from '../../application/services/subcenefco.service';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-subcenefco-edit',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageTitle],
  templateUrl: './subcenefco-edit.html',
  styles: ``
})
export class SubcenefcoEdit implements OnInit {
  private subcenefcoService = inject(SubcenefcoService);
  private toast             = inject(ToastService);
  private router            = inject(Router);
  private route             = inject(ActivatedRoute);
  private fb                = inject(FormBuilder);

  submitting = signal(false);
  loading    = signal(true);
  private id!: number;

  form: FormGroup = this.fb.group({
    nombre:               ['', [Validators.required, Validators.maxLength(200)]],
    zona_cobertura:       [''],
    direccion_fisica:     [''],
    telefono:             [''],
    email:                ['', [Validators.email]],
    imagen_url:           [''],
    latitud:              [null],
    longitud:             [null],
    tramites_disponibles: [''],
    activa:               [true],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.subcenefcoService.getById(this.id).subscribe({
      next: (sub) => {
        this.form.patchValue({
          nombre:               sub.nombre,
          zona_cobertura:       sub.zona_cobertura,
          direccion_fisica:     sub.direccion_fisica,
          telefono:             sub.telefono,
          email:                sub.email,
          imagen_url:           sub.imagen_url,
          latitud:              sub.latitud,
          longitud:             sub.longitud,
          tramites_disponibles: sub.tramites_disponibles,
          activa:               sub.activa,
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el SubCENEFCO'));
        this.router.navigate(['/senefco/subcenefcos']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.subcenefcoService.update(this.id, this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'SubCENEFCO actualizado exitosamente');
        this.router.navigate(['/senefco/subcenefcos']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el SubCENEFCO'));
        this.submitting.set(false);
      }
    });
  }
}
