import { Component, computed, input } from '@angular/core';
import type { PurchaseRequestStatus } from '../../core/models/purchase-request';
import { STATUS_META } from '../../core/purchase-requests';

@Component({
  selector: 'app-status-badge',
  template: '<span class="dot" aria-hidden="true"></span>{{ meta().label }}',
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 9px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      border-radius: 7px;
    }
    .dot {
      width: 6px;
      height: 6px;
      flex-shrink: 0;
      background: currentColor;
      border-radius: 50%;
    }
    :host(.neutral) {
      color: #4778cb;
      background: #edf4ff;
    }
    :host(.warning) {
      color: var(--warning);
      background: var(--warning-soft);
    }
    :host(.success) {
      color: var(--success);
      background: var(--success-soft);
    }
    :host(.danger) {
      color: var(--danger);
      background: var(--danger-soft);
    }
    :host(.muted) {
      color: var(--muted);
      background: var(--border-soft);
    }
  `,
  host: { '[class]': 'meta().tone' },
})
export class StatusBadge {
  readonly status = input.required<PurchaseRequestStatus>();

  protected readonly meta = computed(() => STATUS_META[this.status()]);
}
