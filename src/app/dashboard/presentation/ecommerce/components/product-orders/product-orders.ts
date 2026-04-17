import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from "@ng-icons/core";
import { UltimaSolicitud } from '../../../../domain/models/dashboard.model';

@Component({
  selector: 'app-product-orders',
  imports: [NgIcon, RouterLink],
  templateUrl: './product-orders.html',
  styles: ``
})
export class ProductOrders {
  @Input() ultimasSolicitudes: UltimaSolicitud[] = [];

  estadoClasses(estado: string): { bg: string; text: string; border: string } {
    const map: Record<string, { bg: string; text: string; border: string }> = {
      pendiente:  { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
      en_proceso: { bg: 'bg-info/10',    text: 'text-info',    border: 'border-info/30' },
      completado: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
      rechazado:  { bg: 'bg-danger/10',  text: 'text-danger',  border: 'border-danger/30' },
      cancelado:  { bg: 'bg-default/10', text: 'text-default-500', border: 'border-default/30' },
    };
    return map[estado] ?? { bg: 'bg-default/10', text: 'text-default-500', border: 'border-default/30' };
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pendiente: 'Pendiente', en_proceso: 'En Proceso',
      completado: 'Completado', rechazado: 'Rechazado', cancelado: 'Cancelado',
    };
    return map[estado] ?? estado;
  }
}
