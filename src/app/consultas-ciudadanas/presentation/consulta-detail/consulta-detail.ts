import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ConsultaCiudadanaService } from '../../application/services/consulta-ciudadana.service';
import { ConsultaCiudadana } from '../../domain/models/consulta-ciudadana.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-consulta-detail',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './consulta-detail.html',
  styles: ``
})
export class ConsultaDetail implements OnInit {
  private route           = inject(ActivatedRoute);
  private consultaService = inject(ConsultaCiudadanaService);
  private toast           = inject(ToastService);
  private router          = inject(Router);
  private fb              = inject(FormBuilder);

  consulta   = signal<ConsultaCiudadana | null>(null);
  isLoading  = signal(true);
  submitting = signal(false);

  form: FormGroup = this.fb.group({
    respuesta: ['', [Validators.required]],
    estado:    ['respondido', [Validators.required]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.consultaService.getById(id).subscribe({
      next: (data) => {
        this.consulta.set(data);
        if (data.respuesta) {
          this.form.patchValue({ respuesta: data.respuesta, estado: data.estado });
        }
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar la consulta'));
        this.isLoading.set(false);
      }
    });
  }

  onResponder(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const id = this.consulta()!.id;
    this.submitting.set(true);
    this.consultaService.responder(id, this.form.value).subscribe({
      next: (updated) => {
        this.consulta.set(updated);
        this.toast.success('¡Respondida!', 'La respuesta fue enviada correctamente');
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo enviar la respuesta'));
        this.submitting.set(false);
      }
    });
  }

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      pendiente:   'bg-warning/15 text-warning',
      en_proceso:  'bg-info/15 text-info',
      respondido:  'bg-success/15 text-success',
      cerrado:     'bg-default-200 text-default-500',
    };
    return map[estado] ?? 'bg-default-200 text-default-600';
  }

  tipoBadgeClass(tipo: string): string {
    const map: Record<string, string> = {
      consulta:   'bg-primary/15 text-primary',
      queja:      'bg-danger/15 text-danger',
      sugerencia: 'bg-success/15 text-success',
      denuncia:   'bg-warning/15 text-warning',
      solicitud:  'bg-info/15 text-info',
    };
    return map[tipo] ?? 'bg-default-200 text-default-600';
  }
}
