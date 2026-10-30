import { Injectable, signal } from '@angular/core';

export type ToastTone = 'success' | 'error';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

const TOAST_DURATION_MS = 4500;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private readonly state = signal<Toast[]>([]);

  readonly toasts = this.state.asReadonly();

  success(message: string) {
    this.push('success', message);
  }

  error(message: string) {
    this.push('error', message);
  }

  dismiss(id: number) {
    this.state.update((current) => current.filter((toast) => toast.id !== id));
  }

  private push(tone: ToastTone, message: string) {
    const id = ++this.nextId;
    this.state.update((current) => [...current.slice(-2), { id, tone, message }]);
    setTimeout(() => this.dismiss(id), TOAST_DURATION_MS);
  }
}
