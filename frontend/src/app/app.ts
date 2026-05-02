import { Component, OnInit, inject, signal } from '@angular/core';

import { HealthApi, HealthResponse } from './core/api/health.api';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly healthApi = inject(HealthApi);

  protected readonly isLoading = signal(true);
  protected readonly health = signal<HealthResponse | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.healthApi.getHealth().subscribe({
      next: (health) => {
        this.health.set(health);
        this.error.set(null);
        this.isLoading.set(false);
      },
      error: () => {
        this.health.set(null);
        this.error.set('Unable to reach the backend health endpoint.');
        this.isLoading.set(false);
      },
    });
  }
}
