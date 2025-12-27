export type TipoReporte =
  | "VENTAS_DIARIAS"
  | "VENTAS_MENSUALES"
  | "VENTAS_ANUALES"
  | "PRODUCTOS_MAS_VENDIDOS"
  | "GANANCIAS"
  | "INVENTARIO";

export interface ReportePeriodo {
  fecha?: string;
  mes?: number;
  anio?: number;
}

export interface ReporteDetalle {
  productoId?: string;
  nombreProducto?: string;
  modelo?: string;
  color?: string;
  talla?: string;
  cantidadVendida?: number;
  totalVendido?: number;
  ganancia?: number;
}

export interface Reporte {
  _id?: string;

  tipo: TipoReporte;

  periodo?: ReportePeriodo;

  resumen?: {
    totalVentas?: number;
    cantidadVentas?: number;
    gananciaTotal?: number;
  };

  detalle?: ReporteDetalle[];

  porMetodoPago?: {
    efectivo?: number;
    tarjeta?: number;
    qr?: number;
    transferencia?: number;
  };

  porTipoVenta?: {
    web?: number;
    appQr?: number;
    mostrador?: number;
  };

  generadoAutomaticamente?: boolean;

  createdAt?: string;
  updatedAt?: string;
}
