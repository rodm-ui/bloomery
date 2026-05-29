import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// only create pool if DATABASE_URL exists
export const pool = databaseUrl
  ? globalForDb.__arenaNextJsPostgresqlPool ?? new Pool({ connectionString: databaseUrl })
  : undefined;

// save global pool in dev
if (databaseUrl && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

// export drizzle instance only if pool exists
export const db = pool ? drizzle(pool) : undefined;
