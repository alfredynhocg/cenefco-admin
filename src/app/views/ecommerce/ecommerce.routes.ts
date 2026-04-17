import { Routes } from "@angular/router";

import { Configuraciones } from "../../configuraciones/presentation/configuraciones/configuraciones";

import { Noticias }       from "../../noticias/presentation/noticias/noticias";
import { NoticiaCreate }  from "../../noticias/presentation/noticia-create/noticia-create";
import { NoticiaEdit }    from "../../noticias/presentation/noticia-edit/noticia-edit";

import { Usuarios }       from "../../usuarios/presentation/usuarios/usuarios";
import { UsuarioCreate }  from "../../usuarios/presentation/usuario-create/usuario-create";
import { UsuarioEdit }    from "../../usuarios/presentation/usuario-edit/usuario-edit";

import { WhatsappConversaciones } from "../../whatsapp/presentation/whatsapp-conversaciones/whatsapp-conversaciones";
import { WhatsappMensajes }       from "../../whatsapp/presentation/whatsapp-mensajes/whatsapp-mensajes";
import { WhatsappEnviar }         from "../../whatsapp/presentation/whatsapp-enviar/whatsapp-enviar";
import { WhatsappPlantillas }     from "../../whatsapp/presentation/whatsapp-plantillas/whatsapp-plantillas";

import { Roles }     from "../../roles/presentation/roles/roles";
import { RolCreate } from "../../roles/presentation/rol-create/rol-create";
import { RolEdit }   from "../../roles/presentation/rol-edit/rol-edit";

