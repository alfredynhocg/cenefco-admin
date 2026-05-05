import { Routes } from "@angular/router";

import { Configuraciones } from "../../configuraciones/presentation/configuraciones/configuraciones";

import { Usuarios }       from "../../usuarios/presentation/usuarios/usuarios";
import { UsuarioCreate }  from "../../usuarios/presentation/usuario-create/usuario-create";
import { UsuarioEdit }    from "../../usuarios/presentation/usuario-edit/usuario-edit";

import { Asesores } from "../../asesores/presentation/asesores/asesores";

import { WhatsappConversaciones } from "../../whatsapp/presentation/whatsapp-conversaciones/whatsapp-conversaciones";
import { WhatsappMensajes }       from "../../whatsapp/presentation/whatsapp-mensajes/whatsapp-mensajes";
import { WhatsappEnviar }         from "../../whatsapp/presentation/whatsapp-enviar/whatsapp-enviar";
import { WhatsappPlantillas }     from "../../whatsapp/presentation/whatsapp-plantillas/whatsapp-plantillas";

import { Roles }     from "../../roles/presentation/roles/roles";
import { RolCreate } from "../../roles/presentation/rol-create/rol-create";
import { RolEdit }   from "../../roles/presentation/rol-edit/rol-edit";

import { MiPerfil }       from "../../cuenta/presentation/mi-perfil/mi-perfil";
import { Etiquetas }      from "../../etiquetas/presentation/etiquetas/etiquetas";
import { EtiquetaCreate } from "../../etiquetas/presentation/etiqueta-create/etiqueta-create";
import { EtiquetaEdit }   from "../../etiquetas/presentation/etiqueta-edit/etiqueta-edit";

import { Eventos }      from "../../eventos/presentation/eventos/eventos";
import { EventoCreate } from "../../eventos/presentation/evento-create/evento-create";
import { EventoEdit }   from "../../eventos/presentation/evento-edit/evento-edit";

import { RedesSociales }    from "../../redes-sociales/presentation/redes-sociales/redes-sociales";
import { RedSocialCreate }  from "../../redes-sociales/presentation/red-social-create/red-social-create";
import { RedSocialEdit }    from "../../redes-sociales/presentation/red-social-edit/red-social-edit";

import { ConfigSitio }           from "../../config-sitio/presentation/config-sitio/config-sitio";
import { MensajesContacto }      from "../../mensajes-contacto/presentation/mensajes-contacto/mensajes-contacto";
import { MensajeContactoDetail } from "../../mensajes-contacto/presentation/mensaje-contacto-detail/mensaje-contacto-detail";

import { Banners }      from "../../banners/presentation/banners/banners";
import { BannerCreate } from "../../banners/presentation/banner-create/banner-create";
import { BannerEdit }   from "../../banners/presentation/banner-edit/banner-edit";

import { Cursos }      from "../../cursos/presentation/cursos/cursos";
import { CursoCreate } from "../../cursos/presentation/curso-create/curso-create";
import { CursoEdit }   from "../../cursos/presentation/curso-edit/curso-edit";

import { CategoriasProgramas }     from "../../categorias-programa/presentation/categorias-programa/categorias-programa";
import { CategoriaProgramaCreate } from "../../categorias-programa/presentation/categoria-programa-create/categoria-programa-create";
import { CategoriaProgramaEdit }   from "../../categorias-programa/presentation/categoria-programa-edit/categoria-programa-edit";

import { Preinscripciones }     from "../../preinscripciones/presentation/preinscripciones/preinscripciones";
import { PreinscripcionDetail } from "../../preinscripciones/presentation/preinscripcion-detail/preinscripcion-detail";

import { Resenas }      from "../../resenas/presentation/resenas/resenas";
import { ResenaDetail } from "../../resenas/presentation/resena-detail/resena-detail";

