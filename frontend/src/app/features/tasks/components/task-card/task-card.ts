import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

import { DropdownMenuComponent } from '../../../../shared/ui/dropdown-menu/dropdown-menu';
import { type ITask, TaskStatus } from '../../services/tasks.service';

@Component({
  selector: 'app-task-card',
  imports: [DropdownMenuComponent],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCardComponent {
  private readonly router = inject(Router);

  readonly task = input.required<ITask>();
  readonly edit = output<ITask>();
  readonly delete = output<ITask>();
  readonly archive = output<ITask>();
  readonly markTodo = output<ITask>();
  readonly markInProgress = output<ITask>();
  readonly markDone = output<ITask>();
  protected readonly TaskStatus = TaskStatus;

  // Navigates to the editable task workspace.
  protected openWorkspace(): void {
    const task = this.task();

    this.router.navigate(['/projects', task.project_id, 'tasks', task.id]);
  }

  // Emits the task for parent-controlled editing.
  protected requestEdit(): void {
    this.edit.emit(this.task());
  }

  // Emits the task for parent-controlled deletion.
  protected requestDelete(): void {
    this.delete.emit(this.task());
  }

  // Emits the task for parent-controlled archiving.
  protected requestArchive(): void {
    this.archive.emit(this.task());
  }

  // Emits the task for parent-controlled movement to Todo.
  protected requestMarkTodo(): void {
    this.markTodo.emit(this.task());
  }

  // Emits the task for parent-controlled movement to In Progress.
  protected requestMarkInProgress(): void {
    this.markInProgress.emit(this.task());
  }

  // Emits the task for parent-controlled movement to Done.
  protected requestMarkDone(): void {
    this.markDone.emit(this.task());
  }

  // Formats the best available task timestamp for display.
  protected formatTaskDate(task: ITask): string {
    const date = new Date(task.updated_at || task.created_at);

    if (Number.isNaN(date.getTime())) {
      return task.updated_at || task.created_at;
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
