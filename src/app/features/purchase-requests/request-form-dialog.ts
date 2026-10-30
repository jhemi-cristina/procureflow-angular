import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import { fromApiAmount, toApiAmount } from '../../core/format';
import type { PurchaseRequest } from '../../core/models/purchase-request';
import { ToastService } from '../../core/toast/toast.service';
import { hasErrors, type FieldErrors } from '../../core/validation';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { Modal } from '../../shared/ui/modal';
import { TextField } from '../../shared/ui/text-field';
import { PurchaseRequestCommands } from './purchase-request-queries';

const AMOUNT_PATTERN = /^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$|^\d+(\.\d{1,2})?$/;

interface RequestFormValues {
  title: string;
  description: string;
  estimatedAmount: string;
}

function validate(values: RequestFormValues): FieldErrors<keyof RequestFormValues> {
  const errors: FieldErrors<keyof RequestFormValues> = {};
  const title = values.title.trim();
  const amount = values.estimatedAmount.trim();

  if (title.length < 3) errors.title = 'O título deve ter pelo menos 3 caracteres.';
  else if (title.length > 180) errors.title = 'O título deve ter no máximo 180 caracteres.';

  if (values.description.trim().length > 2000) {
    errors.description = 'A descrição deve ter no máximo 2000 caracteres.';
  }

  if (!AMOUNT_PATTERN.test(amount)) {
    errors.estimatedAmount = 'Informe um valor válido, ex.: 1.250,00';
  } else if (Number(toApiAmount(amount)) <= 0) {
    errors.estimatedAmount = 'O valor deve ser maior que zero.';
  } else if (Number(toApiAmount(amount)) >= 1e10) {
    errors.estimatedAmount = 'Valor acima do limite permitido.';
  }

  return errors;
}

@Component({
  selector: 'app-request-form-dialog',
  imports: [Button, Icon, Modal, TextField],
  templateUrl: './request-form-dialog.html',
  styles: `
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `,
})
export class RequestFormDialog {
  private readonly toast = inject(ToastService);
  private readonly commands = inject(PurchaseRequestCommands);

  readonly request = input<PurchaseRequest | null>(null);
  readonly closed = output<void>();

  protected readonly title = linkedSignal(() => this.request()?.title ?? '');
  protected readonly description = linkedSignal(() => this.request()?.description ?? '');
  protected readonly estimatedAmount = linkedSignal(() => {
    const request = this.request();
    return request ? fromApiAmount(request.estimatedAmount) : '';
  });

  protected readonly isEditing = computed(() => this.request() !== null);
  protected readonly saving = signal(false);
  private readonly submitted = signal(false);

  protected readonly errors = computed(() =>
    this.submitted()
      ? validate({
          title: this.title(),
          description: this.description(),
          estimatedAmount: this.estimatedAmount(),
        })
      : {},
  );

  protected async save(submit: boolean, event?: Event) {
    event?.preventDefault();
    this.submitted.set(true);
    if (hasErrors(this.errors()) || this.saving()) return;

    const request = this.request();
    const input = {
      title: this.title().trim(),
      description: this.description().trim() || undefined,
      estimatedAmount: toApiAmount(this.estimatedAmount()),
    };

    this.saving.set(true);
    try {
      if (request) {
        await this.commands.update(request.id, input, submit);
      } else {
        await this.commands.create(input, submit);
      }
      this.toast.success(
        submit
          ? 'Solicitação enviada para aprovação.'
          : request
            ? 'Rascunho atualizado.'
            : 'Rascunho salvo.',
      );
      this.closed.emit();
    } catch (error) {
      this.toast.error(getErrorMessage(error));
    } finally {
      this.saving.set(false);
    }
  }
}
