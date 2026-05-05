import { Component, DestroyRef, ElementRef, Renderer2, inject, input, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.scss',
})
export class DropdownMenuComponent {
  readonly triggerLabel = input('Actions');
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private removeDocumentClickListener: (() => void) | null = null;
  private removeDocumentKeydownListener: (() => void) | null = null;
  protected readonly isOpen = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.removeDocumentListeners());
  }

  // Toggles the lightweight menu open state.
  protected toggleMenu(): void {
    if (this.isOpen()) {
      this.closeMenu();
      return;
    }

    this.openMenu();
  }

  // Closes the menu after a projected action is selected.
  protected closeMenu(): void {
    this.isOpen.set(false);
    this.removeDocumentListeners();
  }

  // Opens the menu and attaches temporary document listeners.
  private openMenu(): void {
    this.isOpen.set(true);
    this.addDocumentListeners();
  }

  // Adds listeners for outside click and Escape dismissal.
  private addDocumentListeners(): void {
    this.removeDocumentListeners();

    const clickHandler = (event: MouseEvent) => {
      if (!this.elementRef.nativeElement.contains(event.target as Node)) {
        this.closeMenu();
      }
    };

    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeMenu();
      }
    };

    this.removeDocumentClickListener = this.renderer.listen('document', 'click', clickHandler);
    this.removeDocumentKeydownListener = this.renderer.listen('document', 'keydown', keydownHandler);
  }

  // Removes document listeners to avoid leaking global handlers.
  private removeDocumentListeners(): void {
    this.removeDocumentClickListener?.();
    this.removeDocumentKeydownListener?.();
    this.removeDocumentClickListener = null;
    this.removeDocumentKeydownListener = null;
  }
}
