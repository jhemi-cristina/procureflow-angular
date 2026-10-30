import { Component, input, output } from '@angular/core';
import { Button } from './button';
import { Icon, type IconName } from './icon';

const STATE_STYLES = `
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 36px 20px;
    text-align: center;
  }
  strong {
    font-family: var(--font-heading);
    font-size: 14px;
  }
  p {
    max-width: 360px;
    margin: 0 0 6px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
  }
  .state-icon {
    display: grid;
    width: 46px;
    height: 46px;
    margin-bottom: 4px;
    place-items: center;
    color: var(--primary);
    background: var(--primary-soft);
    border-radius: 13px;
  }
`;

@Component({
  selector: 'app-spinner',
  imports: [Icon],
  template: `
    <app-icon name="loader-circle" class="spinner" [size]="20" />
    <span>{{ label() }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      font-size: 13px;
    }
    .spinner {
      color: var(--primary);
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
  host: { role: 'status' },
})
export class Spinner {
  readonly label = input('Carregando...');
}

@Component({
  selector: 'app-loading-state',
  imports: [Spinner],
  template: '<app-spinner [label]="label()" />',
  styles: STATE_STYLES,
})
export class LoadingState {
  readonly label = input('Carregando...');
}

@Component({
  selector: 'app-empty-state',
  imports: [Icon],
  template: `
    <span class="state-icon"><app-icon [name]="icon()" [size]="22" /></span>
    <strong>{{ title() }}</strong>
    @if (description()) {
      <p>{{ description() }}</p>
    }
    <ng-content />
  `,
  styles: STATE_STYLES,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly icon = input<IconName>('inbox');
}

@Component({
  selector: 'app-error-state',
  imports: [Button, EmptyState],
  template: `
    <app-empty-state
      icon="circle-alert"
      title="Não foi possível carregar os dados"
      [description]="message()"
    >
      <button appButton variant="secondary" size="sm" (click)="retry.emit()">
        Tentar novamente
      </button>
    </app-empty-state>
  `,
})
export class ErrorState {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
