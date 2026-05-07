import { getDb } from "../../db/connection.js";
import type { ITask, ITaskPayload, ITaskRow } from "./tasks.models.js";

// Maps a raw SQLite task row to the API task shape.
function mapTaskRow(row: ITaskRow): ITask {
  return {
    id: row.id,
    project_id: row.project_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    acceptance_criteria: row.acceptance_criteria,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Loads all tasks for a project ordered by newest first.
export function listTasksByProjectId(project_id: number): ITask[] {
  const rows = getDb()
    .prepare(
      `
        SELECT id, project_id, title, description, status, priority, acceptance_criteria, created_at, updated_at
        FROM tasks
        WHERE project_id = ?
        ORDER BY created_at DESC, id DESC
      `,
    )
    .all(project_id) as ITaskRow[];

  return rows.map(mapTaskRow);
}

// Loads a single task by id.
export function getTaskById(task_id: number): ITask | null {
  const row = getDb()
    .prepare(
      `
        SELECT id, project_id, title, description, status, priority, acceptance_criteria, created_at, updated_at
        FROM tasks
        WHERE id = ?
      `,
    )
    .get(task_id) as ITaskRow | undefined;

  return row ? mapTaskRow(row) : null;
}

// Creates a task for a project from a validated payload.
export function createTask(project_id: number, payload: ITaskPayload): ITask {
  const result = getDb()
    .prepare(
      `
        INSERT INTO tasks (project_id, title, description, status, priority, acceptance_criteria)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      project_id,
      payload.title,
      payload.description,
      payload.status,
      payload.priority,
      payload.acceptance_criteria,
    );

  const task = getTaskById(Number(result.lastInsertRowid));

  if (!task) {
    throw new Error("Task was not found after creation.");
  }

  return task;
}

// Updates a task by id from a validated payload.
export function updateTask(task_id: number, payload: ITaskPayload): ITask | null {
  const result = getDb()
    .prepare(
      `
        UPDATE tasks
        SET
          title = ?,
          description = ?,
          status = ?,
          priority = ?,
          acceptance_criteria = ?
        WHERE id = ?
      `,
    )
    .run(
      payload.title,
      payload.description,
      payload.status,
      payload.priority,
      payload.acceptance_criteria,
      task_id,
    );

  if (result.changes === 0) {
    return null;
  }

  return getTaskById(task_id);
}

// Deletes a task by id and reports whether a row was removed.
export function deleteTask(task_id: number): boolean {
  const result = getDb().prepare("DELETE FROM tasks WHERE id = ?").run(task_id);

  return result.changes > 0;
}
