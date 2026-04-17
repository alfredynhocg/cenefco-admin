import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { JsonPipe } from '@angular/common';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { AuditoriaService } from '../../application/services/auditoria.service';
import { Auditoria } from '../../domain/models/auditoria.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-auditoria-detail',
  imports: [NgIcon, JsonPipe, PageTitle, RouterLink],
  templateUrl: './auditoria-detail.html',
  styles: ``
})
export class AuditoriaDetail implements OnInit {
  private auditoriaService = inject(AuditoriaService);
  private toast            = inject(ToastService);
  private router           = inject(Router);
  private route            = inject(ActivatedRoute);

  loading   = signal(true);
  auditoria = signal<Auditoria | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.auditoriaService.getById(id).subscribe({
      next: (data) => {
        this.auditoria.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el registro de auditoría'));
        this.router.navigate(['/senefco/auditorias']);
      }
    });
  }

  accionBadgeClass(accion: string): string {
    const map: Record<string, string> = {
      crear:    'bg-success/15 text-success',
      editar:   'bg-info/15 text-info',
      eliminar: 'bg-danger/15 text-danger',
      login:    'bg-primary/15 text-primary',
      logout:   'bg-default-200 text-default-600',
    };
    return map[accion.toLowerCase()] ?? 'bg-warning/15 text-warning';
  }

  hasData(obj: Record<string, unknown> | null): boolean {
    return obj != null && Object.keys(obj).length > 0;
  }
}
