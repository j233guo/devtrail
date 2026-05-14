import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { ProjectsService } from '../../features/projects/services/projects.service';
import { TasksService } from '../../features/tasks/services/tasks.service';

// Represents display metadata for a routed page.
interface IRouteDisplay {
  title: string;
  subtitle: string;
  crumbs: string[];
  backLink: string | null;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);

  private readonly currentUrl = signal(this.router.url);
  protected readonly pageDisplay = computed(() => this.getRouteDisplay(this.currentUrl()));

  // Keeps navbar copy in sync with the active route.
  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  // Maps the current URL to navbar title, subtitle, and actions.
  private getRouteDisplay(url: string): IRouteDisplay {
    if (url.startsWith('/projects')) {
      const segments = url.split('?')[0].split('/').filter(Boolean);
      const projectId = Number(segments[1]);
      const activeProject = this.projectsService
        .recent_projects()
        .find((project) => project.id === this.projectsService.active_project_id() || project.id === projectId);

      if (segments.length >= 4 && segments[2] === 'tasks') {
        const projectName = activeProject?.name ?? 'Project';
        const taskTitle = this.tasksService.active_task_title() ?? 'Task Workspace';

        return {
          title: taskTitle,
          subtitle: 'Task workspace',
          crumbs: ['Projects', projectName, taskTitle],
          backLink: Number.isInteger(projectId) ? `/projects/${projectId}` : '/projects',
        };
      }

      if (activeProject && url !== '/projects') {
        return {
          title: activeProject.name,
          subtitle: 'Project workspace',
          crumbs: ['Projects', activeProject.name],
          backLink: '/projects',
        };
      }

      return {
        title: 'Projects',
        subtitle: 'Project list and create UI will be added next.',
        crumbs: ['Projects'],
        backLink: null,
      };
    }

    if (url.startsWith('/settings')) {
      return {
        title: 'Settings',
        subtitle: 'Workspace preferences and theme controls will live here later.',
        crumbs: ['Settings'],
        backLink: null,
      };
    }

    return {
      title: 'Dashboard',
      subtitle: 'Your local-first development workspace at a glance.',
      crumbs: ['Dashboard'],
      backLink: null,
    };
  }
}
