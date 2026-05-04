import { Component, OnInit, inject, signal } from '@angular/core';

import {
  type IDbHealthResponse,
  type IHealthResponse,
  NetworkService,
} from '../../../../core/network/network.service';
import { BackendStatusCard } from '../backend-status-card/backend-status-card';

@Component({
  selector: 'app-dashboard-page',
  imports: [BackendStatusCard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  private readonly networkService = inject(NetworkService);

  protected readonly isBackendLoading = signal(true);
  protected readonly isDatabaseLoading = signal(true);
  protected readonly backendHealth = signal<IHealthResponse | null>(null);
  protected readonly dbHealth = signal<IDbHealthResponse | null>(null);
  protected readonly backendError = signal<string | null>(null);
  protected readonly databaseError = signal<string | null>(null);

  // Loads health data for the dashboard status cards.
  ngOnInit(): void {
    this.networkService.getHealth().subscribe({
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

    this.networkService.getDbHealth().subscribe({
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
