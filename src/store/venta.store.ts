import { create } from "zustand";

export type VentaItemUI = {
  productoId: string;
  nombre: string;
  modelo: string;
  color: string;
  talla: string;
  cantidad: number;
  precioUnitario: number;
  stockDisponible: number;
};

type VentaState = {
  items: VentaItemUI[];
  addItem: (item: VentaItemUI) => "added" | "stock";
  clear: () => void;
};

export const useVentaStore = create<VentaState>((set, get) => ({
  items: [],
  addItem: (nuevo) => {
    const items = get().items;
    const index = items.findIndex(
      (i) =>
        i.productoId === nuevo.productoId &&
        i.color === nuevo.color &&
        i.talla === nuevo.talla
    );

    if (index !== -1) {
      if (items[index].cantidad + 1 > items[index].stockDisponible) {
        return "stock";
      }
      const copy = [...items];
      copy[index].cantidad += 1;
      set({ items: copy });
      return "added";
    }

    set({ items: [...items, nuevo] });
    return "added";
  },
  clear: () => set({ items: [] }),
}));
