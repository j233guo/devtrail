import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DropdownMenuComponent } from '../../../../shared/ui/dropdown-menu/dropdown-menu';
import type { IProject } from '../../services/projects.service';

@Component({
  selector: 'app-project-card',
  imports: [DropdownMenuComponent, RouterLink],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCardComponent {
  readonly project = input.required<IProject>();
  readonly edit = output<IProject>();
  readonly delete = output<IProject>();

  // Emits the selected project for parent-controlled editing.
  protected requestEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.project());
  }

  // Emits the selected project for parent-controlled delete confirmation.
  protected requestDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.project());
  }

  // Formats the best available project timestamp for display.
  protected formatProjectDate(project: IProject): string {
    const date = new Date(project.updated_at || project.created_at);

    if (Number.isNaN(date.getTime())) {
      return project.updated_at || project.created_at;
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
