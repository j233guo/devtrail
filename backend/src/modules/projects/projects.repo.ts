import { getDb } from "../../db/connection.js";
import type { IProject, IProjectPayload, IProjectRow } from "./projects.models.js";

// Safely parses a stored tech stack JSON string into an array of strings.
function parseTechStack(techStack: string): string[] {
  try {
    const parsedTechStack: unknown = JSON.parse(techStack);

    if (!Array.isArray(parsedTechStack)) {
      return [];
    }

    return parsedTechStack.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

// Serializes a project tech stack for SQLite storage.
function serializeTechStack(techStack: string[]): string {
  return JSON.stringify(techStack);
}

// Maps a raw SQLite project row to the API project shape.
function mapProjectRow(row: IProjectRow): IProject {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    tech_stack: parseTechStack(row.tech_stack),
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Loads all projects ordered by newest first.
export function listProjects(): IProject[] {
  const rows = getDb()
    .prepare(
      `
        SELECT id, name, description, tech_stack, status, created_at, updated_at
        FROM projects
        ORDER BY created_at DESC, id DESC
      `,
    )
    .all() as IProjectRow[];

  return rows.map(mapProjectRow);
}

// Loads a single project by id.
export function getProjectById(id: number): IProject | null {
  const row = getDb()
    .prepare(
      `
        SELECT id, name, description, tech_stack, status, created_at, updated_at
        FROM projects
        WHERE id = ?
      `,
    )
    .get(id) as IProjectRow | undefined;

  return row ? mapProjectRow(row) : null;
}

// Creates a project from a validated payload.
export function createProject(payload: IProjectPayload): IProject {
  const result = getDb()
    .prepare(
      `
        INSERT INTO projects (name, description, tech_stack, status)
        VALUES (?, ?, ?, ?)
      `,
    )
    .run(payload.name, payload.description, serializeTechStack(payload.tech_stack), payload.status);

  const project = getProjectById(Number(result.lastInsertRowid));

  if (!project) {
    throw new Error("Project was not found after creation.");
  }

  return project;
}

// Updates a project by id from a validated payload.
export function updateProject(id: number, payload: IProjectPayload): IProject | null {
  const result = getDb()
    .prepare(
      `
        UPDATE projects
        SET
          name = ?,
          description = ?,
          tech_stack = ?,
          status = ?
        WHERE id = ?
      `,
    )
    .run(payload.name, payload.description, serializeTechStack(payload.tech_stack), payload.status, id);

  if (result.changes === 0) {
    return null;
  }

  return getProjectById(id);
}

// Deletes a project by id and reports whether a row was removed.
export function deleteProject(id: number): boolean {
  const result = getDb().prepare("DELETE FROM projects WHERE id = ?").run(id);

  return result.changes > 0;
}
