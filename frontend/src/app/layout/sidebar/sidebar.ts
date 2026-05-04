import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  type IDbHealthResponse,
  type IHealthResponse,
  NetworkService,
} from '../../core/network/network.service';

// Represents a temporary recent project entry for the sidebar preview.
interface IRecentProjectPlaceholder {
  name: string;
  status: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  readonly isCollapsed = input.required<boolean>();
  readonly toggleSidebar = output<void>();

  private readonly networkService = inject(NetworkService);

  protected readonly isProjectsExpanded = signal(true);
  protected readonly isHealthLoading = signal(true);
  protected readonly healthError = signal<string | null>(null);
  protected readonly backendHealth = signal<IHealthResponse | null>(null);
  protected readonly dbHealth = signal<IDbHealthResponse | null>(null);
  protected readonly recentProjects = signal<IRecentProjectPlaceholder[]>([
    { name: 'DevTrail core', status: 'active' },
    { name: 'Local planning', status: 'queued' },
    { name: 'UI foundation', status: 'draft' },
  ]);

  // Loads backend and database health for the sidebar status panel.
  ngOnInit(): void {
    this.loadHealth();
  }

  // Emits a layout-level sidebar toggle request.
  protected requestSidebarToggle(): void {
    this.toggleSidebar.emit();
  }

  // Toggles the placeholder Projects section.
  protected toggleProjects(): void {
    this.isProjectsExpanded.update((isExpanded) => !isExpanded);
  }

  // Loads health data through the shared NetworkService.
  private loadHealth(): void {
    this.networkService.getHealth().subscribe({
      next: (response) => {
        this.backendHealth.set(response.data);
        this.healthError.set(null);
        this.finishHealthLoadIfReady();
      },
      error: () => {
        this.backendHealth.set(null);
        this.healthError.set('Health unavailable');
        this.isHealthLoading.set(false);
      },
    });

    this.networkService.getDbHealth().subscribe({
      next: (response) => {
        this.dbHealth.set(response.data);
        this.healthError.set(null);
        this.finishHealthLoadIfReady();
      },
      error: () => {
        this.dbHealth.set(null);
        this.healthError.set('Health unavailable');
        this.isHealthLoading.set(false);
      },
    });
  }

  // Finishes the health loading state once both health responses have arrived.
  private finishHealthLoadIfReady(): void {
    if (this.backendHealth() && this.dbHealth()) {
      this.isHealthLoading.set(false);
    }
  }
}
