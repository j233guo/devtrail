// Represents a project as exposed by the API.
export interface IProject {
  id: number;
  name: string;
  description: string;
  tech_stack: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

// Represents a raw project row returned from SQLite.
export interface IProjectRow {
  id: number;
  name: string;
  description: string;
  tech_stack: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Represents the shared create and update payload for projects.
export interface IProjectPayload {
  name: string;
  description: string;
  tech_stack: string[];
  status: string;
}

// Represents the delete response payload for a project.
export interface IProjectDeleteResponse {
  deleted: boolean;
}
