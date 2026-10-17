import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Singleton Postgres client (postgres.js — works great with Neon over TCP/HTTP
 * pooling). Falls back to a lazy stub when DATABASE_URL is missing so the app
 * can still build/run in local dev without a database.
 */

declare global {
  // eslint-disable-next-line no-var
  var __db: PostgresJsDatabase<typeof schema> | undefined;
}

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  const client = postgres(url, { max: 1, prepare: false });
  return drizzle(client, { schema });
}

export const db: PostgresJsDatabase<typeof schema> | undefined =
  globalThis.__db ?? createDb();
if (process.env.NODE_ENV !== "production") globalThis.__db = db;

export type DB = NonNullable<typeof db>;
export * as schema from "./schema";
