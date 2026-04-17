export interface Role {
  id: number;
  nombre: string;
  descripcion: string | null;
  permisos: string[];
  activo: boolean;
  created_at?: string;
}

export const PERMISOS_DISPONIBLES: { modulo: string; icon: string; permisos: { key: string; label: string }[] }[] = [
  {
    modulo: 'Ventas',
    icon: 'lucideShoppingCart',
    permisos: [
      { key: 'ventas.ver',    label: 'Ver ventas' },
      { key: 'ventas.crear',  label: 'Crear ventas' },
      { key: 'ventas.anular', label: 'Anular ventas' },
    ],
  },
  {
    modulo: 'Caja',
    icon: 'lucideLandmark',
    permisos: [
      { key: 'caja.ver',    label: 'Ver caja' },
      { key: 'caja.abrir',  label: 'Abrir caja' },
      { key: 'caja.cerrar', label: 'Cerrar caja' },
    ],
  },
  {
    modulo: 'Inventario',
    icon: 'lucideWarehouse',
    permisos: [
      { key: 'inventario.ver',   label: 'Ver inventario' },
      { key: 'inventario.mover', label: 'Mover inventario' },
    ],
  },
  {
    modulo: 'Compras',
    icon: 'lucideTruck',
    permisos: [
      { key: 'compras.ver',   label: 'Ver compras' },
      { key: 'compras.crear', label: 'Crear compras' },
    ],
  },
  {
    modulo: 'Usuarios',
    icon: 'lucideUserCog',
    permisos: [
      { key: 'usuarios.ver',      label: 'Ver usuarios' },
      { key: 'usuarios.crear',    label: 'Crear usuarios' },
      { key: 'usuarios.editar',   label: 'Editar usuarios' },
      { key: 'usuarios.eliminar', label: 'Eliminar usuarios' },
    ],
  },
  {
    modulo: 'Reportes',
    icon: 'lucideBarChart2',
    permisos: [
      { key: 'reportes.ver', label: 'Ver reportes' },
    ],
  },
];
