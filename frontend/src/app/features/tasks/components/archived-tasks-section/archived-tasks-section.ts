import { Component, input, output } from '@angular/core';

import { TaskCardComponent } from '../task-card/task-card';
import type { ITask } from '../../services/tasks.service';

@Component({
  selector: 'app-archived-tasks-section',
  imports: [TaskCardComponent],
  templateUrl: './archived-tasks-section.html',
  styleUrl: './archived-tasks-section.scss',
})
export class ArchivedTasksSectionComponent {
  readonly tasks = input.required<ITask[]>();
  readonly isExpanded = input.required<boolean>();
  readonly toggle = output<void>();
  readonly edit = output<ITask>();
  readonly delete = output<ITask>();
  readonly restore = output<ITask>();

  // Emits a request to toggle archived task visibility.
  protected requestToggle(): void {
    this.toggle.emit();
  }
}