import { MiPerfil }    from "../../cuenta/presentation/mi-perfil/mi-perfil";
import { Etiquetas }      from "../../etiquetas/presentation/etiquetas/etiquetas";
import { EtiquetaCreate } from "../../etiquetas/presentation/etiqueta-create/etiqueta-create";
import { EtiquetaEdit }   from "../../etiquetas/presentation/etiqueta-edit/etiqueta-edit";
import { Tramites }       from "../../tramites/presentation/tramites/tramites";
import { TramiteCreate }  from "../../tramites/presentation/tramite-create/tramite-create";
import { TramiteEdit }    from "../../tramites/presentation/tramite-edit/tramite-edit";
import { TramiteSolicitudes }      from "../../tramite-solicitudes/presentation/tramite-solicitudes/tramite-solicitudes";
import { TramiteSolicitudDetalle } from "../../tramite-solicitudes/presentation/tramite-solicitud-detalle/tramite-solicitud-detalle";
import { Eventos }      from "../../eventos/presentation/eventos/eventos";
import { EventoCreate } from "../../eventos/presentation/evento-create/evento-create";
import { EventoEdit }   from "../../eventos/presentation/evento-edit/evento-edit";
import { Autoridades }        from "../../autoridades/presentation/autoridades/autoridades";
import { AutoridadCreate }    from "../../autoridades/presentation/autoridad-create/autoridad-create";
import { AutoridadEdit }      from "../../autoridades/presentation/autoridad-edit/autoridad-edit";
import { AudienciasPublicas }      from "../../audiencias-publicas/presentation/audiencias-publicas/audiencias-publicas";
import { AudienciaPublicaCreate }  from "../../audiencias-publicas/presentation/audiencia-publica-create/audiencia-publica-create";
import { AudienciaPublicaEdit }    from "../../audiencias-publicas/presentation/audiencia-publica-edit/audiencia-publica-edit";
import { RedesSociales }    from "../../redes-sociales/presentation/redes-sociales/redes-sociales";
import { RedSocialCreate }  from "../../redes-sociales/presentation/red-social-create/red-social-create";
import { RedSocialEdit }    from "../../redes-sociales/presentation/red-social-edit/red-social-edit";
import { Auditorias }       from "../../auditorias/presentation/auditorias/auditorias";
import { AuditoriaDetail }  from "../../auditorias/presentation/auditoria-detail/auditoria-detail";
import { Comunicados }      from "../../comunicados/presentation/comunicados/comunicados";
import { ComunicadoCreate } from "../../comunicados/presentation/comunicado-create/comunicado-create";
import { ComunicadoEdit }   from "../../comunicados/presentation/comunicado-edit/comunicado-edit";
import { ConfigSitio }           from "../../config-sitio/presentation/config-sitio/config-sitio";
import { ConsultasCiudadanas }  from "../../consultas-ciudadanas/presentation/consultas-ciudadanas/consultas-ciudadanas";
import { ConsultaCreate }       from "../../consultas-ciudadanas/presentation/consulta-create/consulta-create";
import { ConsultaDetail }       from "../../consultas-ciudadanas/presentation/consulta-detail/consulta-detail";
import { Directorio }                   from "../../directorio-institucional/presentation/directorio/directorio";
import { DirectorioCreate }             from "../../directorio-institucional/presentation/directorio-create/directorio-create";
import { DirectorioEdit }               from "../../directorio-institucional/presentation/directorio-edit/directorio-edit";
import { DocumentosTransparencia }      from "../../documentos-transparencia/presentation/documentos-transparencia/documentos-transparencia";
import { DocumentoTransparenciaCreate } from "../../documentos-transparencia/presentation/documento-transparencia-create/documento-transparencia-create";
import { DocumentoTransparenciaEdit }   from "../../documentos-transparencia/presentation/documento-transparencia-edit/documento-transparencia-edit";
import { EjecucionPresupuestaria }      from "../../ejecucion-presupuestaria/presentation/ejecucion-presupuestaria/ejecucion-presupuestaria";
import { EjecucionCreate }             from "../../ejecucion-presupuestaria/presentation/ejecucion-create/ejecucion-create";
import { EjecucionEdit }               from "../../ejecucion-presupuestaria/presentation/ejecucion-edit/ejecucion-edit";
import { EjesPei }                     from "../../ejes-pei/presentation/ejes-pei/ejes-pei";
import { EjePeiCreate }                from "../../ejes-pei/presentation/eje-pei-create/eje-pei-create";
import { EjePeiEdit }                  from "../../ejes-pei/presentation/eje-pei-edit/eje-pei-edit";
import { EscalaSalarial }              from "../../escala-salarial/presentation/escala-salarial/escala-salarial";
import { EscalaSalarialCreate }        from "../../escala-salarial/presentation/escala-salarial-create/escala-salarial-create";
import { EscalaSalarialEdit }          from "../../escala-salarial/presentation/escala-salarial-edit/escala-salarial-edit";
import { EstadosProyecto }             from "../../estados-proyecto/presentation/estados-proyecto/estados-proyecto";
import { EstadoProyectoCreate }        from "../../estados-proyecto/presentation/estado-proyecto-create/estado-proyecto-create";
import { EstadoProyectoEdit }          from "../../estados-proyecto/presentation/estado-proyecto-edit/estado-proyecto-edit";
import { FormulariosTramite }          from "../../formularios-tramite/presentation/formularios-tramite/formularios-tramite";
import { FormularioTramiteCreate }     from "../../formularios-tramite/presentation/formulario-tramite-create/formulario-tramite-create";
import { FormularioTramiteEdit }       from "../../formularios-tramite/presentation/formulario-tramite-edit/formulario-tramite-edit";
import { Himnos }                      from "../../himno/presentation/himnos/himnos";
import { HimnoCreate }                 from "../../himno/presentation/himno-create/himno-create";
import { HimnoEdit }                   from "../../himno/presentation/himno-edit/himno-edit";
import { Historias }                   from "../../historia-municipio/presentation/historias/historias";
import { HistoriaCreate }              from "../../historia-municipio/presentation/historia-create/historia-create";
import { HistoriaEdit }                from "../../historia-municipio/presentation/historia-edit/historia-edit";
import { Indicadores }                 from "../../indicadores-gestion/presentation/indicadores/indicadores";
import { IndicadorCreate }             from "../../indicadores-gestion/presentation/indicador-create/indicador-create";
import { IndicadorEdit }               from "../../indicadores-gestion/presentation/indicador-edit/indicador-edit";
import { Items }                       from "../../items/presentation/items/items";
import { ItemCreate }                  from "../../items/presentation/item-create/item-create";
import { ItemEdit }                    from "../../items/presentation/item-edit/item-edit";
import { Banners }                     from "../../banners/presentation/banners/banners";
import { BannerCreate }                from "../../banners/presentation/banner-create/banner-create";
import { BannerEdit }                  from "../../banners/presentation/banner-edit/banner-edit";
import { Galerias }                     from "../../multimedia/presentation/galerias/galerias";
import { GaleriaCreate }               from "../../multimedia/presentation/galeria-create/galeria-create";
import { GaleriaEdit }                 from "../../multimedia/presentation/galeria-edit/galeria-edit";
import { GaleriaItems }                from "../../multimedia/presentation/galeria-items/galeria-items";
import { Menus }                       from "../../menus/presentation/menus/menus";
import { MenuCreate }                  from "../../menus/presentation/menu-create/menu-create";
import { MenuEdit }                    from "../../menus/presentation/menu-edit/menu-edit";
import { MenuItems }                   from "../../menu-items/presentation/menu-items/menu-items";
import { MenuItemCreate }              from "../../menu-items/presentation/menu-item-create/menu-item-create";
import { MenuItemEdit }                from "../../menu-items/presentation/menu-item-edit/menu-item-edit";
import { DecretosMunicipales }         from "../../decretos-municipales/presentation/decretos-municipales/decretos-municipales";
import { DecretoMunicipalCreate }      from "../../decretos-municipales/presentation/decreto-municipal-create/decreto-municipal-create";
import { DecretoMunicipalEdit }        from "../../decretos-municipales/presentation/decreto-municipal-edit/decreto-municipal-edit";
import { InformesAuditoria }           from "../../informes-auditoria/presentation/informes-auditoria/informes-auditoria";
import { InformeAuditoriaCreate }      from "../../informes-auditoria/presentation/informe-auditoria-create/informe-auditoria-create";
import { InformeAuditoriaEdit }        from "../../informes-auditoria/presentation/informe-auditoria-edit/informe-auditoria-edit";
import { MensajesContacto }            from "../../mensajes-contacto/presentation/mensajes-contacto/mensajes-contacto";
import { MensajeContactoDetail }       from "../../mensajes-contacto/presentation/mensaje-contacto-detail/mensaje-contacto-detail";
import { Cursos }      from "../../cursos/presentation/cursos/cursos";
import { CursoCreate } from "../../cursos/presentation/curso-create/curso-create";
import { CursoEdit }   from "../../cursos/presentation/curso-edit/curso-edit";
import { CategoriasProgramas }    from "../../categorias-programa/presentation/categorias-programa/categorias-programa";
import { CategoriaProgramaCreate } from "../../categorias-programa/presentation/categoria-programa-create/categoria-programa-create";
import { CategoriaProgramaEdit }  from "../../categorias-programa/presentation/categoria-programa-edit/categoria-programa-edit";
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
import { Secretarias }      from "../../secretarias/presentation/secretarias/secretarias";
import { SecretariaCreate } from "../../secretarias/presentation/secretaria-create/secretaria-create";
import { SecretariaEdit }   from "../../secretarias/presentation/secretaria-edit/secretaria-edit";
import { Subcenefcos }      from "../../subcenefcos/presentation/subcenefcos/subcenefcos";
import { SubcenefcoCreate } from "../../subcenefcos/presentation/subcenefco-create/subcenefco-create";
import { SubcenefcoEdit }   from "../../subcenefcos/presentation/subcenefco-edit/subcenefco-edit";
import { SugerenciasReclamos } from "../../sugerencias-reclamos/presentation/sugerencias-reclamos/sugerencias-reclamos";
import { SugerenciaDetail }    from "../../sugerencias-reclamos/presentation/sugerencia-detail/sugerencia-detail";

