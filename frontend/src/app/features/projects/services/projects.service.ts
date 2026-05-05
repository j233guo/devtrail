import { inject, Injectable } from '@angular/core';
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
}
