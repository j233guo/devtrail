import { Routes } from '@angular/router';

import { DashboardPage } from './features/dashboard/components/dashboard-page/dashboard-page';
import { ProjectsPage } from './features/projects/components/projects-page/projects-page';
import { SettingsPage } from './features/settings/components/settings-page/settings-page';

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
    path: 'settings',
    component: SettingsPage,
  },
];