import { Faqs }      from "../../faqs/presentation/faqs/faqs";
import { FaqCreate } from "../../faqs/presentation/faq-create/faq-create";
import { FaqEdit }   from "../../faqs/presentation/faq-edit/faq-edit";

import { CifrasInstitucionales } from "../../cifras-institucionales/presentation/cifras-institucionales/cifras-institucionales";
import { CifraCreate }           from "../../cifras-institucionales/presentation/cifra-create/cifra-create";
import { CifraEdit }             from "../../cifras-institucionales/presentation/cifra-edit/cifra-edit";

import { HitosInstitucionales } from "../../hitos-institucionales/presentation/hitos-institucionales/hitos-institucionales";
import { HitoCreate }           from "../../hitos-institucionales/presentation/hito-create/hito-create";
import { HitoEdit }             from "../../hitos-institucionales/presentation/hito-edit/hito-edit";

import { Expedido }       from "../../expedido/presentation/expedido/expedido";
import { ExpedidoCreate } from "../../expedido/presentation/expedido-create/expedido-create";
import { ExpedidoEdit }   from "../../expedido/presentation/expedido-edit/expedido-edit";

import { GradosAcademicos } from "../../grado-academico/presentation/grados-academicos/grados-academicos";
import { GradoCreate }      from "../../grado-academico/presentation/grado-create/grado-create";
import { GradoEdit }        from "../../grado-academico/presentation/grado-edit/grado-edit";

// Nuevos módulos
import { Aliados }      from "../../aliados/presentation/aliados/aliados";
import { AliadoCreate } from "../../aliados/presentation/aliado-create/aliado-create";
import { AliadoEdit }   from "../../aliados/presentation/aliado-edit/aliado-edit";

import { Testimonios }      from "../../testimonios/presentation/testimonios/testimonios";
import { TestimonioCreate } from "../../testimonios/presentation/testimonio-create/testimonio-create";
import { TestimonioEdit }   from "../../testimonios/presentation/testimonio-edit/testimonio-edit";

import { NotasPrensa }    from "../../notas-prensa/presentation/notas-prensa/notas-prensa";
import { NotaPrensaCreate } from "../../notas-prensa/presentation/nota-prensa-create/nota-prensa-create";
import { NotaPrensaEdit }   from "../../notas-prensa/presentation/nota-prensa-edit/nota-prensa-edit";

import { Descargables }      from "../../descargables/presentation/descargables/descargables";
import { DescargableCreate } from "../../descargables/presentation/descargable-create/descargable-create";
import { DescargableEdit }   from "../../descargables/presentation/descargable-edit/descargable-edit";

import { GaleriaCategorias }     from "../../galeria-categorias/presentation/galeria-categorias/galeria-categorias";
import { GaleriaCategoriaCreate } from "../../galeria-categorias/presentation/galeria-categoria-create/galeria-categoria-create";
import { GaleriaCategoriaEdit }   from "../../galeria-categorias/presentation/galeria-categoria-edit/galeria-categoria-edit";

import { GaleriaVideos }     from "../../galeria-videos/presentation/galeria-videos/galeria-videos";
import { GaleriaVideoCreate } from "../../galeria-videos/presentation/galeria-video-create/galeria-video-create";
import { GaleriaVideoEdit }   from "../../galeria-videos/presentation/galeria-video-edit/galeria-video-edit";

import { Acreditaciones }     from "../../acreditaciones/presentation/acreditaciones/acreditaciones";
import { AcreditacionCreate } from "../../acreditaciones/presentation/acreditacion-create/acreditacion-create";
import { AcreditacionEdit }   from "../../acreditaciones/presentation/acreditacion-edit/acreditacion-edit";

import { Suscriptores } from "../../suscriptores/presentation/suscriptores/suscriptores";

import { Popups }      from "../../popups/presentation/popups/popups";
import { PopupCreate } from "../../popups/presentation/popup-create/popup-create";
import { PopupEdit }   from "../../popups/presentation/popup-edit/popup-edit";

