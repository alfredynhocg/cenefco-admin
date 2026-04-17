import { Component, Input, OnChanges } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { Apexchart } from "../../../../../common/components/apexchart/apexchart";
import { NgIcon } from "@ng-icons/core";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-chart',
  imports: [Apexchart, NgIcon, RouterLink],
  templateUrl: './order-chart.html',
  styles: ``
})
export class OrderChart implements OnChanges {
  @Input() tramitesPorEstado: Record<string, number> = {};

  orderChartOptions: (() => ApexOptions) | null = null;

  readonly estadoConfig: Record<string, { color: string; label: string }> = {
    pendiente:    { color: '#f59e0b', label: 'Pendiente' },
    en_proceso:   { color: '#3b82f6', label: 'En Proceso' },
    completado:   { color: '#22c55e', label: 'Completado' },
    rechazado:    { color: '#ef4444', label: 'Rechazado' },
    cancelado:    { color: '#94a3b8', label: 'Cancelado' },
  };

  get estadoEntries() {
    return Object.entries(this.tramitesPorEstado);
  }

  get total() {
    return Object.values(this.tramitesPorEstado).reduce((a, b) => a + b, 0);
  }

  getColor(key: string): string {
    return this.estadoConfig[key]?.color ?? '#94a3b8';
  }

  getLabel(key: string): string {
    return this.estadoConfig[key]?.label ?? key;
  }

  getPct(val: number): number {
    return this.total > 0 ? Math.round((val / this.total) * 100) : 0;
  }

  ngOnChanges(): void {
    const labels = Object.keys(this.tramitesPorEstado).map(k => this.getLabel(k));
    const values = Object.values(this.tramitesPorEstado);
    const colors = Object.keys(this.tramitesPorEstado).map(k => this.getColor(k));

    this.orderChartOptions = () => ({
      series: values,
      labels,
      chart: {
        type: 'donut' as const,
        height: 140,
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 900,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 400 },
        },
      },
      colors,
      dataLabels: { enabled: false },
      legend: { show: false },
      stroke: { width: 2, colors: ['transparent'] },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: { show: true, fontSize: '13px', color: '#64748b' },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                color: '#1e293b',
                formatter: (v: string) => v,
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '12px',
                color: '#94a3b8',
                formatter: (w: { globals: { seriesTotals: number[] } }) =>
                  String(w.globals.seriesTotals.reduce((a, b) => a + b, 0)),
              },
            },
          },
        },
      },
      tooltip: {
        y: { formatter: (v: number) => v + ' trámites' },
      },
    });
  }
}
