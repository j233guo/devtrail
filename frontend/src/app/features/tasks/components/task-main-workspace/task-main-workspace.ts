import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  type ITask,
  type ITaskPayload,
  TaskPriority,
  TaskStatus,
} from '../../services/tasks.service';

export type TaskSaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

@Component({
  selector: 'app-task-main-workspace',
  imports: [FormsModule],
  templateUrl: './task-main-workspace.html',
  styleUrl: './task-main-workspace.scss',
})
export class TaskMainWorkspaceComponent {
  readonly task = input.required<ITask>();
  readonly saveStatus = input.required<TaskSaveStatus>();
  readonly save = output<ITaskPayload>();
  readonly dirtyChange = output<boolean>();

  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly acceptance_criteria = signal('');
  protected readonly status = signal('');
  protected readonly priority = signal('');
  protected readonly statusOptions = [
    TaskStatus.Todo,
    TaskStatus.InProgress,
    TaskStatus.Done,
    TaskStatus.Archived,
  ];
  protected readonly priorityOptions = [TaskPriority.Low, TaskPriority.Medium, TaskPriority.High];

  constructor() {
    effect(() => {
      const task = this.task();

      this.title.set(task.title);
      this.description.set(task.description);
      this.acceptance_criteria.set(task.acceptance_criteria);
      this.status.set(task.status);
      this.priority.set(task.priority);
      this.dirtyChange.emit(false);
    });
  }

  protected get isSaveDisabled(): boolean {
    return (
      this.saveStatus() === 'saving' ||
      this.title().trim().length === 0 ||
      this.status().trim().length === 0 ||
      this.priority().trim().length === 0
    );
  }

  protected updateTitle(value: string): void {
    this.title.set(value);
    this.markDirty();
  }

  protected updateDescription(value: string): void {
    this.description.set(value);
    this.markDirty();
  }

  protected updateAcceptanceCriteria(value: string): void {
    this.acceptance_criteria.set(value);
    this.markDirty();
  }

  protected updateStatus(value: string): void {
    this.status.set(value);
    this.markDirty();
  }

  protected updatePriority(value: string): void {
    this.priority.set(value);
    this.markDirty();
  }

  protected requestSave(): void {
    if (this.isSaveDisabled) {
      return;
    }

    this.save.emit({
      title: this.title().trim(),
      description: this.description(),
      acceptance_criteria: this.acceptance_criteria(),
      status: this.status(),
      priority: this.priority(),
    });
  }

  protected saveStatusLabel(): string {
    switch (this.saveStatus()) {
      case 'saving':
        return 'Saving';
      case 'unsaved':
        return 'Unsaved changes';
      case 'error':
        return 'Save failed';
      default:
        return 'Saved';
    }
  }

  private markDirty(): void {
    this.dirtyChange.emit(true);
  }
}
