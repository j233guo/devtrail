import { Component, OnInit, inject, signal } from '@angular/core';

import { DbHealthService } from '../../../../core/services/db-health.service';
import { HealthService } from '../../../../core/services/health.service';
import type { IDbHealthResponse } from '../../models/db-health.model';
import type { IHealthResponse } from '../../models/health.model';
import { BackendStatusCard } from '../backend-status-card/backend-status-card';

@Component({
  selector: 'app-dashboard-page',
  imports: [BackendStatusCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  private readonly healthService = inject(HealthService);
  private readonly dbHealthService = inject(DbHealthService);

  protected readonly isBackendLoading = signal(true);
  protected readonly isDatabaseLoading = signal(true);
  protected readonly backendHealth = signal<IHealthResponse | null>(null);
  protected readonly dbHealth = signal<IDbHealthResponse | null>(null);
  protected readonly backendError = signal<string | null>(null);
  protected readonly databaseError = signal<string | null>(null);

  ngOnInit(): void {
    this.healthService.getHealth().subscribe({
      next: (response) => {
        this.backendHealth.set(response.data);
        this.backendError.set(null);
        this.isBackendLoading.set(false);
      },
      error: () => {
        this.backendHealth.set(null);
        this.backendError.set('Unable to reach the backend health endpoint.');
        this.isBackendLoading.set(false);
      },
    });

    this.dbHealthService.getDbHealth().subscribe({
      next: (response) => {
        this.dbHealth.set(response.data);
        this.databaseError.set(null);
        this.isDatabaseLoading.set(false);
      },
      error: () => {
        this.dbHealth.set(null);
        this.databaseError.set('Unable to reach the database health endpoint.');
        this.isDatabaseLoading.set(false);
      },
    });
  }
}
