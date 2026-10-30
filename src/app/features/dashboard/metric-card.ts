import { Component, input } from '@angular/core';
import { Icon, type IconName } from '../../shared/ui/icon';

export type MetricTone = 'violet' | 'amber' | 'green' | 'blue';

@Component({
  selector: 'app-metric-card',
  imports: [Icon],
  template: `
    <span class="metric-icon" [class]="tone()">
      <app-icon [name]="icon()" [size]="19" [strokeWidth]="1.9" />
    </span>
    <p class="metric-title">{{ title() }}</p>
    <strong class="metric-value">{{ value() }}</strong>
    <p class="metric-footnote">{{ footnote() }}</p>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
      padding: 19px 18px 17px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }
    .metric-icon {
      display: grid;
      width: 39px;
      height: 39px;
      place-items: center;
      border-radius: 11px;
    }
    .violet {
      color: #6457e8;
      background: #eeecff;
    }
    .amber {
      color: #d58b18;
      background: #fff5df;
    }
    .green {
      color: var(--success);
      background: #e4f8ee;
    }
    .blue {
      color: var(--info);
      background: var(--info-soft);
    }
    .metric-title {
      margin: 16px 0 6px;
      color: #7d889b;
      font-size: 12px;
      font-weight: 500;
    }
    .metric-value {
      display: block;
      font-family: var(--font-heading);
      font-size: clamp(22px, 1.9vw, 28px);
      font-weight: 800;
      letter-spacing: -1px;
      white-space: nowrap;
    }
    .metric-footnote {
      margin: 10px 0 0;
      color: #929bad;
      font-size: 11px;
    }
    @media (max-width: 760px) {
      :host {
        padding: 15px 13px;
      }
      .metric-value {
        font-size: clamp(19px, 5.5vw, 24px);
      }
    }
  `,
})
export class MetricCard {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly footnote = input.required<string>();
  readonly icon = input.required<IconName>();
  readonly tone = input.required<MetricTone>();
}
