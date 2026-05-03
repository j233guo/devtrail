import { Component, input } from '@angular/core';

@Component({
  selector: 'app-backend-status-card',
  templateUrl: './backend-status-card.html',
  styleUrl: './backend-status-card.css',
})
export class BackendStatusCard {
  readonly title = input.required<string>();
  readonly isLoading = input.required<boolean>();
  readonly error = input<string | null>(null);
  readonly status = input<string | null>(null);
  readonly label = input.required<string>();
  readonly value = input<string | null>(null);
}
