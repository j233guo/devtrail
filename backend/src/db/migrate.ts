import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

import { getDb } from "./connection.js";

// Represents a named SQL migration file that can be applied once.
interface IMigration {
  name: string;
  fileName: string;
}

const initialMigrationName = "000_initial_schema";
const backendRoot = fileURLToPath(new URL("../../", import.meta.url));
const schemaPath = path.join(backendRoot, "src", "db", "schema.sql");
const migrationsPath = path.join(backendRoot, "src", "db", "migrations");

const migrations: IMigration[] = [
  {
    name: "001_create_projects",
    fileName: "001_create_projects.sql",
  },
];

// Applies the initial schema and any pending named migrations.
export function runMigrations(): void {
  const db = getDb();
  const schema = readFileSync(schemaPath, "utf8");

  db.exec(schema);

  db.prepare("INSERT OR IGNORE INTO schema_migrations (name) VALUES (?)").run(initialMigrationName);

  for (const migration of migrations) {
    const appliedMigration = db
      .prepare("SELECT name FROM schema_migrations WHERE name = ?")
      .get(migration.name);

    if (appliedMigration) {
      continue;
    }

    const migrationSql = readFileSync(path.join(migrationsPath, migration.fileName), "utf8");
    db.transaction(() => {
      db.exec(migrationSql);
      db.prepare("INSERT INTO schema_migrations (name) VALUES (?)").run(migration.name);
    })();
  }

  const latestMigrationName = migrations.at(-1)?.name ?? initialMigrationName;

  db.prepare(
    `
      INSERT INTO app_metadata (key, value, updated_at)
      VALUES ('schema_version', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `,
  ).run(latestMigrationName);
}

const executedFile = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

if (executedFile === import.meta.url) {
  runMigrations();
}
