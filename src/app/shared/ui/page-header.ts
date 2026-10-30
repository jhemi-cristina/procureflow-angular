import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div>
      @if (eyebrow()) {
        <p class="eyebrow"><span class="dot" aria-hidden="true"></span>{{ eyebrow() }}</p>
      }
      <h1>{{ title() }}</h1>
      @if (description()) {
        <p class="description">{{ description() }}</p>
      }
    </div>
    <div class="actions"><ng-content /></div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 26px;
    }
    .eyebrow {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #818ca0;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.05px;
      text-transform: uppercase;
    }
    .dot {
      width: 7px;
      height: 7px;
      background: #6f63ed;
      border-radius: 50%;
    }
    h1 {
      margin: 10px 0 7px;
      font-family: var(--font-heading);
      font-size: clamp(24px, 2vw, 30px);
      font-weight: 800;
      letter-spacing: -1.1px;
      line-height: 1.25;
    }
    .description {
      margin: 0;
      color: #818ca0;
      font-size: 13px;
      line-height: 1.6;
    }
    .actions {
      display: flex;
      flex-shrink: 0;
      gap: 10px;
    }
    .actions:empty {
      display: none;
    }
    @media (max-width: 760px) {
      :host {
        align-items: flex-start;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 22px;
      }
      h1 {
        font-size: 25px;
      }
    }
  `,
})
export class PageHeader {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly description = input<string>();
}
