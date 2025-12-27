export type TipoInventario =
  | "ENTRADA"
  | "SALIDA"
  | "AJUSTE"
  | "DEVOLUCION";

export interface Inventario {
  _id: string;

  productoId: string;

  variante: {
    color: string;
    talla: string;
  };

  tipo: TipoInventario;
  cantidad: number;

  stockAnterior: number;
  stockActual: number;

  motivo?: string;
  referencia?: string;

  usuario: string;

  createdAt: string;
}

/* Vista poblada para UI */
export interface InventarioView {
  _id: string;

  producto: {
    _id: string;
    nombre: string;
    modelo?: string;
  };

  variante: {
    color: string;
    talla: string;
  };

  tipo: TipoInventario;
  cantidad: number;

  stockAnterior: number;
  stockActual: number;

  motivo?: string;
  referencia?: string;

  usuario?: {
    fullname: string;
    email: string;
  };

  createdAt: string;
}
