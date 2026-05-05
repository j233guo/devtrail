import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.scss',
})
export class DropdownMenuComponent {
  readonly triggerLabel = input('Actions');
  protected readonly isOpen = signal(false);

  // Toggles the lightweight menu open state.
  protected toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  // Closes the menu after a projected action is selected.
  protected closeMenu(): void {
    this.isOpen.set(false);
  }
}
