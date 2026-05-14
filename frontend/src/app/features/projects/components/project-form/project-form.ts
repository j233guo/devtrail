import { Component, computed, effect, input, output, signal } from '@angular/core';

import type { IProject, IProjectPayload } from '../../services/projects.service';

// Represents a selectable project status option.
interface IProjectStatusOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectFormComponent {
  readonly initialProject = input<IProject | IProjectPayload | null>(null);
  readonly submitLabel = input('Save project');
  readonly formSubmit = output<IProjectPayload>();
  readonly cancel = output<void>();

  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly techStackText = signal('');
  protected readonly status = signal('active');
  protected readonly wasSubmitted = signal(false);
  protected readonly isNameTouched = signal(false);
  protected readonly isStatusTouched = signal(false);
  protected readonly isFormValid = computed(() => this.name().trim().length > 0 && this.status().trim().length > 0);
  protected readonly shouldShowNameError = computed(
    () => !this.name().trim() && (this.isNameTouched() || this.wasSubmitted()),
  );
  protected readonly shouldShowStatusError = computed(
    () => !this.status().trim() && (this.isStatusTouched() || this.wasSubmitted()),
  );
  protected readonly statusOptions: IProjectStatusOption[] = [
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Completed', value: 'completed' },
    { label: 'Archived', value: 'archived' },
  ];

  constructor() {
    effect(() => {
      this.initializeForm(this.initialProject());
    });
  }

  // Updates the name signal from a text input event.
  protected updateName(event: Event): void {
    this.name.set(this.getInputValue(event));
  }

  // Marks the name field as touched after blur.
  protected markNameTouched(): void {
    this.isNameTouched.set(true);
  }

  // Updates the description signal from a textarea input event.
  protected updateDescription(event: Event): void {
    this.description.set(this.getInputValue(event));
  }

  // Updates the tech stack signal from comma-separated text.
  protected updateTechStack(event: Event): void {
    this.techStackText.set(this.getInputValue(event));
  }

  // Updates the status signal from the select input.
  protected updateStatus(event: Event): void {
    this.status.set(this.getInputValue(event));
  }

  // Marks the status field as touched after blur.
  protected markStatusTouched(): void {
    this.isStatusTouched.set(true);
  }

  // Emits a validated project payload for create or update.
  protected submitForm(): void {
    this.wasSubmitted.set(true);

    if (!this.isFormValid()) {
      return;
    }

    this.formSubmit.emit({
      name: this.name().trim(),
      description: this.description(),
      tech_stack: this.parseTechStack(),
      status: this.status(),
    });
  }

  // Emits cancellation without changing project data.
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
  private initializeForm(project: IProject | IProjectPayload | null): void {
    this.name.set(project?.name ?? '');
    this.description.set(project?.description ?? '');
    this.techStackText.set(project?.tech_stack.join(', ') ?? '');
    this.status.set(project?.status?.trim() || 'active');
    this.clearValidationState();
  }

  // Clears touched and submitted state when the form is reset or rehydrated.
  private clearValidationState(): void {
    this.wasSubmitted.set(false);
    this.isNameTouched.set(false);
    this.isStatusTouched.set(false);
  }

  // Converts comma-separated tech stack text into the API string array.
  private parseTechStack(): string[] {
    return this.techStackText()
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
}
