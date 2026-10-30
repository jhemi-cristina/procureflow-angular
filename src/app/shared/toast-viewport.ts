import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast/toast.service';
import { Icon } from './ui/icon';

@Component({
  selector: 'app-toast-viewport',
  imports: [Icon],
  template: `
    @for (toast of toasts.toasts(); track toast.id) {
      <div class="toast" [class]="toast.tone" role="status">
        <app-icon
          class="icon"
          [name]="toast.tone === 'success' ? 'circle-check' : 'circle-alert'"
          [size]="18"
        />
        <p>{{ toast.message }}</p>
        <button
          type="button"
          class="close"
          aria-label="Fechar notificação"
          (click)="toasts.dismiss(toast.id)"
        >
          <app-icon name="x" [size]="15" />
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      position: fixed;
      z-index: 100;
      right: 20px;
      bottom: 20px;
      display: flex;
      width: min(380px, calc(100vw - 32px));
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 13px 12px 13px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-left-width: 3px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      animation: slide-in 0.2s ease-out;
    }
    p {
      flex: 1;
      margin: 1px 0 0;
      font-size: 13px;
      line-height: 1.5;
    }
    .success {
      border-left-color: var(--success);
    }
    .success .icon {
      color: var(--success);
    }
    .error {
      border-left-color: var(--danger);
    }
    .error .icon {
      color: var(--danger);
    }
    .icon {
      margin-top: 1px;
    }
    .close {
      display: grid;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      place-items: center;
      color: var(--muted);
      background: transparent;
      border: 0;
      border-radius: 6px;
    }
    .close:hover {
      color: var(--foreground);
      background: var(--surface-muted);
    }
    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
  `,
  host: { 'aria-live': 'polite' },
})
export class ToastViewport {
  protected readonly toasts = inject(ToastService);
}
