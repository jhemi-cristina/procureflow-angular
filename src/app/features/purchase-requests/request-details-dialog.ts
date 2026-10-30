import { Component, input, output } from '@angular/core';
import type { PurchaseRequest } from '../../core/models/purchase-request';
import { BrlPipe, DateTimePipe } from '../../shared/pipes/format.pipes';
import { Modal } from '../../shared/ui/modal';
import { StatusBadge } from '../../shared/ui/status-badge';

@Component({
  selector: 'app-request-details-dialog',
  imports: [Modal, StatusBadge, BrlPipe, DateTimePipe],
  template: `
    <app-modal [title]="request().title" (closed)="closed.emit()">
      <dl class="details">
        <div>
          <dt>Status</dt>
          <dd><app-status-badge [status]="request().status" /></dd>
        </div>
        <div>
          <dt>Valor estimado</dt>
          <dd class="details-amount">{{ request().estimatedAmount | brl }}</dd>
        </div>
        <div>
          <dt>Solicitante</dt>
          <dd>{{ request().requester.name }}</dd>
        </div>
        <div>
          <dt>Criada em</dt>
          <dd>{{ request().createdAt | dateTime }}</dd>
        </div>
        @if (request().decidedAt; as decidedAt) {
          <div>
            <dt>Decisão em</dt>
            <dd>{{ decidedAt | dateTime }}</dd>
          </div>
        }
        <div class="details-wide">
          <dt>Descrição</dt>
          <dd>{{ request().description || 'Nenhuma descrição informada.' }}</dd>
        </div>
        @if (request().decisionReason) {
          <div class="details-wide">
            <dt>Justificativa da decisão</dt>
            <dd>{{ request().decisionReason }}</dd>
          </div>
        }
        <div class="details-wide">
          <dt>Identificador</dt>
          <dd class="mono">{{ request().id }}</dd>
        </div>
      </dl>
    </app-modal>
  `,
  styles: `
    .details {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px 20px;
      margin: 0;
    }
    dt {
      margin-bottom: 6px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    dd {
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-line;
    }
    .details-wide {
      grid-column: 1 / -1;
    }
    .details-amount {
      font-family: var(--font-heading);
      font-weight: 800;
    }
    .mono {
      color: var(--muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      word-break: break-all;
    }
    @media (max-width: 480px) {
      .details {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class RequestDetailsDialog {
  readonly request = input.required<PurchaseRequest>();
  readonly closed = output<void>();
}
