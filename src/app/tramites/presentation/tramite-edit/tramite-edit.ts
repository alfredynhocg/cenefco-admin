import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { TramiteService } from '../../application/services/tramite.service';
import { Tramite, TipoTramite, UnidadResponsable } from '../../domain/models/tramite.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-tramite-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './tramite-edit.html',
  styles: ``
})
export class TramiteEdit implements OnInit {
  private fb             = inject(FormBuilder);
  private tramiteService = inject(TramiteService);
  private toast          = inject(ToastService);
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);

  submitting      = signal(false);
  loadingTramite  = signal(true);
  tiposTramite    = signal<TipoTramite[]>([]);
  unidades        = signal<UnidadResponsable[]>([]);
  private id!: number;

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
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.tramiteService.getTiposTramite().subscribe({
      next: res => this.tiposTramite.set(res.data),
    });
    this.tramiteService.getUnidadesResponsables().subscribe({
      next: res => this.unidades.set(res.data),
    });

    this.tramiteService.getById(this.id).subscribe({
      next: (tramite) => {
        this.form.patchValue({
          nombre:                  tramite.nombre,
          tipo_tramite_id:         tramite.tipo_tramite_id,
          unidad_responsable_id:   tramite.unidad_responsable_id,
          descripcion:             tramite.descripcion ?? '',
          procedimiento:           tramite.procedimiento ?? '',
          costo:                   tramite.costo ?? null,
          moneda:                  tramite.moneda,
          dias_habiles_resolucion: tramite.dias_habiles_resolucion ?? null,
          normativa_base:          tramite.normativa_base ?? '',
          url_formulario:          tramite.url_formulario ?? '',
          modalidad:               tramite.modalidad,
          activo:                  tramite.activo,
        });
        this.loadingTramite.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el trámite'));
        this.router.navigate(['/senefco/tramites']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.tramiteService.update(this.id, this.form.value as unknown as Partial<Tramite>).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'El trámite ha sido actualizado correctamente');
        this.router.navigate(['/senefco/tramites']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el trámite'));
        this.submitting.set(false);
      }
    });
  }
}
