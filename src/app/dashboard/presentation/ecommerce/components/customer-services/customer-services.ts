import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from "@ng-icons/core";

type AccesoRapido = {
  icon: string;
  label: string;
  ruta: string;
  bgClass: string;
  textClass: string;
};

@Component({
  selector: 'app-customer-services',
  imports: [NgIcon, RouterLink],
  templateUrl: './customer-services.html',
  styles: ``
})
export class CustomerServices {
  accesos: AccesoRapido[] = [
    { icon: 'lucideMegaphone',     label: 'Comunicados',    ruta: '/senefco/comunicados',           bgClass: 'bg-primary/10',  textClass: 'text-primary' },
    { icon: 'lucideNewspaper',     label: 'Noticias',       ruta: '/senefco/noticias',              bgClass: 'bg-success/10',  textClass: 'text-success' },
    { icon: 'lucideClipboardList', label: 'Trámites',       ruta: '/senefco/tramites',              bgClass: 'bg-warning/10',  textClass: 'text-warning' },
    { icon: 'lucideMessageSquare', label: 'Consultas',      ruta: '/senefco/consultas-ciudadanas',  bgClass: 'bg-info/10',     textClass: 'text-info' },
    { icon: 'lucideCalendarDays',  label: 'Eventos',        ruta: '/senefco/eventos',               bgClass: 'bg-purple-500/10', textClass: 'text-purple-500' },
    { icon: 'lucideImage',         label: 'Galería',        ruta: '/senefco/galerias',              bgClass: 'bg-teal-500/10', textClass: 'text-teal-500' },
    { icon: 'lucideLayoutPanelTop','label': 'Banners',      ruta: '/senefco/banners',               bgClass: 'bg-orange-500/10', textClass: 'text-orange-500' },
    { icon: 'lucideUsers',         label: 'Usuarios',       ruta: '/senefco/usuarios',              bgClass: 'bg-rose-500/10', textClass: 'text-rose-500' },
  ];
}
