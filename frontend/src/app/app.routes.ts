import { Routes } from '@angular/router';

import { DashboardPage } from './features/dashboard/components/dashboard-page/dashboard-page';
import { ProjectDetailPage } from './features/projects/components/project-detail-page/project-detail-page';
import { ProjectsPage } from './features/projects/components/projects-page/projects-page';
import { SettingsPage } from './features/settings/components/settings-page/settings-page';
import { TaskWorkspacePage } from './features/tasks/components/task-workspace-page/task-workspace-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardPage,
  },
  {
    path: 'projects',
    component: ProjectsPage,
  },
  {
    path: 'projects/:project_id/tasks/:task_id',
    component: TaskWorkspacePage,
  },
  {
    path: 'projects/:project_id',
    component: ProjectDetailPage,
  },
  {
    path: 'settings',
    component: SettingsPage,
  },
];
