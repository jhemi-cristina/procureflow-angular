import { Component, computed, input } from '@angular/core';

const ICONS = {
  'arrow-up-right': 'arrow_outward',
  check: 'check',
  'chevron-left': 'chevron_left',
  'chevron-right': 'chevron_right',
  'circle-alert': 'error',
  'circle-check': 'check_circle',
  'clipboard-list': 'assignment',
  'clock-3': 'schedule',
  eye: 'visibility',
  'eye-off': 'visibility_off',
  'file-text': 'description',
  inbox: 'inbox',
  'layout-dashboard': 'dashboard',
  'loader-circle': 'progress_activity',
  'lock-keyhole': 'lock',
  'log-out': 'logout',
  mail: 'mail',
  menu: 'menu',
  pencil: 'edit',
  plus: 'add',
  search: 'search',
  'search-x': 'search_off',
  send: 'send',
  'shield-alert': 'gpp_maybe',
  'shield-check': 'verified_user',
  'shopping-cart': 'shopping_cart',
  'trending-up': 'trending_up',
  'user-check': 'person_check',
  'user-round': 'person',
  'user-x': 'person_off',
  users: 'group',
  wallet: 'account_balance_wallet',
  x: 'close',
} as const;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  template: '{{ glyph() }}',
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      font-family: 'Material Symbols Outlined';
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      direction: ltr;
      user-select: none;
      -webkit-font-smoothing: antialiased;
      font-feature-settings: 'liga';
    }
  `,
  host: {
    'aria-hidden': 'true',
    '[style.font-size.px]': 'size()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.font-variation-settings]': 'variation()',
  },
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(24);
  readonly strokeWidth = input(2);

  protected readonly glyph = computed(() => ICONS[this.name()]);
  protected readonly variation = computed(() => {
    const weight = Math.min(700, Math.max(100, Math.round(this.strokeWidth() * 200)));
    const opsz = Math.min(48, Math.max(20, this.size()));
    return `'FILL' 0, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${opsz}`;
  });
}
