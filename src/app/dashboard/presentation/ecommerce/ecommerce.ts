import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon } from "@ng-icons/core";
import { Banner } from "./components/banner/banner";
import { Overview } from "./components/overview/overview";
import { OrderChart } from "./components/order-chart/order-chart";
import { SalesRevenueChart } from "./components/sales-revenue-chart/sales-revenue-chart";
import { TrafficResourcesChart } from "./components/traffic-resources-chart/traffic-resources-chart";
import { ProductOrders } from "./components/product-orders/product-orders";
import { CustomerServices } from "./components/customer-services/customer-services";
import { MonthlySale } from "./components/monthly-sale/monthly-sale";
import { SellingProduct } from "./components/selling-product/selling-product";
import { PageTitle } from "../../../common/components/page-title/page-title";
import { DashboardService } from "../../../dashboard/application/services/dashboard.service";
import { DashboardStats } from "../../../dashboard/domain/models/dashboard.model";

@Component({
  selector: 'app-ecommerce',
  imports: [
    NgIcon, PageTitle, Banner, Overview, OrderChart,
    SalesRevenueChart, TrafficResourcesChart, ProductOrders,
    CustomerServices, MonthlySale, SellingProduct,
  ],
  templateUrl: './ecommerce.html',
  styles: ``
})
export class Ecommerce implements OnInit {
  private dashboardService = inject(DashboardService);

  stats   = signal<DashboardStats | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  reload(): void {
    this.loading.set(true);
    this.stats.set(null);
    this.load();
  }

  private load(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: ()     => this.loading.set(false),
    });
  }
}
