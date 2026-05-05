import { Injectable, signal } from '@angular/core';

// Defines supported toast presentation types.
export enum ToastType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

// Represents a toast notification rendered in the global toast stack.
export interface IToast {
  id: number;
  type: ToastType;
  message: string;
  title?: string;
  durationMs: number;
}

// Represents optional configuration for creating a toast notification.
export interface IToastOptions {
  title?: string;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextToastId = 1;
  private readonly defaultDurationMs = 3000;
  private readonly toastStack = signal<IToast[]>([]);

  readonly toasts = this.toastStack.asReadonly();

  // Shows a toast of the requested type and schedules dismissal.
  show(type: ToastType, message: string, options: IToastOptions = {}): number {
    const id = this.nextToastId;
    this.nextToastId += 1;

    const toast: IToast = {
      id,
      type,
      message,
      title: options.title,
      durationMs: options.durationMs ?? this.defaultDurationMs,
    };

    this.toastStack.update((toasts) => [...toasts, toast]);
    window.setTimeout(() => this.dismiss(id), toast.durationMs);

    return id;
  }

  // Shows a success toast.
  success(message: string, options?: IToastOptions): number {
    return this.show(ToastType.Success, message, options);
  }

  // Shows an informational toast.
  info(message: string, options?: IToastOptions): number {
    return this.show(ToastType.Info, message, options);
  }

  // Shows a warning toast.
  warning(message: string, options?: IToastOptions): number {
    return this.show(ToastType.Warning, message, options);
  }

  // Shows an error toast.
  error(message: string, options?: IToastOptions): number {
    return this.show(ToastType.Error, message, options);
  }

  // Removes a toast from the active stack.
  dismiss(id: number): void {
    this.toastStack.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }
}
