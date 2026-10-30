import {
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  input,
  model,
  viewChild,
} from '@angular/core';
import { Icon, type IconName } from './icon';

let nextId = 0;

@Component({
  selector: 'app-text-field',
  imports: [Icon],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
})
export class TextField {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly type = input('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string>();
  readonly inputmode = input<string>();
  readonly icon = input<IconName>();
  readonly error = input<string>();
  readonly hint = input<string>();
  readonly size = input<'md' | 'lg'>('md');
  readonly multiline = input(false, { transform: booleanAttribute });
  readonly rows = input(4);
  readonly maxlength = input<number>();
  readonly autofocus = input(false, { transform: booleanAttribute });

  protected readonly id = `field-${++nextId}`;
  protected readonly describedBy = computed(() => {
    if (this.error()) return `${this.id}-error`;
    if (this.hint()) return `${this.id}-hint`;
    return null;
  });

  private readonly control =
    viewChild<ElementRef<HTMLInputElement | HTMLTextAreaElement>>('control');

  constructor() {
    afterNextRender(() => {
      if (this.autofocus()) this.control()?.nativeElement.focus();
    });
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }
}
