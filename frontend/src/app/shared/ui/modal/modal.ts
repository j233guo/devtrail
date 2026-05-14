import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class ModalComponent {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly closeRequest = output<void>();

  // Emits a close request when the user interacts with dismiss controls.
  protected requestClose(): void {
    this.closeRequest.emit();
  }
}
