export interface VentaItem {
  productoId: string;

  variante: {
    color: string;
    talla: string;
  };

  cantidad: number;
  precioUnitario: number;
  precioCosto: number;
  ganancia: number;
}

export type MetodoPago = "EFECTIVO" | "QR";
export type TipoVenta = "WEB" | "APP_QR" | "TIENDA";
export type EstadoVenta = "PAGADA" | "PENDIENTE" | "CANCELADA";

export interface Venta {
  _id: string;
  numeroVenta: string;

  items: VentaItem[];

  subtotal: number;
  descuento: number;
  total: number;

  gananciaTotal: number;

  metodoPago: MetodoPago;
  tipoVenta: TipoVenta;
  estado: EstadoVenta;

  vendedor?: {
    _id: string;
    fullname: string;
    email: string;
  };

  cliente?: string;

  observaciones?: string;

  createdAt: string;
}

/* DTOs */
export interface VentaFormItem {
  productoId: string;
  productoNombre?: string;
  color: string;
  talla: string;
  stockDisponible: number;
  cantidad: number;
}

export interface CreateVentaItemDTO {
  productoId: string;
  color: string;
  talla: string;
  cantidad: number;
}

export interface CreateVentaDTO {
  items: CreateVentaItemDTO[];
  metodoPago: MetodoPago;
  tipoVenta: TipoVenta;
}
