import { db } from "./database";
export type VentaRow = {
  id: string;
  payload: string;
  synced: number;
  createdAt: string;
};

export async function saveVentaOffline(payload: any) {
  await db.runAsync(
    `INSERT INTO ventas (id, payload, synced, createdAt)
     VALUES (?, ?, 0, ?)`,
    [
      crypto.randomUUID(),
      JSON.stringify(payload),
      new Date().toISOString(),
    ]
  );
}


export async function getPendingVentas(): Promise<VentaRow[]> {
  const result = await db.getAllAsync<VentaRow>(
    "SELECT * FROM ventas WHERE synced = 0"
  );
  return result;
}


export async function markVentaAsSynced(id: string) {
  await db.runAsync(
    "UPDATE ventas SET synced = 1 WHERE id = ?",
    [id]
  );
}
