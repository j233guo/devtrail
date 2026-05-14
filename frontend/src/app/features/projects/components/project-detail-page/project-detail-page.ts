import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { Subscription } from 'rxjs';

import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { TaskBoardComponent } from '../../../tasks/components/task-board/task-board';
import { ProjectFormComponent } from '../project-form/project-form';
import {
  type IProject,
  type IProjectPayload,
  ProjectsService,
} from '../../services/projects.service';

@Component({
  selector: 'app-project-detail-page',
  imports: [ModalComponent, ProjectFormComponent, TaskBoardComponent],
  templateUrl: './project-detail-page.html',
  styleUrl: './project-detail-page.scss',
})
export class ProjectDetailPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);
  private readonly toastService = inject(ToastService);
  private routeSubscription: Subscription | null = null;

  protected readonly project = signal<IProject | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isEditModalOpen = signal(false);

  // Loads the active project whenever the route project id changes.
  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const projectId = Number(params.get('project_id'));

      if (!Number.isInteger(projectId) || projectId < 1) {
        this.showNotFoundState();
        return;
      }

      this.loadProject(projectId);
    });
  }

  // Clears route subscriptions and active project state when leaving the page.
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.projectsService.setActiveProjectId(null);
  }

  // Opens the edit project modal.
  protected openEditModal(): void {
    this.isEditModalOpen.set(true);
  }

  // Closes the edit project modal.
  protected closeEditModal(): void {
    this.isEditModalOpen.set(false);
  }

  // Updates the active project, refreshes detail data, and updates sidebar state.
  protected updateProject(payload: IProjectPayload): void {
    const activeProject = this.project();

    if (!activeProject) {
      return;
    }

    this.projectsService.updateProject(activeProject.id, payload).subscribe({
      next: (response) => {
        this.project.set(response.data);
        this.projectsService.updateRecentProject(response.data);
        this.projectsService.rememberRecentProject(response.data);
        this.closeEditModal();
        this.toastService.success('Project updated.');
      },
      error: () => {
        this.errorMessage.set('Unable to update project.');
        this.toastService.error('Unable to update project.');
      },
    });
  }

  // Loads project data by id and marks it as active and recent.
  private loadProject(projectId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.project.set(null);
    this.projectsService.setActiveProjectId(projectId);

    this.projectsService.getProjectById(projectId).subscribe({
      next: (response) => {
        this.project.set(response.data);
        this.projectsService.rememberRecentProject(response.data);
        this.projectsService.setActiveProjectId(response.data.id);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotFoundState();
      },
    });
  }

  // Shows a lightweight not found state for missing or invalid projects.
  private showNotFoundState(): void {
    this.project.set(null);
    this.projectsService.setActiveProjectId(null);
    this.errorMessage.set('Project not found.');
    this.isLoading.set(false);
  }
}
