import { Component, input, output } from '@angular/core';

import { ModalComponent } from '../modal/modal';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ModalComponent],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialogComponent {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly danger = input(false);
  readonly confirm = output<void>();
  readonly cancel = output<void>();

  // Emits confirmation without performing the destructive action directly.
  protected requestConfirm(): void {
    this.confirm.emit();
  }

  // Emits cancellation for the parent to close the dialog.
  protected requestCancel(): void {
    this.cancel.emit();
  }
}
