export interface VarianteProducto {
  color: string;
  talla: string;
  stock: number;
  codigoBarra?: string;
  qrCode?: string;
}

export type EstadoProducto = "ACTIVO" | "INACTIVO" | "AGOTADO";

export interface Producto {
  _id: string;
  nombre: string;
  modelo: string;
  categoria?: string;
  descripcion?: string;
  marca?: string;

  sku: string;

  precioVenta: number;
  precioCosto: number;
  descuento?: number;

  imagenes?: string[];

  variantes: VarianteProducto[];

  stockTotal: number;
  stockMinimo: number;
  totalVendidos: number;

  estado: EstadoProducto;

  creadoPor?: string;

  createdAt: string;
  updatedAt: string;
}
