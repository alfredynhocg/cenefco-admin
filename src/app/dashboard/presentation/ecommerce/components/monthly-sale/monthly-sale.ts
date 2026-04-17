import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
import { DashboardResumen } from '../../../../domain/models/dashboard.model';

@Component({
  selector: 'app-monthly-sale',
  imports: [NgIcon, RouterLink],
  templateUrl: './monthly-sale.html',
  styles: ``
})
export class MonthlySale {
  @Input() resumen: DashboardResumen | null = null;
}
