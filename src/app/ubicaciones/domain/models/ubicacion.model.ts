export interface Ubicacion {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface UbicacionListResponse {
  data: Ubicacion[];
  total: number;
}
