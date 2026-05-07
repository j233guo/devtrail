import { Component, input, output } from '@angular/core';

import { TaskCardComponent } from '../task-card/task-card';
import type { ITask } from '../../services/tasks.service';

@Component({
  selector: 'app-task-column',
  imports: [TaskCardComponent],
  templateUrl: './task-column.html',
  styleUrl: './task-column.scss',
})
export class TaskColumnComponent {
  readonly title = input.required<string>();
  readonly status = input.required<string>();
  readonly tasks = input.required<ITask[]>();
  readonly edit = output<ITask>();
  readonly delete = output<ITask>();
  readonly archive = output<ITask>();
  readonly statusChange = output<{ task: ITask; status: string }>();

  // Emits a requested task status change to the board container.
  protected requestStatusChange(task: ITask, status: string): void {
    this.statusChange.emit({ task, status });
  }
}
