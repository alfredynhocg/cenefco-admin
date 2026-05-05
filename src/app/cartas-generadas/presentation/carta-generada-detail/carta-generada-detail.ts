import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { SlicePipe } from '@angular/common';
import { CartaGeneradaService } from '../../application/services/carta-generada.service';
import { CartaGenerada } from '../../domain/models/carta-generada.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';

@Component({ selector: 'app-carta-generada-detail', imports: [RouterLink, NgIcon, PageTitle, SlicePipe], templateUrl: './carta-generada-detail.html' })
export class CartaGeneradaDetail {
  private service = inject(CartaGeneradaService); private toast = inject(ToastService);
  private router  = inject(Router); private route = inject(ActivatedRoute);
  loading = signal(true);
  carta   = signal<CartaGenerada | null>(null);
  id = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    this.service.getById(this.id).subscribe({
      next: (d) => { this.carta.set(d); this.loading.set(false); },
      error: () => { this.toast.error('Error', 'No se pudo cargar'); this.router.navigate(['/senefco/cartas-generadas']); }
    });
  }
}