import { Redirecciones }     from "../../redirecciones/presentation/redirecciones/redirecciones";
import { RedireccionCreate } from "../../redirecciones/presentation/redireccion-create/redireccion-create";
import { RedireccionEdit }   from "../../redirecciones/presentation/redireccion-edit/redireccion-edit";

// Fase 1 — Contenido Web
import { Articulos }      from "../../articulos/presentation/articulos/articulos";
import { ArticuloCreate } from "../../articulos/presentation/articulo-create/articulo-create";
import { ArticuloEdit }   from "../../articulos/presentation/articulo-edit/articulo-edit";

// Fase 2 — Cartas y Documentos
import { CartasModelo }     from "../../cartas-modelo/presentation/cartas-modelo/cartas-modelo";
import { CartaModeloCreate } from "../../cartas-modelo/presentation/carta-modelo-create/carta-modelo-create";
import { CartaModeloEdit }   from "../../cartas-modelo/presentation/carta-modelo-edit/carta-modelo-edit";

import { Cartas }      from "../../cartas/presentation/cartas/cartas";
import { CartaCreate } from "../../cartas/presentation/carta-create/carta-create";
import { CartaEdit }   from "../../cartas/presentation/carta-edit/carta-edit";

import { CartasGeneradas }       from "../../cartas-generadas/presentation/cartas-generadas/cartas-generadas";
import { CartaGeneradaCreate }   from "../../cartas-generadas/presentation/carta-generada-create/carta-generada-create";
import { CartaGeneradaDetail }   from "../../cartas-generadas/presentation/carta-generada-detail/carta-generada-detail";

import { Fotos }      from "../../fotos/presentation/fotos/fotos";
import { FotoCreate } from "../../fotos/presentation/foto-create/foto-create";
import { FotoEdit }   from "../../fotos/presentation/foto-edit/foto-edit";

import { WhatsappGrupos }      from "../../whatsapp-grupos/presentation/whatsapp-grupos/whatsapp-grupos";
import { WhatsappGrupoCreate } from "../../whatsapp-grupos/presentation/whatsapp-grupo-create/whatsapp-grupo-create";
import { WhatsappGrupoEdit }   from "../../whatsapp-grupos/presentation/whatsapp-grupo-edit/whatsapp-grupo-edit";

import { Permisos }      from "../../permisos/presentation/permisos/permisos";
import { PermisoCreate } from "../../permisos/presentation/permiso-create/permiso-create";
import { PermisoEdit }   from "../../permisos/presentation/permiso-edit/permiso-edit";

import { Boletines }     from "../../boletines/presentation/boletines/boletines";
import { BoletinCreate } from "../../boletines/presentation/boletin-create/boletin-create";
import { BoletinEdit }   from "../../boletines/presentation/boletin-edit/boletin-edit";

import { Ayudas }     from "../../ayudas/presentation/ayudas/ayudas";
import { AyudaCreate } from "../../ayudas/presentation/ayuda-create/ayuda-create";
import { AyudaEdit }   from "../../ayudas/presentation/ayuda-edit/ayuda-edit";

import { DocentesPerfil }    from "../../docentes-perfil/presentation/docentes-perfil/docentes-perfil";
import { DocentePerfilCreate } from "../../docentes-perfil/presentation/docente-perfil-create/docente-perfil-create";
import { DocentePerfilEdit }   from "../../docentes-perfil/presentation/docente-perfil-edit/docente-perfil-edit";

import { DescuentosPromociones } from "../../descuentos-promociones/presentation/descuentos-promociones/descuentos-promociones";
import { DescuentoCreate }       from "../../descuentos-promociones/presentation/descuento-create/descuento-create";
import { DescuentoEdit }         from "../../descuentos-promociones/presentation/descuento-edit/descuento-edit";

