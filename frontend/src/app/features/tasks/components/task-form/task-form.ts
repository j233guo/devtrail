import { Component, computed, effect, input, output, signal } from '@angular/core';

import { type ITask, type ITaskPayload, TaskPriority, TaskStatus } from '../../services/tasks.service';

// Represents a selectable task field option.
interface ITaskSelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskFormComponent {
  readonly initialTask = input<ITask | ITaskPayload | null>(null);
  readonly submitLabel = input('Save task');
  readonly formSubmit = output<ITaskPayload>();
  readonly cancel = output<void>();

  protected readonly title = signal('');
  protected readonly description = signal('');
  protected readonly status = signal<string>(TaskStatus.Todo);
  protected readonly priority = signal<string>(TaskPriority.Medium);
  protected readonly acceptanceCriteria = signal('');
  protected readonly wasSubmitted = signal(false);
  protected readonly isTitleTouched = signal(false);
  protected readonly isStatusTouched = signal(false);
  protected readonly isPriorityTouched = signal(false);
  protected readonly isFormValid = computed(
    () =>
      this.title().trim().length > 0 &&
      this.status().trim().length > 0 &&
      this.priority().trim().length > 0,
  );
  protected readonly shouldShowTitleError = computed(
    () => !this.title().trim() && (this.isTitleTouched() || this.wasSubmitted()),
  );
  protected readonly shouldShowStatusError = computed(
    () => !this.status().trim() && (this.isStatusTouched() || this.wasSubmitted()),
  );
  protected readonly shouldShowPriorityError = computed(
    () => !this.priority().trim() && (this.isPriorityTouched() || this.wasSubmitted()),
  );
  protected readonly statusOptions: ITaskSelectOption[] = [
    { label: 'Todo', value: TaskStatus.Todo },
    { label: 'In Progress', value: TaskStatus.InProgress },
    { label: 'Done', value: TaskStatus.Done },
    { label: 'Archived', value: TaskStatus.Archived },
  ];
  protected readonly priorityOptions: ITaskSelectOption[] = [
    { label: 'Low', value: TaskPriority.Low },
    { label: 'Medium', value: TaskPriority.Medium },
    { label: 'High', value: TaskPriority.High },
  ];

  constructor() {
    effect(() => {
      this.initializeForm(this.initialTask());
    });
  }

  // Updates the title signal from a text input event.
  protected updateTitle(event: Event): void {
    this.title.set(this.getInputValue(event));
  }

  // Updates the description signal from a textarea input event.
  protected updateDescription(event: Event): void {
    this.description.set(this.getInputValue(event));
  }

  // Updates the status signal from a select event.
  protected updateStatus(event: Event): void {
    this.status.set(this.getInputValue(event));
  }

  // Updates the priority signal from a select event.
  protected updatePriority(event: Event): void {
    this.priority.set(this.getInputValue(event));
  }

  // Updates the acceptance criteria signal from a textarea event.
  protected updateAcceptanceCriteria(event: Event): void {
    this.acceptanceCriteria.set(this.getInputValue(event));
  }

  // Marks the title field as touched.
  protected markTitleTouched(): void {
    this.isTitleTouched.set(true);
  }

  // Marks the status field as touched.
  protected markStatusTouched(): void {
    this.isStatusTouched.set(true);
  }

  // Marks the priority field as touched.
  protected markPriorityTouched(): void {
    this.isPriorityTouched.set(true);
  }

  // Emits a validated task payload.
  protected submitForm(): void {
    this.wasSubmitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    this.formSubmit.emit({
      title: this.title().trim(),
      description: this.description(),
      status: this.status(),
      priority: this.priority(),
      acceptance_criteria: this.acceptanceCriteria(),
    });
  }

  // Emits cancellation without changing task data.
  protected cancelForm(): void {
    this.cancel.emit();
  }

  // Reads the string value from form control events.
  private getInputValue(event: Event): string {
    return event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
      ? event.target.value
      : '';
  }

  // Initializes form values and clears validation state for create or edit mode.
  private initializeForm(task: ITask | ITaskPayload | null): void {
    this.title.set(task?.title ?? '');
    this.description.set(task?.description ?? '');
    this.status.set(task?.status?.trim() || TaskStatus.Todo);
    this.priority.set(task?.priority?.trim() || TaskPriority.Medium);
    this.acceptanceCriteria.set(task?.acceptance_criteria ?? '');
    this.clearValidationState();
  }

  // Clears touched and submitted state when the form is reset or rehydrated.
  private clearValidationState(): void {
    this.wasSubmitted.set(false);
    this.isTitleTouched.set(false);
    this.isStatusTouched.set(false);
    this.isPriorityTouched.set(false);
  }
}
