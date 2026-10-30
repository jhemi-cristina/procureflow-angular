import { Component, computed, inject, input, signal } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import type { PurchaseRequest } from '../../core/models/purchase-request';
import { canDecide } from '../../core/purchase-requests';
import { ToastService } from '../../core/toast/toast.service';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { PurchaseRequestCommands } from './purchase-request-queries';
import { RequestDialogs } from './request-dialogs';

@Component({
  selector: 'app-request-actions',
  imports: [Button, Icon],
  template: `
    @if (request().status === 'draft') {
      <button appButton variant="ghost" size="sm" (click)="dialogs.openEdit(request())">
        <app-icon name="pencil" [size]="14" /> Editar
      </button>
      <button appButton variant="secondary" size="sm" [loading]="submitting()" (click)="submit()">
        @if (!submitting()) {
          <app-icon name="send" [size]="14" />
        }
        Enviar
      </button>
    }

    @if (request().status === 'pending' && canDecide()) {
      <button
        appButton
        variant="success"
        size="sm"
        (click)="dialogs.openDecision(request(), 'approved')"
      >
        <app-icon name="check" [size]="14" /> Aprovar
      </button>
      <button
        appButton
        variant="danger"
        size="sm"
        (click)="dialogs.openDecision(request(), 'rejected')"
      >
        <app-icon name="x" [size]="14" /> Rejeitar
      </button>
    }

    <button
      type="button"
      class="icon-action"
      title="Ver detalhes"
      [attr.aria-label]="'Ver detalhes de ' + request().title"
      (click)="dialogs.openDetails(request())"
    >
      <app-icon name="eye" [size]="16" />
    </button>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
    }
    .icon-action {
      display: grid;
      width: 32px;
      height: 32px;
      place-items: center;
      color: #8e98a9;
      background: transparent;
      border: 0;
      border-radius: var(--radius-sm);
    }
    .icon-action:hover {
      color: var(--primary-text);
      background: #f2f1ff;
    }
  `,
})
export class RequestActions {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly commands = inject(PurchaseRequestCommands);
  protected readonly dialogs = inject(RequestDialogs);

  readonly request = input.required<PurchaseRequest>();

  protected readonly submitting = signal(false);
  protected readonly canDecide = computed(() => canDecide(this.auth.user()?.role));

  protected async submit() {
    this.submitting.set(true);
    try {
      await this.commands.submit(this.request().id);
      this.toast.success('Solicitação enviada para aprovação.');
    } catch (error) {
      this.toast.error(getErrorMessage(error));
    } finally {
      this.submitting.set(false);
    }
  }
}