export const ECOMMERCE_ROUTES: Routes = [
  { path: 'senefco/whatsapp-conversaciones',       component: WhatsappConversaciones, data: { title: 'Conversaciones WhatsApp' } },
  { path: 'senefco/whatsapp-mensajes/:id',          component: WhatsappMensajes,       data: { title: 'Mensajes WhatsApp' } },
  { path: 'senefco/whatsapp-enviar',                component: WhatsappEnviar,         data: { title: 'Enviar Mensaje WhatsApp' } },
  { path: 'senefco/whatsapp-plantillas',            component: WhatsappPlantillas,     data: { title: 'Plantillas WhatsApp' } },

  { path: 'senefco/noticias',          component: Noticias,      data: { title: 'Noticias' } },
  { path: 'senefco/noticia-create',    component: NoticiaCreate, data: { title: 'Nueva Noticia' } },
  { path: 'senefco/noticia-edit/:id',  component: NoticiaEdit,   data: { title: 'Editar Noticia' } },

  { path: 'senefco/eventos',              component: Eventos,      data: { title: 'Eventos' } },
  { path: 'senefco/evento-create',        component: EventoCreate, data: { title: 'Nuevo Evento' } },
  { path: 'senefco/evento-edit/:id',      component: EventoEdit,   data: { title: 'Editar Evento' } },

  { path: 'senefco/autoridades',           component: Autoridades,    data: { title: 'Autoridades' } },
  { path: 'senefco/autoridad-create',      component: AutoridadCreate, data: { title: 'Nueva Autoridad' } },
  { path: 'senefco/autoridad-edit/:id',    component: AutoridadEdit,  data: { title: 'Editar Autoridad' } },

  { path: 'senefco/audiencias-publicas',        component: AudienciasPublicas,     data: { title: 'Audiencias Públicas' } },
  { path: 'senefco/audiencia-publica-create',   component: AudienciaPublicaCreate, data: { title: 'Nueva Audiencia Pública' } },
  { path: 'senefco/audiencia-publica-edit/:id', component: AudienciaPublicaEdit,   data: { title: 'Editar Audiencia Pública' } },

  { path: 'senefco/tramites',                        component: Tramites,                data: { title: 'Trámites' } },
  { path: 'senefco/tramite-create',                  component: TramiteCreate,           data: { title: 'Nuevo Trámite' } },
  { path: 'senefco/tramite-edit/:id',                component: TramiteEdit,             data: { title: 'Editar Trámite' } },
  { path: 'senefco/tramite-solicitudes',             component: TramiteSolicitudes,      data: { title: 'Seguimiento de Trámites' } },
  { path: 'senefco/tramite-solicitud/:id',           component: TramiteSolicitudDetalle, data: { title: 'Detalle de Solicitud' } },

  { path: 'senefco/etiquetas',         component: Etiquetas,      data: { title: 'Etiquetas' } },
  { path: 'senefco/etiqueta-create',   component: EtiquetaCreate, data: { title: 'Nueva Etiqueta' } },
  { path: 'senefco/etiqueta-edit/:id', component: EtiquetaEdit,   data: { title: 'Editar Etiqueta' } },

  { path: 'senefco/redes-sociales',      component: RedesSociales,   data: { title: 'Redes Sociales' } },
  { path: 'senefco/red-social-create',   component: RedSocialCreate, data: { title: 'Nueva Red Social' } },
  { path: 'senefco/red-social-edit/:id', component: RedSocialEdit,   data: { title: 'Editar Red Social' } },

  { path: 'senefco/roles',           component: Roles,     data: { title: 'Roles' } },
  { path: 'senefco/rol-create',      component: RolCreate, data: { title: 'Nuevo Rol' } },
  { path: 'senefco/rol-edit/:id',    component: RolEdit,   data: { title: 'Editar Rol' } },

  { path: 'senefco/usuarios',             component: Usuarios,      data: { title: 'Usuarios' } },
  { path: 'senefco/usuario-create',       component: UsuarioCreate, data: { title: 'Nuevo Usuario' } },
  { path: 'senefco/usuario-edit/:id',     component: UsuarioEdit,   data: { title: 'Editar Usuario' } },

  { path: 'senefco/configuraciones', component: Configuraciones, data: { title: 'Configuraciones' } },

  { path: 'senefco/mi-perfil', component: MiPerfil, data: { title: 'Mi Perfil' } },

  { path: 'senefco/auditorias',           component: Auditorias,      data: { title: 'Auditorías' } },
  { path: 'senefco/auditoria-detail/:id', component: AuditoriaDetail, data: { title: 'Detalle de Auditoría' } },

  { path: 'senefco/comunicados',           component: Comunicados,      data: { title: 'Comunicados' } },
  { path: 'senefco/comunicado-create',     component: ComunicadoCreate, data: { title: 'Nuevo Comunicado' } },
  { path: 'senefco/comunicado-edit/:id',   component: ComunicadoEdit,   data: { title: 'Editar Comunicado' } },

  { path: 'senefco/config-sitio', component: ConfigSitio, data: { title: 'Configuración del Sitio' } },

  { path: 'senefco/consultas-ciudadanas',       component: ConsultasCiudadanas, data: { title: 'Consultas Ciudadanas' } },
  { path: 'senefco/consulta-create',            component: ConsultaCreate,      data: { title: 'Nueva Consulta' } },
  { path: 'senefco/consulta-detail/:id',        component: ConsultaDetail,      data: { title: 'Detalle de Consulta' } },

  { path: 'senefco/directorio-institucional',   component: Directorio,      data: { title: 'Directorio Institucional' } },
  { path: 'senefco/directorio-create',          component: DirectorioCreate, data: { title: 'Nueva Entrada del Directorio' } },
  { path: 'senefco/directorio-edit/:id',        component: DirectorioEdit,  data: { title: 'Editar Entrada del Directorio' } },

  { path: 'senefco/documentos-transparencia',          component: DocumentosTransparencia,      data: { title: 'Documentos de Transparencia' } },
  { path: 'senefco/documento-transparencia-create',    component: DocumentoTransparenciaCreate, data: { title: 'Nuevo Documento de Transparencia' } },
  { path: 'senefco/documento-transparencia-edit/:id',  component: DocumentoTransparenciaEdit,   data: { title: 'Editar Documento de Transparencia' } },

  { path: 'senefco/ejecucion-presupuestaria',  component: EjecucionPresupuestaria, data: { title: 'Ejecución Presupuestaria' } },
  { path: 'senefco/ejecucion-create',          component: EjecucionCreate,         data: { title: 'Nuevo Registro de Ejecución' } },
  { path: 'senefco/ejecucion-edit/:id',        component: EjecucionEdit,           data: { title: 'Editar Ejecución Presupuestaria' } },

  { path: 'senefco/ejes-pei',         component: EjesPei,      data: { title: 'Ejes PEI' } },
  { path: 'senefco/eje-pei-create',   component: EjePeiCreate, data: { title: 'Nuevo Eje PEI' } },
  { path: 'senefco/eje-pei-edit/:id', component: EjePeiEdit,   data: { title: 'Editar Eje PEI' } },

  { path: 'senefco/escala-salarial',            component: EscalaSalarial,       data: { title: 'Escala Salarial' } },
  { path: 'senefco/escala-salarial-create',     component: EscalaSalarialCreate, data: { title: 'Nuevo Registro Salarial' } },
  { path: 'senefco/escala-salarial-edit/:id',   component: EscalaSalarialEdit,   data: { title: 'Editar Escala Salarial' } },

  { path: 'senefco/estados-proyecto',             component: EstadosProyecto,      data: { title: 'Estado de Proyectos' } },
  { path: 'senefco/estado-proyecto-create',       component: EstadoProyectoCreate, data: { title: 'Nuevo Proyecto' } },
  { path: 'senefco/estado-proyecto-edit/:id',     component: EstadoProyectoEdit,   data: { title: 'Editar Proyecto' } },

  { path: 'senefco/formularios-tramite',             component: FormulariosTramite,      data: { title: 'Formularios de Trámites' } },
  { path: 'senefco/formulario-tramite-create',       component: FormularioTramiteCreate, data: { title: 'Nuevo Formulario' } },
  { path: 'senefco/formulario-tramite-edit/:id',     component: FormularioTramiteEdit,   data: { title: 'Editar Formulario' } },

  { path: 'senefco/himnos',             component: Himnos,       data: { title: 'Himnos' } },
  { path: 'senefco/himno-create',       component: HimnoCreate,  data: { title: 'Nuevo Himno' } },
  { path: 'senefco/himno-edit/:id',     component: HimnoEdit,    data: { title: 'Editar Himno' } },

  { path: 'senefco/historia-municipio',        component: Historias,      data: { title: 'Historia del Municipio' } },
  { path: 'senefco/historia-create',           component: HistoriaCreate, data: { title: 'Nueva Entrada Histórica' } },
  { path: 'senefco/historia-edit/:id',         component: HistoriaEdit,   data: { title: 'Editar Entrada Histórica' } },

  { path: 'senefco/indicadores-gestion',       component: Indicadores,     data: { title: 'Indicadores de Gestión' } },
  { path: 'senefco/indicador-create',          component: IndicadorCreate, data: { title: 'Nuevo Indicador' } },
  { path: 'senefco/indicador-edit/:id',        component: IndicadorEdit,   data: { title: 'Editar Indicador' } },

  { path: 'senefco/items',         component: Items,      data: { title: 'Ítems' } },
  { path: 'senefco/item-create',   component: ItemCreate, data: { title: 'Nuevo Ítem' } },
  { path: 'senefco/item-edit/:id', component: ItemEdit,   data: { title: 'Editar Ítem' } },

  { path: 'senefco/banners',           component: Banners,      data: { title: 'Banners' } },
  { path: 'senefco/banner-create',     component: BannerCreate, data: { title: 'Nuevo Banner' } },
  { path: 'senefco/banner-edit/:id',   component: BannerEdit,   data: { title: 'Editar Banner' } },

  { path: 'senefco/multimedia', redirectTo: 'senefco/galerias', pathMatch: 'full' },
  { path: 'senefco/galerias',                    component: Galerias,      data: { title: 'Galerías' } },
  { path: 'senefco/galeria-create',                component: GaleriaCreate, data: { title: 'Nueva Galería' } },
  { path: 'senefco/galeria-edit/:id',              component: GaleriaEdit,   data: { title: 'Editar Galería' } },
  { path: 'senefco/galeria-items/:galeriaId',      component: GaleriaItems,  data: { title: 'Archivos de la Galería' } },

  { path: 'senefco/menus',              component: Menus,       data: { title: 'Menús del Portal' } },
  { path: 'senefco/menu-create',        component: MenuCreate,  data: { title: 'Nuevo Menú' } },
  { path: 'senefco/menu-edit/:id',      component: MenuEdit,    data: { title: 'Editar Menú' } },
  { path: 'senefco/menu-items/:menuId', component: MenuItems,   data: { title: 'Ítems del Menú' } },
  { path: 'senefco/menu-item-create/:menuId', component: MenuItemCreate, data: { title: 'Nuevo Ítem' } },
  { path: 'senefco/menu-item-edit/:id',       component: MenuItemEdit,   data: { title: 'Editar Ítem' } },

  { path: 'senefco/decretos-municipales',          component: DecretosMunicipales,    data: { title: 'Decretos Municipales' } },
  { path: 'senefco/decreto-municipal-create',      component: DecretoMunicipalCreate, data: { title: 'Nuevo Decreto Municipal' } },
  { path: 'senefco/decreto-municipal-edit/:id',    component: DecretoMunicipalEdit,   data: { title: 'Editar Decreto Municipal' } },

  { path: 'senefco/informes-auditoria',            component: InformesAuditoria,      data: { title: 'Informes de Auditoría' } },
  { path: 'senefco/informe-auditoria-create',      component: InformeAuditoriaCreate, data: { title: 'Nuevo Informe de Auditoría' } },
  { path: 'senefco/informe-auditoria-edit/:id',    component: InformeAuditoriaEdit,   data: { title: 'Editar Informe de Auditoría' } },

  { path: 'senefco/mensajes-contacto',         component: MensajesContacto,      data: { title: 'Mensajes de Contacto' } },
  { path: 'senefco/mensaje-contacto/:id',      component: MensajeContactoDetail, data: { title: 'Detalle del Mensaje' } },

  { path: 'senefco/cursos',         component: Cursos,      data: { title: 'Cursos' } },
  { path: 'senefco/curso-create',   component: CursoCreate, data: { title: 'Nuevo Curso' } },
  { path: 'senefco/curso-edit/:id', component: CursoEdit,   data: { title: 'Editar Curso' } },

  { path: 'senefco/categorias-programa',              component: CategoriasProgramas,    data: { title: 'Categorías de Programa' } },
  { path: 'senefco/categoria-programa-create',        component: CategoriaProgramaCreate, data: { title: 'Nueva Categoría de Programa' } },
  { path: 'senefco/categoria-programa-edit/:id',      component: CategoriaProgramaEdit,  data: { title: 'Editar Categoría de Programa' } },

  { path: 'senefco/preinscripciones',           component: Preinscripciones,     data: { title: 'Preinscripciones' } },
  { path: 'senefco/preinscripcion-detail/:id',  component: PreinscripcionDetail, data: { title: 'Detalle de Preinscripción' } },

  { path: 'senefco/resenas',             component: Resenas,      data: { title: 'Reseñas' } },
  { path: 'senefco/resena-detail/:id',   component: ResenaDetail, data: { title: 'Detalle de Reseña' } },

  { path: 'senefco/faqs',           component: Faqs,      data: { title: 'FAQs' } },
  { path: 'senefco/faq-create',     component: FaqCreate, data: { title: 'Nueva FAQ' } },
  { path: 'senefco/faq-edit/:id',   component: FaqEdit,   data: { title: 'Editar FAQ' } },

  { path: 'senefco/cifras-institucionales',      component: CifrasInstitucionales, data: { title: 'Cifras Institucionales' } },
  { path: 'senefco/cifra-create',               component: CifraCreate,           data: { title: 'Nueva Cifra Institucional' } },
  { path: 'senefco/cifra-edit/:id',             component: CifraEdit,             data: { title: 'Editar Cifra Institucional' } },

  { path: 'senefco/hitos-institucionales',       component: HitosInstitucionales, data: { title: 'Hitos Institucionales' } },
  { path: 'senefco/hito-create',                component: HitoCreate,           data: { title: 'Nuevo Hito Institucional' } },
  { path: 'senefco/hito-edit/:id',              component: HitoEdit,             data: { title: 'Editar Hito Institucional' } },

  { path: 'senefco/expedido',              component: Expedido,       data: { title: 'Expedido' } },
  { path: 'senefco/expedido-create',       component: ExpedidoCreate, data: { title: 'Nuevo Expedido' } },
  { path: 'senefco/expedido-edit/:id',     component: ExpedidoEdit,   data: { title: 'Editar Expedido' } },

  { path: 'senefco/grados-academicos',     component: GradosAcademicos, data: { title: 'Grados Académicos' } },
  { path: 'senefco/grado-create',          component: GradoCreate,      data: { title: 'Nuevo Grado Académico' } },
  { path: 'senefco/grado-edit/:id',        component: GradoEdit,        data: { title: 'Editar Grado Académico' } },

  { path: 'senefco/secretarias',            component: Secretarias,      data: { title: 'Secretarías' } },
  { path: 'senefco/secretaria-create',      component: SecretariaCreate, data: { title: 'Nueva Secretaría' } },
  { path: 'senefco/secretaria-edit/:id',    component: SecretariaEdit,   data: { title: 'Editar Secretaría' } },

  { path: 'senefco/subcenefcos',            component: Subcenefcos,      data: { title: 'SubCENEFCOs' } },
  { path: 'senefco/subcenefco-create',      component: SubcenefcoCreate, data: { title: 'Nuevo SubCENEFCO' } },
  { path: 'senefco/subcenefco-edit/:id',    component: SubcenefcoEdit,   data: { title: 'Editar SubCENEFCO' } },

  { path: 'senefco/sugerencias-reclamos',   component: SugerenciasReclamos, data: { title: 'Sugerencias y Reclamos' } },
  { path: 'senefco/sugerencia-detail/:id',  component: SugerenciaDetail,    data: { title: 'Detalle de Sugerencia' } },
]
