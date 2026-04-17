import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { TramiteService } from '../../application/services/tramite.service';
import { Tramite, TipoTramite, UnidadResponsable } from '../../domain/models/tramite.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-tramite-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './tramite-create.html',
  styles: ``
})
export class TramiteCreate implements OnInit {
  private fb             = inject(FormBuilder);
  private tramiteService = inject(TramiteService);
  private toast          = inject(ToastService);
  private router         = inject(Router);

  submitting      = signal(false);
  tiposTramite    = signal<TipoTramite[]>([]);
  unidades        = signal<UnidadResponsable[]>([]);

  form = this.fb.group({
    nombre:                  ['', [Validators.required, Validators.maxLength(300)]],
    tipo_tramite_id:         [null as number | null, Validators.required],
    unidad_responsable_id:   [null as number | null, Validators.required],
    descripcion:             [''],
    procedimiento:           [''],
    costo:                   [null as number | null],
    moneda:                  ['BOB'],
    dias_habiles_resolucion: [null as number | null],
    normativa_base:          [''],
    url_formulario:          [''],
    modalidad:               ['presencial'],
    activo:                  [true],
  });

  ngOnInit(): void {
    this.tramiteService.getTiposTramite().subscribe({
      next: res => this.tiposTramite.set(res.data),
    });
    this.tramiteService.getUnidadesResponsables().subscribe({
      next: res => this.unidades.set(res.data),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.tramiteService.create(this.form.value as unknown as Partial<Tramite>).subscribe({
      next: () => {
        this.toast.success('¡Creado!', 'El trámite ha sido creado correctamente');
        this.router.navigate(['/senefco/tramites']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo crear el trámite'));
        this.submitting.set(false);
      }
    });
  }
}
