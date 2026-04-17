export interface Tramite {
  id:                      number;
  tipo_tramite_id:         number;
  unidad_responsable_id:   number;
  nombre:                  string;
  slug:                    string;
  descripcion?:            string;
  procedimiento?:          string;
  costo?:                  number;
  moneda:                  string;
  dias_habiles_resolucion?: number;
  normativa_base?:         string;
  url_formulario?:         string;
  modalidad:               'presencial' | 'virtual' | 'semipresencial';
  activo:                  boolean;
  tipo_nombre?:            string;
}

export interface TramiteListResponse {
  data:  Tramite[];
  total: number;
}

export interface TramiteListParams {
  query?:     string;
  pageIndex?: number;
  pageSize?:  number;
}

export interface TipoTramite {
  id:     number;
  nombre: string;
}

export interface TipoTramiteListResponse {
  data:  TipoTramite[];
  total: number;
}

export interface UnidadResponsable {
  id:     number;
  nombre: string;
}

export interface UnidadResponsableListResponse {
  data:  UnidadResponsable[];
  total: number;
}
