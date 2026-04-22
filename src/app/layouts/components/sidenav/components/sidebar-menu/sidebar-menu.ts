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

    { type: 'title', label: 'Programas' },
    {
      type: 'accordion',
      label: 'Programas',
      icon: 'lucideBookOpen',
      children: [
        { type: 'item', label: 'Programas',             icon: 'lucideBookOpen',      link: '/senefco/cursos' },
        { type: 'item', label: 'Categorías',            icon: 'lucideLayoutGrid',    link: '/senefco/categorias-programa' },
        { type: 'item', label: 'Tipos de Programa',     icon: 'lucideLayers',        link: '/senefco/tipos-programa' },
        { type: 'item', label: 'Preinscripciones',      icon: 'lucideClipboardList', link: '/senefco/preinscripciones' },
        { type: 'item', label: 'Reseñas',               icon: 'lucideStar',          link: '/senefco/resenas' },
        { type: 'item', label: 'FAQs',                  icon: 'lucideHelpCircle',    link: '/senefco/faqs' },
        { type: 'item', label: 'Grados Académicos',     icon: 'lucideGraduationCap', link: '/senefco/grados-academicos' },
        { type: 'item', label: 'Expedido (CI)',          icon: 'lucideMapPin',        link: '/senefco/expedido' },
        { type: 'item', label: 'Docentes',              icon: 'lucideUserCheck',     link: '/senefco/docentes-perfil' },
        { type: 'item', label: 'Descuentos',            icon: 'lucidePercent',       link: '/senefco/descuentos-promociones' },
      ]
    },

    { type: 'title', label: 'Institucional' },
    {
      type: 'accordion',
      label: 'Institucional',
      icon: 'lucideBuilding',
      children: [
        { type: 'item', label: 'Cifras Institucionales', icon: 'lucideBarChart2',  link: '/senefco/cifras-institucionales' },
        { type: 'item', label: 'Hitos Institucionales',  icon: 'lucideFlag',       link: '/senefco/hitos-institucionales' },
        { type: 'item', label: 'Acreditaciones',         icon: 'lucideAward',      link: '/senefco/acreditaciones' },
        { type: 'item', label: 'Aliados',                icon: 'lucideHandshake',  link: '/senefco/aliados' },
        { type: 'item', label: 'Testimonios',            icon: 'lucideQuote',      link: '/senefco/testimonios' },
        { type: 'item', label: 'Notas de Prensa',        icon: 'lucideNewspaper',  link: '/senefco/notas-prensa' },
      ]
    },

    { type: 'title', label: 'Contenido' },
    {
      type: 'accordion',
      label: 'Contenido',
      icon: 'lucideFileText',
      children: [
        { type: 'item', label: 'Banners',               icon: 'lucideImage',       link: '/senefco/banners' },
        { type: 'item', label: 'Galería de Videos',     icon: 'lucideVideo',       link: '/senefco/galeria-videos' },
        { type: 'item', label: 'Categorías de Galería', icon: 'lucideFolderOpen',  link: '/senefco/galeria-categorias' },
        { type: 'item', label: 'Descargables',          icon: 'lucideDownload',    link: '/senefco/descargables' },
        { type: 'item', label: 'Popups',                icon: 'lucideMonitor',     link: '/senefco/popups' },
        { type: 'item', label: 'Etiquetas',             icon: 'lucideTag',         link: '/senefco/etiquetas' },
        { type: 'item', label: 'Redes Sociales',        icon: 'lucideShare2',      link: '/senefco/redes-sociales' },
        { type: 'item', label: 'Eventos',               icon: 'lucideCalendarDays',link: '/senefco/eventos' },
        { type: 'item', label: 'Configuración del Sitio', icon: 'lucideGlobe',     link: '/senefco/config-sitio' },
      ]
    },

    { type: 'title', label: 'Certificados' },
    {
      type: 'accordion',
      label: 'Certificados',
      icon: 'lucideAward',
      children: [
        { type: 'item', label: 'Generar Certificados', icon: 'lucideAward',        link: '/senefco/certificados' },
        { type: 'item', label: 'Plantillas',           icon: 'lucideImage',        link: '/senefco/cert-plantillas' },
        { type: 'item', label: 'Lista de Aprobados',   icon: 'lucideUsers',        link: '/senefco/lista-aprobados' },
      ]
    },

    { type: 'title', label: 'Comunicación' },
    { type: 'item', label: 'Mensajes de Contacto', icon: 'lucideMail',     link: '/senefco/mensajes-contacto' },
    { type: 'item', label: 'Suscriptores',          icon: 'lucideUsers',    link: '/senefco/suscriptores' },
    { type: 'item', label: 'Redirecciones',         icon: 'lucideArrowRightLeft', link: '/senefco/redirecciones' },
    {
      type: 'accordion',
      label: 'WhatsApp',
      icon: 'lucideMessageCircle',
      children: [
        { type: 'item', label: 'Conversaciones', icon: 'lucideMessageCircle', link: '/senefco/whatsapp-conversaciones' },
        { type: 'item', label: 'Asesores',        icon: 'lucideUsers',          link: '/senefco/asesores' },
        { type: 'item', label: 'Enviar Mensaje',  icon: 'lucideSend',          link: '/senefco/whatsapp-enviar' },
        { type: 'item', label: 'Plantillas',      icon: 'lucideFileText',      link: '/senefco/whatsapp-plantillas' },
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
