import { Component, booleanAttribute, input } from '@angular/core';

@Component({
  selector: 'app-panel',
  template: '<ng-content />',
  styles: `
    :host {
      display: block;
      min-width: 0;
      padding: 22px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    :host(.flush) {
      padding: 22px 0 0;
      overflow: hidden;
    }
    @media (max-width: 760px) {
      :host {
        padding: 16px;
      }
      :host(.flush) {
        padding: 17px 0 0;
      }
    }
  `,
  host: { '[class.flush]': 'flush()' },
})
export class Panel {
  readonly flush = input(false, { transform: booleanAttribute });
}

@Component({
  selector: 'app-panel-header',
  template: `
    <div>
      <h2>{{ title() }}</h2>
      @if (description()) {
        <p>{{ description() }}</p>
      }
    </div>
    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    :host-context(app-panel.flush) {
      padding: 0 22px 20px;
    }
    h2 {
      margin: 0;
      font-family: var(--font-heading);
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.25px;
    }
    p {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.6;
    }
    @media (max-width: 760px) {
      :host-context(app-panel.flush) {
        padding: 0 16px 16px;
      }
    }
  `,
})
export class PanelHeader {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
