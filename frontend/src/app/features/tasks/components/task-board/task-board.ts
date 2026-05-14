import { Component, computed, effect, inject, input, signal } from '@angular/core';

import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { ModalComponent } from '../../../../shared/ui/modal/modal';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { TaskCardComponent } from '../task-card/task-card';
import { TaskColumnComponent } from '../task-column/task-column';
import { TaskFormComponent } from '../task-form/task-form';
import { type ITask, type ITaskPayload, TaskStatus, TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-task-board',
  imports: [
    ConfirmDialogComponent,
    ModalComponent,
    TaskCardComponent,
    TaskColumnComponent,
    TaskFormComponent,
  ],
  templateUrl: './task-board.html',
  styleUrl: './task-board.scss',
})
export class TaskBoardComponent {
  readonly project_id = input.required<number>();

  private readonly tasksService = inject(TasksService);
  private readonly toastService = inject(ToastService);
  private lastLoadedProjectId: number | null = null;

  protected readonly tasks = signal<ITask[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isCreateModalOpen = signal(false);
  protected readonly isEditModalOpen = signal(false);
  protected readonly selectedTask = signal<ITask | null>(null);
  protected readonly isConfirmDeleteOpen = signal(false);
  protected readonly taskPendingDeletion = signal<ITask | null>(null);
  protected readonly isArchivedModalOpen = signal(false);
  protected readonly TaskStatus = TaskStatus;
  protected readonly todoTasks = computed(() => this.tasksForStatus(TaskStatus.Todo));
  protected readonly inProgressTasks = computed(() => this.tasksForStatus(TaskStatus.InProgress));
  protected readonly doneTasks = computed(() => this.tasksForStatus(TaskStatus.Done));
  protected readonly archivedTasks = computed(() => this.tasksForStatus(TaskStatus.Archived));

  constructor() {
    effect(() => {
      const projectId = this.project_id();

      if (projectId !== this.lastLoadedProjectId) {
        this.lastLoadedProjectId = projectId;
        this.loadTasks();
      }
    });
  }

  // Opens the create task modal.
  protected openCreateModal(): void {
    this.errorMessage.set(null);
    this.isCreateModalOpen.set(true);
  }

  // Closes the create task modal.
  protected closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  // Opens the edit task modal with the selected task.
  protected openEditModal(task: ITask): void {
    this.errorMessage.set(null);
    this.isArchivedModalOpen.set(false);
    this.selectedTask.set(task);
    this.isEditModalOpen.set(true);
  }

  // Closes the edit task modal and clears selected task state.
  protected closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedTask.set(null);
  }

  // Opens delete confirmation for a selected task.
  protected openDeleteDialog(task: ITask): void {
    this.errorMessage.set(null);
    this.isArchivedModalOpen.set(false);
    this.taskPendingDeletion.set(task);
    this.isConfirmDeleteOpen.set(true);
  }

  // Closes delete confirmation without deleting data.
  protected closeDeleteDialog(): void {
    this.isConfirmDeleteOpen.set(false);
    this.taskPendingDeletion.set(null);
  }

  // Opens the archived tasks modal.
  protected openArchivedModal(): void {
    this.isArchivedModalOpen.set(true);
  }

  // Closes the archived tasks modal.
  protected closeArchivedModal(): void {
    this.isArchivedModalOpen.set(false);
  }

  // Creates a task and refreshes the board.
  protected createTask(payload: ITaskPayload): void {
    this.tasksService.createTask(this.project_id(), payload).subscribe({
      next: () => {
        this.closeCreateModal();
        this.toastService.success('Task created.');
        this.loadTasks();
      },
      error: () => {
        this.errorMessage.set('Unable to create task.');
        this.toastService.error('Unable to create task.');
      },
    });
  }

  // Updates the selected task and refreshes the board.
  protected updateTask(payload: ITaskPayload): void {
    const task = this.selectedTask();

    if (!task) {
      return;
    }

    this.tasksService.updateTask(task.id, payload).subscribe({
      next: () => {
        this.closeEditModal();
        this.toastService.success('Task updated.');
        this.loadTasks();
      },
      error: () => {
        this.errorMessage.set('Unable to update task.');
        this.toastService.error('Unable to update task.');
      },
    });
  }

  // Changes a task status using the existing task data.
  protected changeTaskStatus(event: { task: ITask; status: string }): void {
    this.updateTaskStatus(event.task, event.status);
  }

  // Archives a task using the existing task data.
  protected archiveTask(task: ITask): void {
    this.updateTaskStatus(task, TaskStatus.Archived);
  }

  // Restores an archived task to Todo.
  protected restoreTask(task: ITask): void {
    this.updateTaskStatus(task, TaskStatus.Todo);
  }

  // Deletes the pending task and refreshes the board.
  protected confirmDeleteTask(): void {
    const task = this.taskPendingDeletion();

    if (!task) {
      return;
    }

    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        this.closeDeleteDialog();
        this.toastService.success('Task deleted.');
        this.loadTasks();
      },
      error: () => {
        this.errorMessage.set('Unable to delete task.');
        this.toastService.error('Unable to delete task.');
      },
    });
  }

  // Loads tasks for the current project and updates board state.
  private loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.tasksService.listTasksByProjectId(this.project_id()).subscribe({
      next: (response) => {
        this.tasks.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.tasks.set([]);
        this.errorMessage.set('Unable to load tasks.');
        this.toastService.error('Unable to load tasks.');
        this.isLoading.set(false);
      },
    });
  }

  // Returns tasks that match the supplied status.
  private tasksForStatus(status: TaskStatus): ITask[] {
    return this.tasks().filter((task) => task.status === status);
  }

  // Updates a task with a new status while preserving all other task fields.
  private updateTaskStatus(task: ITask, status: string): void {
    if (task.status === status) {
      return;
    }

    const payload: ITaskPayload = {
      title: task.title,
      description: task.description,
      status,
      priority: task.priority,
      acceptance_criteria: task.acceptance_criteria,
    };

    this.tasksService.updateTask(task.id, payload).subscribe({
      next: () => {
        this.toastService.success('Task status updated.');
        this.loadTasks();
      },
      error: () => {
        this.errorMessage.set('Unable to update task status.');
        this.toastService.error('Unable to update task status.');
      },
    });
  }
}
