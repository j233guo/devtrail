import { Component, OnInit, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

// Represents display metadata for a routed page.
interface IRouteDisplay {
  title: string;
  subtitle: string;
  showProjectAction: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);

  protected readonly pageDisplay = signal<IRouteDisplay>(this.getRouteDisplay(this.router.url));

  // Keeps navbar copy in sync with the active route.
  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.pageDisplay.set(this.getRouteDisplay(this.router.url));
    });
  }

  // Maps the current URL to navbar title, subtitle, and actions.
  private getRouteDisplay(url: string): IRouteDisplay {
    if (url.startsWith('/projects')) {
      return {
        title: 'Projects',
        subtitle: 'Project list and create UI will be added next.',
        showProjectAction: true,
      };
    }

    if (url.startsWith('/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Workspace preferences and theme controls will live here later.',
        showProjectAction: false,
      };
    }

    return {
      title: 'Dashboard',
      subtitle: 'Your local-first development workspace at a glance.',
      showProjectAction: false,
    };
  }
}
