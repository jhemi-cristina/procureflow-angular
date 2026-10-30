import { Component, computed, input } from '@angular/core';
import { getInitials } from '../../core/format';

const TONES = ['purple', 'blue', 'pink', 'orange', 'green'] as const;

function toneFor(name: string) {
  const hash = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  return TONES[hash % TONES.length];
}

@Component({
  selector: 'app-avatar',
  template: '{{ initials() }}',
  styles: `
    :host {
      display: inline-grid;
      flex-shrink: 0;
      place-items: center;
      font-weight: 700;
      border-radius: 10px;
    }
    :host(.sm) {
      width: 30px;
      height: 30px;
      font-size: 10px;
      border-radius: 9px;
    }
    :host(.md) {
      width: 36px;
      height: 36px;
      font-size: 11px;
    }
    :host(.lg) {
      width: 40px;
      height: 40px;
      font-size: 12px;
      border-radius: 11px;
    }
    :host(.solid) {
      color: #fff;
      background: linear-gradient(145deg, #8c83f8, #6558e8);
    }
    :host(.purple) {
      color: #6558e8;
      background: #eeecff;
    }
    :host(.blue) {
      color: #287ac9;
      background: #e5f2ff;
    }
    :host(.pink) {
      color: #c34f90;
      background: #ffedf6;
    }
    :host(.orange) {
      color: #c47b20;
      background: #fff2df;
    }
    :host(.green) {
      color: #15966a;
      background: #e4f8ee;
    }
  `,
  host: { 'aria-hidden': 'true', '[class]': 'classes()' },
})
export class Avatar {
  readonly name = input.required<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly variant = input<'soft' | 'solid'>('soft');

  protected readonly initials = computed(() => getInitials(this.name()));
  protected readonly classes = computed(
    () => `${this.size()} ${this.variant() === 'solid' ? 'solid' : toneFor(this.name())}`,
  );
}
