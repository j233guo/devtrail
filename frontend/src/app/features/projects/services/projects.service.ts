import { inject, Injectable, signal } from '@angular/core';
import type { Observable } from 'rxjs';

import { type IApiResponse, NetworkService } from '../../../core/network/network.service';

// Represents a project as returned by the backend API.
export interface IProject {
  id: number;
  name: string;
  description: string;
  tech_stack: string[];
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

// Represents the delete project response payload.
export interface IDeleteProjectResult {
  deleted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly networkService = inject(NetworkService);
  private readonly recentProjectsState = signal<IProject[]>([]);
  private readonly activeProjectIdState = signal<number | null>(null);

  readonly recent_projects = this.recentProjectsState.asReadonly();
  readonly active_project_id = this.activeProjectIdState.asReadonly();

  // Loads all projects from the backend.
  listProjects(): Observable<IApiResponse<IProject[]>> {
    return this.networkService.get<IProject[]>('/api/projects');
  }

  // Loads a single project by id.
  getProjectById(id: number): Observable<IApiResponse<IProject>> {
    return this.networkService.get<IProject>(`/api/projects/${id}`);
  }

  // Creates a project with the supplied payload.
  createProject(payload: IProjectPayload): Observable<IApiResponse<IProject>> {
    return this.networkService.post<IProject, IProjectPayload>('/api/projects', payload);
  }

  // Updates an existing project by id.
  updateProject(id: number, payload: IProjectPayload): Observable<IApiResponse<IProject>> {
    return this.networkService.put<IProject, IProjectPayload>(`/api/projects/${id}`, payload);
  }

  // Deletes an existing project by id.
  deleteProject(id: number): Observable<IApiResponse<IDeleteProjectResult>> {
    return this.networkService.delete<IDeleteProjectResult>(`/api/projects/${id}`);
  }

  // Remembers a project as recently visited, keeping the newest visit first.
  rememberRecentProject(project: IProject): void {
    this.recentProjectsState.update((projects) => [
      project,
      ...projects.filter((recentProject) => recentProject.id !== project.id),
    ].slice(0, 5));
  }

  // Removes a project from the in-memory recent project list.
  removeRecentProject(project_id: number): void {
    this.recentProjectsState.update((projects) =>
      projects.filter((project) => project.id !== project_id),
    );

    if (this.activeProjectIdState() === project_id) {
      this.setActiveProjectId(null);
    }
  }

  // Sets the active project id for navigation highlights.
  setActiveProjectId(project_id: number | null): void {
    this.activeProjectIdState.set(project_id);
  }

  // Updates a remembered project if it already exists in recent projects.
  updateRecentProject(project: IProject): void {
    this.recentProjectsState.update((projects) =>
      projects.map((recentProject) => (recentProject.id === project.id ? project : recentProject)),
    );
  }
}
