import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-shell',
  imports: [NavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShellComponent {
  protected readonly isSidebarCollapsed = signal(false);

  // Toggles the shell sidebar between expanded and compact layouts.
  protected toggleSidebar(): void {
    this.isSidebarCollapsed.update((isCollapsed) => !isCollapsed);
  }
}
