import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from "@ng-icons/core";


type MenuItem = {
  type: 'title' | 'item' | 'accordion';
  label: string;
  icon?: string;
  link?: string;
  target?: string;
  children?: MenuItem[];
};

@Component({
  selector: 'app-sidebar-menu',
  imports: [NgIcon, RouterLink, CommonModule],
  templateUrl: './sidebar-menu.html',
  styles: ``
})
export class SidebarMenu {

  menus: MenuItem[] = [
    { type: 'title', label: 'General' },
    {
      type: 'item',
      label: 'Dashboard',
      icon: 'lucideLayoutDashboard',
      link: '/dashboards/senefco',
    },

    { type: 'title', label: 'Portal Institucional' },
    {
      type: 'accordion',
      label: 'Portal Institucional',
      icon: 'lucideGlobe',
      children: [
        { type: 'item', label: 'Comunicados', icon: 'lucideBellRing', link: '/senefco/comunicados' },
        { type: 'item', label: 'Noticias', icon: 'lucideNewspaper', link: '/senefco/noticias' },
        { type: 'item', label: 'Eventos', icon: 'lucideCalendarDays', link: '/senefco/eventos' },
        { type: 'item', label: 'Autoridades', icon: 'lucideUserCheck', link: '/senefco/autoridades' },
        { type: 'item', label: 'Trámites', icon: 'lucideClipboardList', link: '/senefco/tramites' },
        { type: 'item', label: 'Seguimiento Trámites', icon: 'lucideClipboardCheck', link: '/senefco/tramite-solicitudes' },
        { type: 'item', label: 'Consultas Ciudadanas', icon: 'lucideMessageSquare', link: '/senefco/consultas-ciudadanas' },
        { type: 'item', label: 'Secretarías', icon: 'lucideBuilding2', link: '/senefco/secretarias' },
        { type: 'item', label: 'SubCENEFCOs', icon: 'lucideMapPin', link: '/senefco/subcenefcos' },
      ]
    },

    { type: 'title', label: 'Programas' },
    { type: 'item', label: 'Programas',                  icon: 'lucideBookOpen',      link: '/senefco/cursos' },
    { type: 'item', label: 'Categorías de Programa',  icon: 'lucideLayoutGrid',    link: '/senefco/categorias-programa' },
    { type: 'item', label: 'Preinscripciones',        icon: 'lucideClipboardList', link: '/senefco/preinscripciones' },
    { type: 'item', label: 'Reseñas',                 icon: 'lucideStar',          link: '/senefco/resenas' },
    { type: 'item', label: 'FAQs',                    icon: 'lucideHelpCircle',    link: '/senefco/faqs' },
    { type: 'item', label: 'Cifras Institucionales',  icon: 'lucideBarChart2',     link: '/senefco/cifras-institucionales' },
    { type: 'item', label: 'Hitos Institucionales',   icon: 'lucideFlag',          link: '/senefco/hitos-institucionales' },
    { type: 'item', label: 'Expedido (CI)',            icon: 'lucideMapPin',        link: '/senefco/expedido' },
    { type: 'item', label: 'Grados Académicos',       icon: 'lucideGraduationCap', link: '/senefco/grados-academicos' },

    { type: 'title', label: 'Contenido' },
    {
      type: 'accordion',
      label: 'Contenido',
      icon: 'lucideFileText',
      children: [
        { type: 'item', label: 'Etiquetas', icon: 'lucideTag', link: '/senefco/etiquetas' },
        { type: 'item', label: 'Redes Sociales', icon: 'lucideShare2', link: '/senefco/redes-sociales' },
        { type: 'item', label: 'Formularios Trámites', icon: 'lucideFileSpreadsheet', link: '/senefco/formularios-tramite' },
        { type: 'item', label: 'Ítems', icon: 'lucidePackage', link: '/senefco/items' },
        { type: 'item', label: 'Banners', icon: 'lucideImage', link: '/senefco/banners' },
        { type: 'item', label: 'Galerías', icon: 'lucideImages', link: '/senefco/galerias' },
        { type: 'item', label: 'Menús del Portal', icon: 'lucideMenu', link: '/senefco/menus' },
        { type: 'item', label: 'Configuración del Sitio', icon: 'lucideGlobe', link: '/senefco/config-sitio' },
      ]
    },

    { type: 'title', label: 'Comunicación' },
    {
      type: 'item',
      label: 'Mensajes de Contacto',
      icon: 'lucideMail',
      link: '/senefco/mensajes-contacto',
    },
    {
      type: 'item',
      label: 'Sugerencias y Reclamos',
      icon: 'lucideMegaphone',
      link: '/senefco/sugerencias-reclamos',
    },
    {
      type: 'accordion',
      label: 'WhatsApp',
      icon: 'lucideMessageCircle',
      children: [
        { type: 'item', label: 'Conversaciones', icon: 'lucideMessageCircle', link: '/senefco/whatsapp-conversaciones' },
        { type: 'item', label: 'Enviar Mensaje', icon: 'lucideSend', link: '/senefco/whatsapp-enviar' },
        { type: 'item', label: 'Plantillas', icon: 'lucideFileText', link: '/senefco/whatsapp-plantillas' },
      ]
    },

    { type: 'title', label: 'Sistema' },
    {
      type: 'accordion',
      label: 'Sistema',
      icon: 'lucideSettings',
      children: [
        { type: 'item', label: 'Usuarios', icon: 'lucideUsers', link: '/senefco/usuarios' },
        { type: 'item', label: 'Nuevo Usuario', icon: 'lucideUserPlus', link: '/senefco/usuario-create' },
        { type: 'item', label: 'Roles', icon: 'lucideUserCog', link: '/senefco/roles' },
        { type: 'item', label: 'Configuraciones', icon: 'lucideSettings', link: '/senefco/configuraciones' },
      ]
    },
  ]

  constructor(private router: Router) {}

  isItemActive(item: any): boolean {
    const url = this.router.url;
    if (item.link && url === item.link) return true;
    if (item.children) {
      return item.children.some((child: any) => this.isItemActive(child));
    }
    return false;
  }
}
