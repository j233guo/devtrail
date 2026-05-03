import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "../config/env.js";

let db: Database.Database | null = null;

const backendRoot = fileURLToPath(new URL("../../", import.meta.url));

function resolveDatabasePath(databaseUrl: string): string {
  if (path.isAbsolute(databaseUrl)) {
    return databaseUrl;
  }

  return path.resolve(backendRoot, databaseUrl);
}

export function getDb(): Database.Database {
  if (db) {
    return db;
  }

  const databasePath = resolveDatabasePath(env.DATABASE_URL);
  const databaseDirectory = path.dirname(databasePath);

  mkdirSync(databaseDirectory, { recursive: true });

  db = new Database(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  return db;
}
