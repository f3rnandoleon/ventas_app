import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("ventas.db");

export function initDB() {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS ventas (
      id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      createdAt TEXT
    );
  `);
}
