import { Component, Input, OnChanges } from '@angular/core';
import { NgIcon } from "@ng-icons/core";
import { DashboardResumen } from '../../../../domain/models/dashboard.model';

type StatCard = {
  icon: string;
  bgClass: string;
  textClass: string;
  value: string;
  label: string;
  badge?: string;
};

@Component({
  selector: 'app-overview',
  imports: [NgIcon],
  templateUrl: './overview.html',
  styles: ``
})
export class Overview implements OnChanges {
  @Input() resumen!: DashboardResumen;

  stats: StatCard[] = [];

  ngOnChanges(): void {
    if (!this.resumen) return;
    this.stats = [
      {
        icon: 'lucideClipboardList',
        bgClass: 'bg-warning/10',
        textClass: 'text-warning',
        value: String(this.resumen.tramites_pendientes),
        label: 'Trámites Pendientes',
        badge: 'PENDIENTE',
      },
      {
        icon: 'lucideMessageSquare',
        bgClass: 'bg-info/10',
        textClass: 'text-info',
        value: String(this.resumen.consultas_nuevas),
        label: 'Consultas Ciudadanas',
        badge: 'NUEVAS',
      },
      {
        icon: 'lucideMegaphone',
        bgClass: 'bg-primary/10',
        textClass: 'text-primary',
        value: String(this.resumen.comunicados_publicados),
        label: 'Comunicados',
        badge: 'MES',
      },
      {
        icon: 'lucideNewspaper',
        bgClass: 'bg-success/10',
        textClass: 'text-success',
        value: String(this.resumen.noticias_publicadas),
        label: 'Noticias Publicadas',
        badge: 'MES',
      },
    ];
  }
}