import { TiposPrograma }       from "../../tipos-programa/presentation/tipos-programa/tipos-programa";
import { TipoProgramaCreate }  from "../../tipos-programa/presentation/tipo-programa-create/tipo-programa-create";
import { TipoProgramaEdit }    from "../../tipos-programa/presentation/tipo-programa-edit/tipo-programa-edit";

import { Certificados }           from "../../certificados/presentation/certificados/certificados";
import { CertPlantillas }         from "../../certificados/presentation/cert-plantillas/cert-plantillas";
import { CertPlantillaCampos }    from "../../certificados/presentation/cert-plantilla-campos/cert-plantilla-campos";
import { ListaAprobados }         from "../../certificados/presentation/lista-aprobados/lista-aprobados";

export const ECOMMERCE_ROUTES: Routes = [
  { path: 'senefco/asesores', component: Asesores, data: { title: 'Asesores' } },

  { path: 'senefco/whatsapp-conversaciones', component: WhatsappConversaciones, data: { title: 'Conversaciones WhatsApp' } },
  { path: 'senefco/whatsapp-mensajes/:id',   component: WhatsappMensajes,       data: { title: 'Mensajes WhatsApp' } },
  { path: 'senefco/whatsapp-enviar',         component: WhatsappEnviar,         data: { title: 'Enviar Mensaje WhatsApp' } },
  { path: 'senefco/whatsapp-plantillas',     component: WhatsappPlantillas,     data: { title: 'Plantillas WhatsApp' } },

  { path: 'senefco/eventos',         component: Eventos,      data: { title: 'Eventos' } },
  { path: 'senefco/evento-create',   component: EventoCreate, data: { title: 'Nuevo Evento' } },
  { path: 'senefco/evento-edit/:id', component: EventoEdit,   data: { title: 'Editar Evento' } },

  { path: 'senefco/etiquetas',         component: Etiquetas,      data: { title: 'Etiquetas' } },
  { path: 'senefco/etiqueta-create',   component: EtiquetaCreate, data: { title: 'Nueva Etiqueta' } },
  { path: 'senefco/etiqueta-edit/:id', component: EtiquetaEdit,   data: { title: 'Editar Etiqueta' } },

  { path: 'senefco/redes-sociales',      component: RedesSociales,   data: { title: 'Redes Sociales' } },
  { path: 'senefco/red-social-create',   component: RedSocialCreate, data: { title: 'Nueva Red Social' } },
  { path: 'senefco/red-social-edit/:id', component: RedSocialEdit,   data: { title: 'Editar Red Social' } },

  { path: 'senefco/roles',        component: Roles,     data: { title: 'Roles' } },
  { path: 'senefco/rol-create',   component: RolCreate, data: { title: 'Nuevo Rol' } },
  { path: 'senefco/rol-edit/:id', component: RolEdit,   data: { title: 'Editar Rol' } },

  { path: 'senefco/usuarios',          component: Usuarios,      data: { title: 'Usuarios' } },
  { path: 'senefco/usuario-create',    component: UsuarioCreate, data: { title: 'Nuevo Usuario' } },
  { path: 'senefco/usuario-edit/:id',  component: UsuarioEdit,   data: { title: 'Editar Usuario' } },

  { path: 'senefco/configuraciones', component: Configuraciones, data: { title: 'Configuraciones' } },
  { path: 'senefco/mi-perfil',       component: MiPerfil,        data: { title: 'Mi Perfil' } },
  { path: 'senefco/config-sitio',    component: ConfigSitio,     data: { title: 'Configuración del Sitio' } },

  { path: 'senefco/mensajes-contacto',    component: MensajesContacto,      data: { title: 'Mensajes de Contacto' } },
  { path: 'senefco/mensaje-contacto/:id', component: MensajeContactoDetail, data: { title: 'Detalle del Mensaje' } },

  { path: 'senefco/banners',          component: Banners,      data: { title: 'Banners' } },
  { path: 'senefco/banner-create',    component: BannerCreate, data: { title: 'Nuevo Banner' } },
  { path: 'senefco/banner-edit/:id',  component: BannerEdit,   data: { title: 'Editar Banner' } },

  { path: 'senefco/cursos',         component: Cursos,      data: { title: 'Programas' } },
  { path: 'senefco/curso-create',   component: CursoCreate, data: { title: 'Nuevo Programa' } },
  { path: 'senefco/curso-edit/:id', component: CursoEdit,   data: { title: 'Editar Programa' } },

  { path: 'senefco/categorias-programa',         component: CategoriasProgramas,     data: { title: 'Categorías de Programa' } },
  { path: 'senefco/categoria-programa-create',   component: CategoriaProgramaCreate, data: { title: 'Nueva Categoría de Programa' } },
  { path: 'senefco/categoria-programa-edit/:id', component: CategoriaProgramaEdit,   data: { title: 'Editar Categoría de Programa' } },

  { path: 'senefco/tipos-programa',         component: TiposPrograma,      data: { title: 'Tipos de Programa' } },
  { path: 'senefco/tipo-programa-create',   component: TipoProgramaCreate, data: { title: 'Nuevo Tipo de Programa' } },
  { path: 'senefco/tipo-programa-edit/:id', component: TipoProgramaEdit,   data: { title: 'Editar Tipo de Programa' } },

  { path: 'senefco/preinscripciones',          component: Preinscripciones,     data: { title: 'Preinscripciones' } },
  { path: 'senefco/preinscripcion-detail/:id', component: PreinscripcionDetail, data: { title: 'Detalle de Preinscripción' } },

  { path: 'senefco/resenas',           component: Resenas,      data: { title: 'Reseñas' } },
  { path: 'senefco/resena-detail/:id', component: ResenaDetail, data: { title: 'Detalle de Reseña' } },

  { path: 'senefco/faqs',         component: Faqs,      data: { title: 'FAQs' } },
  { path: 'senefco/faq-create',   component: FaqCreate, data: { title: 'Nueva FAQ' } },
  { path: 'senefco/faq-edit/:id', component: FaqEdit,   data: { title: 'Editar FAQ' } },

  { path: 'senefco/cifras-institucionales', component: CifrasInstitucionales, data: { title: 'Cifras Institucionales' } },
  { path: 'senefco/cifra-create',           component: CifraCreate,           data: { title: 'Nueva Cifra Institucional' } },
  { path: 'senefco/cifra-edit/:id',         component: CifraEdit,             data: { title: 'Editar Cifra Institucional' } },

  { path: 'senefco/hitos-institucionales', component: HitosInstitucionales, data: { title: 'Hitos Institucionales' } },
  { path: 'senefco/hito-create',           component: HitoCreate,           data: { title: 'Nuevo Hito Institucional' } },
  { path: 'senefco/hito-edit/:id',         component: HitoEdit,             data: { title: 'Editar Hito Institucional' } },

  { path: 'senefco/expedido',          component: Expedido,       data: { title: 'Expedido' } },
  { path: 'senefco/expedido-create',   component: ExpedidoCreate, data: { title: 'Nuevo Expedido' } },
  { path: 'senefco/expedido-edit/:id', component: ExpedidoEdit,   data: { title: 'Editar Expedido' } },

  { path: 'senefco/grados-academicos',  component: GradosAcademicos, data: { title: 'Grados Académicos' } },
  { path: 'senefco/grado-create',       component: GradoCreate,      data: { title: 'Nuevo Grado Académico' } },
  { path: 'senefco/grado-edit/:id',     component: GradoEdit,        data: { title: 'Editar Grado Académico' } },

  // Nuevos módulos senefco
  { path: 'senefco/aliados',          component: Aliados,      data: { title: 'Aliados' } },
  { path: 'senefco/aliado-create',    component: AliadoCreate, data: { title: 'Nuevo Aliado' } },
  { path: 'senefco/aliado-edit/:id',  component: AliadoEdit,   data: { title: 'Editar Aliado' } },

  { path: 'senefco/testimonios',          component: Testimonios,      data: { title: 'Testimonios' } },
  { path: 'senefco/testimonio-create',    component: TestimonioCreate, data: { title: 'Nuevo Testimonio' } },
  { path: 'senefco/testimonio-edit/:id',  component: TestimonioEdit,   data: { title: 'Editar Testimonio' } },

  { path: 'senefco/notas-prensa',          component: NotasPrensa,      data: { title: 'Notas de Prensa' } },
  { path: 'senefco/nota-prensa-create',    component: NotaPrensaCreate, data: { title: 'Nueva Nota de Prensa' } },
  { path: 'senefco/nota-prensa-edit/:id',  component: NotaPrensaEdit,   data: { title: 'Editar Nota de Prensa' } },

  { path: 'senefco/descargables',          component: Descargables,      data: { title: 'Descargables' } },
  { path: 'senefco/descargable-create',    component: DescargableCreate, data: { title: 'Nuevo Descargable' } },
  { path: 'senefco/descargable-edit/:id',  component: DescargableEdit,   data: { title: 'Editar Descargable' } },

  { path: 'senefco/galeria-categorias',         component: GaleriaCategorias,      data: { title: 'Categorías de Galería' } },
  { path: 'senefco/galeria-categoria-create',   component: GaleriaCategoriaCreate, data: { title: 'Nueva Categoría de Galería' } },
  { path: 'senefco/galeria-categoria-edit/:id', component: GaleriaCategoriaEdit,   data: { title: 'Editar Categoría de Galería' } },

  { path: 'senefco/galeria-videos',          component: GaleriaVideos,      data: { title: 'Galería de Videos' } },
  { path: 'senefco/galeria-video-create',    component: GaleriaVideoCreate, data: { title: 'Nuevo Video' } },
  { path: 'senefco/galeria-video-edit/:id',  component: GaleriaVideoEdit,   data: { title: 'Editar Video' } },

  { path: 'senefco/acreditaciones',          component: Acreditaciones,     data: { title: 'Acreditaciones' } },
  { path: 'senefco/acreditacion-create',     component: AcreditacionCreate, data: { title: 'Nueva Acreditación' } },
  { path: 'senefco/acreditacion-edit/:id',   component: AcreditacionEdit,   data: { title: 'Editar Acreditación' } },

  { path: 'senefco/suscriptores', component: Suscriptores, data: { title: 'Suscriptores' } },

  { path: 'senefco/popups',          component: Popups,      data: { title: 'Popups' } },
  { path: 'senefco/popup-create',    component: PopupCreate, data: { title: 'Nuevo Popup' } },
  { path: 'senefco/popup-edit/:id',  component: PopupEdit,   data: { title: 'Editar Popup' } },

  { path: 'senefco/redirecciones',          component: Redirecciones,     data: { title: 'Redirecciones' } },
  { path: 'senefco/redireccion-create',     component: RedireccionCreate, data: { title: 'Nueva Redirección' } },
  { path: 'senefco/redireccion-edit/:id',   component: RedireccionEdit,   data: { title: 'Editar Redirección' } },

  { path: 'senefco/docentes-perfil',         component: DocentesPerfil,     data: { title: 'Docentes' } },
  { path: 'senefco/docente-perfil-create',   component: DocentePerfilCreate, data: { title: 'Nuevo Docente' } },
  { path: 'senefco/docente-perfil-edit/:id', component: DocentePerfilEdit,   data: { title: 'Editar Docente' } },

  { path: 'senefco/descuentos-promociones',   component: DescuentosPromociones, data: { title: 'Descuentos y Promociones' } },
  { path: 'senefco/descuento-create',         component: DescuentoCreate,       data: { title: 'Nuevo Descuento' } },
  { path: 'senefco/descuento-edit/:id',       component: DescuentoEdit,         data: { title: 'Editar Descuento' } },

  // Fase 1 — Contenido Web
  { path: 'senefco/articulos',         component: Articulos,      data: { title: 'Artículos' } },
  { path: 'senefco/articulo-create',   component: ArticuloCreate, data: { title: 'Nuevo Artículo' } },
  { path: 'senefco/articulo-edit/:id', component: ArticuloEdit,   data: { title: 'Editar Artículo' } },

  { path: 'senefco/boletines',         component: Boletines,     data: { title: 'Boletines' } },
  { path: 'senefco/boletin-create',    component: BoletinCreate, data: { title: 'Nuevo Boletín' } },
  { path: 'senefco/boletin-edit/:id',  component: BoletinEdit,   data: { title: 'Editar Boletín' } },

  { path: 'senefco/ayudas',            component: Ayudas,      data: { title: 'Ayudas / Soporte' } },
  { path: 'senefco/ayuda-create',      component: AyudaCreate, data: { title: 'Nueva Ayuda' } },
  { path: 'senefco/ayuda-edit/:id',    component: AyudaEdit,   data: { title: 'Editar Ayuda' } },

  // Fase 2 — Cartas y Documentos
  { path: 'senefco/cartas-modelo',             component: CartasModelo,      data: { title: 'Modelos de Cartas' } },
  { path: 'senefco/carta-modelo-create',       component: CartaModeloCreate, data: { title: 'Nuevo Modelo de Carta' } },
  { path: 'senefco/carta-modelo-edit/:id',     component: CartaModeloEdit,   data: { title: 'Editar Modelo de Carta' } },

  { path: 'senefco/cartas',                    component: Cartas,      data: { title: 'Cartas' } },
  { path: 'senefco/carta-create',              component: CartaCreate, data: { title: 'Nueva Carta' } },
  { path: 'senefco/carta-edit/:id',            component: CartaEdit,   data: { title: 'Editar Carta' } },

  { path: 'senefco/cartas-generadas',          component: CartasGeneradas,     data: { title: 'Cartas Generadas' } },
  { path: 'senefco/carta-generada-create',     component: CartaGeneradaCreate, data: { title: 'Generar Carta' } },
  { path: 'senefco/carta-generada-detail/:id', component: CartaGeneradaDetail, data: { title: 'Detalle de Carta Generada' } },

  { path: 'senefco/fotos',            component: Fotos,      data: { title: 'Galería de Fotos' } },
  { path: 'senefco/foto-create',      component: FotoCreate, data: { title: 'Nueva Foto' } },
  { path: 'senefco/foto-edit/:id',    component: FotoEdit,   data: { title: 'Editar Foto' } },

  { path: 'senefco/whatsapp-grupos',            component: WhatsappGrupos,      data: { title: 'Grupos de WhatsApp' } },
  { path: 'senefco/whatsapp-grupo-create',      component: WhatsappGrupoCreate, data: { title: 'Nuevo Grupo WhatsApp' } },
  { path: 'senefco/whatsapp-grupo-edit/:id',    component: WhatsappGrupoEdit,   data: { title: 'Editar Grupo WhatsApp' } },

  { path: 'senefco/permisos',           component: Permisos,      data: { title: 'Permisos' } },
  { path: 'senefco/permiso-create',     component: PermisoCreate, data: { title: 'Nuevo Permiso' } },
  { path: 'senefco/permiso-edit/:id',   component: PermisoEdit,   data: { title: 'Editar Permiso' } },

  // Módulo Certificados
  { path: 'senefco/certificados',                    component: Certificados,        data: { title: 'Certificados' } },
  { path: 'senefco/cert-plantillas',                 component: CertPlantillas,      data: { title: 'Plantillas de Certificado' } },
  { path: 'senefco/cert-plantilla-campos/:id',       component: CertPlantillaCampos, data: { title: 'Campos de Plantilla' } },
  { path: 'senefco/lista-aprobados',                 component: ListaAprobados,      data: { title: 'Lista de Aprobados' } },
]
