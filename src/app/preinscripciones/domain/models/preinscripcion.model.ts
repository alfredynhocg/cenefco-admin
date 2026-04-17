export interface Preinscripcion {
  id:                    number;
  programa_id:           number | null;
  nombre:                string;
  apellido_paterno:      string | null;
  apellido_materno:      string | null;
  ci:                    string | null;
  expedido_id:           number | null;
  expedido_nombre:       string | null;
  grado_academico_id:    number | null;
  grado_academico_nombre: string | null;
  grado_abreviatura:     string | null;
  email:                 string;
  telefono:              string | null;
  ciudad:                string | null;
  provincia:             string | null;
  profesion:             string | null;
  medio_pago:            string | null;
  monto_pagado:          number | null;
  mensaje:               string | null;
  estado:                string;
  notificado:            boolean;
  fecha_notificacion:    string | null;
  origen:                string | null;
  sugerencia_curso:      string | null;
  recomendar_docente:    boolean;
  detalle_docente:       string | null;
  created_at:            string | null;
}

export interface PreinscripcionListResponse { data: Preinscripcion[]; total: number; }
export interface PreinscripcionListParams   { query?: string; estado?: string; programa_id?: number; pageIndex?: number; pageSize?: number; refresh?: number; }
