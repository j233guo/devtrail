import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, type Subscription } from 'rxjs';

import {
  type IProject,
  ProjectsService,
} from '../../../projects/services/projects.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { TaskAiPanelComponent } from '../task-ai-panel/task-ai-panel';
import {
  TaskMainWorkspaceComponent,
  type TaskSaveStatus,
} from '../task-main-workspace/task-main-workspace';
import { type ITask, type ITaskPayload, TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task-workspace-page',
  imports: [TaskAiPanelComponent, TaskMainWorkspaceComponent],
  templateUrl: './task-workspace-page.html',
  styleUrl: './task-workspace-page.scss',
})
export class TaskWorkspacePage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);
  private readonly toastService = inject(ToastService);
  private routeSubscription: Subscription | null = null;

  protected readonly project = signal<IProject | null>(null);
  protected readonly task = signal<ITask | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly saveStatus = signal<TaskSaveStatus>('saved');

  // Loads workspace data whenever project or task route params change.
  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const project_id = Number(params.get('project_id'));
      const task_id = Number(params.get('task_id'));

      if (!this.isValidRouteId(project_id) || !this.isValidRouteId(task_id)) {
        this.showNotFoundState();
        return;
      }

      this.loadWorkspace(project_id, task_id);
    });
  }

  // Clears route subscriptions and active task navigation state.
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.projectsService.setActiveProjectId(null);
    this.tasksService.setActiveTaskTitle(null);
  }

  protected markDirty(isDirty: boolean): void {
    if (isDirty && this.saveStatus() !== 'saving') {
      this.saveStatus.set('unsaved');
    }
  }

  protected saveTask(payload: ITaskPayload): void {
    const activeTask = this.task();

    if (!activeTask) {
      return;
    }

    this.saveStatus.set('saving');

    this.tasksService.updateTask(activeTask.id, payload).subscribe({
      next: (response) => {
        this.task.set(response.data);
        this.tasksService.setActiveTaskTitle(response.data.title);
        this.saveStatus.set('saved');
        this.toastService.success('Task saved.');
      },
      error: () => {
        this.saveStatus.set('error');
        this.toastService.error('Unable to save task.');
      },
    });
  }

  private loadWorkspace(project_id: number, task_id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.project.set(null);
    this.task.set(null);
    this.saveStatus.set('saved');
    this.projectsService.setActiveProjectId(project_id);
    this.tasksService.setActiveTaskTitle(null);

    forkJoin({
      project: this.projectsService.getProjectById(project_id),
      task: this.tasksService.getTaskById(task_id),
    }).subscribe({
      next: ({ project, task }) => {
        if (task.data.project_id !== project.data.id) {
          this.showNotFoundState();
          return;
        }

        this.project.set(project.data);
        this.task.set(task.data);
        this.projectsService.rememberRecentProject(project.data);
        this.projectsService.setActiveProjectId(project.data.id);
        this.tasksService.setActiveTaskTitle(task.data.title);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotFoundState();
      },
    });
  }

  private showNotFoundState(): void {
    this.project.set(null);
    this.task.set(null);
    this.projectsService.setActiveProjectId(null);
    this.tasksService.setActiveTaskTitle(null);
    this.errorMessage.set('Task workspace not found.');
    this.isLoading.set(false);
  }

  private isValidRouteId(value: number): boolean {
    return Number.isInteger(value) && value > 0;
  }
}
