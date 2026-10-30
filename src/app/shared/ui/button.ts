import { Component, booleanAttribute, computed, input } from '@angular/core';
import { Icon } from './icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'button[appButton], a[appButton]',
  imports: [Icon],
  template: `
    @if (loading()) {
      <app-icon name="loader-circle" class="spinner" [size]="16" />
    }
    <ng-content />
  `,
  styleUrl: './button.css',
  host: {
    '[class]': 'classes()',
    '[attr.type]': 'type()',
    '[attr.disabled]': "disabled() || loading() ? '' : null",
    '[attr.aria-busy]': 'loading() || null',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(
    () => `${this.variant()} ${this.size()}${this.fullWidth() ? ' full-width' : ''}`,
  );
}
