import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) throw new Error("DATABASE_URL is required");
  const client = postgres(connectionString, { max: 1 });
  _db = drizzle(client, { schema });
  return _db;
}

// Proxy que inicializa la conexión solo cuando se accede a una propiedad
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
});

export type DB = ReturnType<typeof getDb>;
