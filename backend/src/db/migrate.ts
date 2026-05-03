import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

import { getDb } from "./connection.js";

const migrationName = "000_initial_schema";
const backendRoot = fileURLToPath(new URL("../../", import.meta.url));
const schemaPath = path.join(backendRoot, "src", "db", "schema.sql");

export function runMigrations(): void {
  const db = getDb();
  const schema = readFileSync(schemaPath, "utf8");

  db.exec(schema);

  db.prepare("INSERT OR IGNORE INTO schema_migrations (name) VALUES (?)").run(migrationName);
  db.prepare(
    `
      INSERT INTO app_metadata (key, value, updated_at)
      VALUES ('schema_version', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `,
  ).run(migrationName);
}

const executedFile = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

if (executedFile === import.meta.url) {
  runMigrations();
}
