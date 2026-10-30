import { Component, computed, input } from '@angular/core';
import type { MonthlyPoint } from '../../core/purchase-requests';
import { Panel, PanelHeader } from '../../shared/ui/panel';

@Component({
  selector: 'app-requests-chart',
  imports: [Panel, PanelHeader],
  template: `
    <app-panel class="chart-panel">
      <app-panel-header
        title="Evolução das solicitações"
        description="Solicitações criadas e aprovadas nos últimos 6 meses."
      />

      <div class="legend">
        <span><i class="legend-created"></i> Criadas</span>
        <span><i class="legend-approved"></i> Aprovadas</span>
      </div>

      <div class="chart" role="img" [attr.aria-label]="summary()">
        @for (point of data(); track point.key) {
          <div class="chart-group">
            <div class="chart-bars">
              <span
                class="bar-created"
                [style.height.%]="(point.created / max()) * 100"
                [title]="point.created + ' criadas'"
              >
                @if (point.created > 0) {
                  <em>{{ point.created }}</em>
                }
              </span>
              <span
                class="bar-approved"
                [style.height.%]="(point.approved / max()) * 100"
                [title]="point.approved + ' aprovadas'"
              >
                @if (point.approved > 0) {
                  <em>{{ point.approved }}</em>
                }
              </span>
            </div>
            <span class="chart-label">{{ point.label }}</span>
          </div>
        }
      </div>
    </app-panel>
  `,
  styles: `
    :host {
      display: flex;
      min-width: 0;
      flex-direction: column;
    }
    .chart-panel {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    .legend {
      display: flex;
      gap: 20px;
      margin-top: 20px;
      color: #7f899c;
      font-size: 11px;
    }
    .legend span {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .legend i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .legend-created {
      background: #6558e8;
    }
    .legend-approved {
      background: #7bd4ae;
    }
    .chart {
      display: flex;
      height: 230px;
      align-items: stretch;
      gap: 12px;
      margin-top: 16px;
      padding-top: 18px;
      background-image: linear-gradient(#edf0f5 1px, transparent 1px);
      background-size: 100% 25%;
    }
    .chart-group {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 8px;
    }
    .chart-bars {
      display: flex;
      flex: 1;
      align-items: flex-end;
      justify-content: center;
      gap: 5px;
      border-bottom: 1px solid var(--border);
    }
    .chart-bars span {
      position: relative;
      width: min(26px, 40%);
      min-height: 3px;
      border-radius: 6px 6px 0 0;
      transition: height 0.4s ease;
    }
    .chart-bars em {
      position: absolute;
      top: -18px;
      left: 50%;
      color: var(--foreground-soft);
      font-size: 10px;
      font-style: normal;
      font-weight: 700;
      transform: translateX(-50%);
    }
    .bar-created {
      background: linear-gradient(180deg, #8077f3, #6558e8);
    }
    .bar-approved {
      background: linear-gradient(180deg, #9ce0c2, #5cc79a);
    }
    .chart-label {
      color: #9ba4b3;
      font-size: 11px;
      text-align: center;
      text-transform: capitalize;
    }
    @media (max-width: 760px) {
      .chart {
        height: 190px;
        gap: 6px;
      }
    }
  `,
})
export class RequestsChart {
  readonly data = input.required<MonthlyPoint[]>();

  protected readonly max = computed(() =>
    Math.max(1, ...this.data().flatMap((point) => [point.created, point.approved])),
  );

  protected readonly summary = computed(() =>
    this.data()
      .map((point) => `${point.label}: ${point.created} criadas, ${point.approved} aprovadas`)
      .join('; '),
  );
}
