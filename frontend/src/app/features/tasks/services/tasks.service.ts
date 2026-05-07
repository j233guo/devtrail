import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import { type IApiResponse, NetworkService } from '../../../core/network/network.service';

// Defines supported task status values used by the Tasks API.
export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
  Archived = 'archived',
}

// Defines supported task priority values used by the Tasks API.
export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

// Represents a task as returned by the backend API.
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

// Represents the shared create and update payload for tasks.
export interface ITaskPayload {
  title: string;
  description: string;
  status: string;
  priority: string;
  acceptance_criteria: string;
}

// Represents the delete task response payload.
export interface IDeleteTaskResult {
  deleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly networkService = inject(NetworkService);

  // Loads all tasks for a project.
  listTasksByProjectId(project_id: number): Observable<IApiResponse<ITask[]>> {
    return this.networkService.get<ITask[]>(`/api/projects/${project_id}/tasks`);
  }

  // Loads a single task by id.
  getTaskById(task_id: number): Observable<IApiResponse<ITask>> {
    return this.networkService.get<ITask>(`/api/tasks/${task_id}`);
  }

  // Creates a task under the supplied project id.
  createTask(project_id: number, payload: ITaskPayload): Observable<IApiResponse<ITask>> {
    return this.networkService.post<ITask, ITaskPayload>(
      `/api/projects/${project_id}/tasks`,
      payload,
    );
  }

  // Updates an existing task by id.
  updateTask(task_id: number, payload: ITaskPayload): Observable<IApiResponse<ITask>> {
    return this.networkService.put<ITask, ITaskPayload>(`/api/tasks/${task_id}`, payload);
  }

  // Deletes an existing task by id.
  deleteTask(task_id: number): Observable<IApiResponse<IDeleteTaskResult>> {
    return this.networkService.delete<IDeleteTaskResult>(`/api/tasks/${task_id}`);
  }
}
