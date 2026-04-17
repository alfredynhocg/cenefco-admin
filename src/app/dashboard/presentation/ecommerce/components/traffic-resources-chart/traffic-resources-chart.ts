import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { UltimaConsulta } from '../../../../domain/models/dashboard.model';

@Component({
  selector: 'app-traffic-resources-chart',
  imports: [NgIcon, RouterLink],
  templateUrl: './traffic-resources-chart.html',
  styles: ``
})
export class TrafficResourcesChart {
  @Input() ultimasConsultas: UltimaConsulta[] = [];

  estadoClasses(estado: string): { bg: string; text: string } {
    const map: Record<string, { bg: string; text: string }> = {
      nueva:      { bg: 'bg-info/10',    text: 'text-info' },
      en_proceso: { bg: 'bg-warning/10', text: 'text-warning' },
      resuelta:   { bg: 'bg-success/10', text: 'text-success' },
      cerrada:    { bg: 'bg-default/10', text: 'text-default-500' },
    };
    return map[estado] ?? { bg: 'bg-default/10', text: 'text-default-500' };
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      nueva: 'Nueva', en_proceso: 'En Proceso', resuelta: 'Resuelta', cerrada: 'Cerrada',
    };
    return map[estado] ?? estado;
  }
}
