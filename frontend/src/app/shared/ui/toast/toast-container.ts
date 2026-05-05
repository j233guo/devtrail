import { Component, inject } from '@angular/core';

import { type IToast, ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
  protected readonly ToastType = ToastType;

  // Dismisses a toast by id when the user clicks its close button.
  protected dismissToast(toast: IToast): void {
    this.toastService.dismiss(toast.id);
  }
}
