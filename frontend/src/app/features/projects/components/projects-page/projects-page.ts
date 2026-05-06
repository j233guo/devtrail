import { Component, OnInit, inject, signal } from '@angular/core';

import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { ProjectCardComponent } from '../project-card/project-card';
import { ProjectFormComponent } from '../project-form/project-form';
import {
  type IProject,
  type IProjectPayload,
  ProjectsService,
} from '../../services/projects.service';

@Component({
  selector: 'app-projects-page',
  imports: [ConfirmDialogComponent, ModalComponent, ProjectCardComponent, ProjectFormComponent],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage implements OnInit {
  private readonly projectsService = inject(ProjectsService);
  private readonly toastService = inject(ToastService);

  protected readonly projects = signal<IProject[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isCreateModalOpen = signal(false);
  protected readonly isEditModalOpen = signal(false);
  protected readonly selectedProject = signal<IProject | null>(null);
  protected readonly isConfirmDeleteOpen = signal(false);
  protected readonly projectPendingDeletion = signal<IProject | null>(null);

  // Loads projects when the routed page is initialized.
  ngOnInit(): void {
    this.loadProjects();
  }

  // Opens the create project modal.
  protected openCreateModal(): void {
    this.errorMessage.set(null);
    this.isCreateModalOpen.set(true);
  }

  // Closes the create project modal.
  protected closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  // Opens the edit modal for the selected project.
  protected openEditModal(project: IProject): void {
    this.errorMessage.set(null);
    this.selectedProject.set(project);
    this.isEditModalOpen.set(true);
  }

  // Closes the edit modal and clears selected project state.
  protected closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedProject.set(null);
  }

  // Opens delete confirmation for a selected project.
  protected openDeleteDialog(project: IProject): void {
    this.errorMessage.set(null);
    this.projectPendingDeletion.set(project);
    this.isConfirmDeleteOpen.set(true);
  }

  // Closes delete confirmation without deleting data.
  protected closeDeleteDialog(): void {
    this.isConfirmDeleteOpen.set(false);
    this.projectPendingDeletion.set(null);
  }

  // Creates a project and refreshes the project list.
  protected createProject(payload: IProjectPayload): void {
    this.projectsService.createProject(payload).subscribe({
      next: () => {
        this.closeCreateModal();
        this.toastService.success('Project created.');
        this.loadProjects();
      },
      error: () => {
        this.errorMessage.set('Unable to create project.');
        this.toastService.error('Unable to create project.');
      },
    });
  }

  // Updates the selected project and refreshes the project list.
  protected updateProject(payload: IProjectPayload): void {
    const project = this.selectedProject();

    if (!project) {
      return;
    }

    this.projectsService.updateProject(project.id, payload).subscribe({
      next: (response) => {
        this.closeEditModal();
        this.projectsService.updateRecentProject(response.data);
        this.toastService.success('Project updated.');
        this.loadProjects();
      },
      error: () => {
        this.errorMessage.set('Unable to update project.');
        this.toastService.error('Unable to update project.');
      },
    });
  }

  // Deletes the pending project and refreshes the project list.
  protected confirmDeleteProject(): void {
    const project = this.projectPendingDeletion();

    if (!project) {
      return;
    }

    this.projectsService.deleteProject(project.id).subscribe({
      next: () => {
        this.closeDeleteDialog();
        this.projectsService.removeRecentProject(project.id);
        this.toastService.success('Project deleted.');
        this.loadProjects();
      },
      error: () => {
        this.errorMessage.set('Unable to delete project.');
        this.toastService.error('Unable to delete project.');
      },
    });
  }

  // Loads projects and updates page loading and error state.
  private loadProjects(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.projectsService.listProjects().subscribe({
      next: (response) => {
        this.projects.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.projects.set([]);
        this.errorMessage.set('Unable to load projects.');
        this.toastService.error('Unable to load projects.');
        this.isLoading.set(false);
      },
    });
  }
}
