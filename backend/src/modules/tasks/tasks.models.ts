// Represents a task as exposed by the API.
export interface ITask {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  acceptance_criteria: string;
  created_at: string;
  updated_at: string;
}

// Represents a raw task row returned from SQLite.
export interface ITaskRow {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  acceptance_criteria: string;
  created_at: string;
  updated_at: string;
}

// Represents the shared create and update payload for tasks.
export interface ITaskPayload {
  title: string;
  description: string;
  status: string;
  priority: string;
  acceptance_criteria: string;
}

// Represents the delete response payload for a task.
export interface IDeleteTaskResult {
  deleted: boolean;
}
