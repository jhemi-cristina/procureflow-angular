import { Component, computed, inject, input, output, signal } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import { formatCurrency } from '../../core/format';
import type {
  PurchaseRequest,
  PurchaseRequestDecision,
} from '../../core/models/purchase-request';
import { ToastService } from '../../core/toast/toast.service';
import { Button } from '../../shared/ui/button';
import { Modal } from '../../shared/ui/modal';
import { TextField } from '../../shared/ui/text-field';
import { PurchaseRequestCommands } from './purchase-request-queries';

const MAX_REASON_LENGTH = 1000;

@Component({
  selector: 'app-decision-dialog',
  imports: [Button, Modal, TextField],
  template: `
    <app-modal
      size="sm"
      [title]="isApproval() ? 'Aprovar solicitação' : 'Rejeitar solicitação'"
      [description]="description()"
      (closed)="closed.emit()"
    >
      <app-text-field
        label="Justificativa"
        multiline
        [placeholder]="
          isApproval()
            ? 'Opcional: registre o motivo da aprovação'
            : 'Explique ao solicitante o motivo da rejeição'
        "
        [maxlength]="maxReasonLength"
        [hint]="reason().length + '/' + maxReasonLength + ' caracteres'"
        [(value)]="reason"
      />

      <button
        appButton
        modal-footer
        variant="secondary"
        [disabled]="saving()"
        (click)="closed.emit()"
      >
        Cancelar
      </button>
      <button
        appButton
        modal-footer
        [variant]="isApproval() ? 'success' : 'danger'"
        [loading]="saving()"
        (click)="confirm()"
      >
        {{ isApproval() ? 'Confirmar aprovação' : 'Confirmar rejeição' }}
      </button>
    </app-modal>
  `,
})
export class DecisionDialog {
  private readonly toast = inject(ToastService);
  private readonly commands = inject(PurchaseRequestCommands);

  readonly request = input.required<PurchaseRequest>();
  readonly decision = input.required<PurchaseRequestDecision>();
  readonly closed = output<void>();

  protected readonly maxReasonLength = MAX_REASON_LENGTH;
  protected readonly reason = signal('');
  protected readonly saving = signal(false);
  protected readonly isApproval = computed(() => this.decision() === 'approved');
  protected readonly description = computed(
    () => `${this.request().title} · ${formatCurrency(this.request().estimatedAmount)}`,
  );

  protected async confirm() {
    this.saving.set(true);
    try {
      await this.commands.decide(this.request().id, {
        decision: this.decision(),
        reason: this.reason().trim() || undefined,
      });
      this.toast.success(this.isApproval() ? 'Solicitação aprovada.' : 'Solicitação rejeitada.');
      this.closed.emit();
    } catch (error) {
      this.toast.error(getErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }
}
