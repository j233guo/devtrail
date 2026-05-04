import { Component, signal } from '@angular/core';

// Represents a dashboard placeholder metric before real feature data exists.
interface IDashboardMetric {
  label: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  protected readonly metrics = signal<IDashboardMetric[]>([
    {
      label: 'Active projects',
      value: 'Soon',
      description: 'Projects CRUD will connect here next.',
    },
    {
      label: 'Recent tasks',
      value: 'Later',
      description: 'Task planning arrives after Projects.',
    },
    {
      label: 'AI runs',
      value: 'Future',
      description: 'AI activity stays out until the planned phase.',
    },
  ]);
}
