// ---------- MySQL setup ----------
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT || 3306),
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
});

export const mysqlDb = drizzleMysql(mysqlPool);

// ---------- PostgreSQL setup ----------
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as PgPool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: PgPool;
};

if (!databaseUrl) {
  console.warn("DATABASE_URL is missing. PostgreSQL operations will be disabled.");
}

export const pgPool = databaseUrl
  ? globalForDb.__arenaNextJsPostgresqlPool ?? new PgPool({ connectionString: databaseUrl })
  : undefined;

if (pgPool && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pgPool;
}

export const pgDb = pgPool ? drizzlePg(pgPool) : undefined;
