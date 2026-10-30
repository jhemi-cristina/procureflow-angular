import { Component, computed, input, output } from '@angular/core';
import { Icon } from './icon';

type PageItem = number | 'ellipsis';

function visiblePages(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  return sorted.flatMap((value, index): PageItem[] =>
    index > 0 && value - sorted[index - 1] > 1 ? ['ellipsis', value] : [value],
  );
}

@Component({
  selector: 'app-pagination',
  imports: [Icon],
  template: `
    @if (pageCount() > 1) {
      <nav class="pagination" aria-label="Paginação">
        <button
          type="button"
          [disabled]="page() === 1"
          (click)="pageChange.emit(page() - 1)"
          aria-label="Página anterior"
        >
          <app-icon name="chevron-left" [size]="15" />
        </button>
        @for (value of pages(); track $index) {
          @if (value === 'ellipsis') {
            <span>…</span>
          } @else {
            <button
              type="button"
              [class.active]="value === page()"
              [attr.aria-current]="value === page() ? 'page' : null"
              (click)="pageChange.emit(value)"
            >
              {{ value }}
            </button>
          }
        }
        <button
          type="button"
          [disabled]="page() === pageCount()"
          (click)="pageChange.emit(page() + 1)"
          aria-label="Próxima página"
        >
          <app-icon name="chevron-right" [size]="15" />
        </button>
      </nav>
    }
  `,
  styles: `
    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 5px;
    }
    button {
      display: grid;
      min-width: 30px;
      height: 30px;
      place-items: center;
      padding: 0 7px;
      color: #778297;
      font-size: 12px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 7px;
    }
    button:hover:not(:disabled) {
      color: var(--primary-text);
      background: var(--primary-softer);
      border-color: #dcd9ff;
    }
    button:disabled {
      opacity: 0.45;
    }
    .active,
    .active:hover:not(:disabled) {
      color: #fff;
      background: var(--primary);
      border-color: var(--primary);
    }
    span {
      padding: 0 3px;
      color: var(--muted);
    }
  `,
})
export class Pagination {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => visiblePages(this.page(), this.pageCount()));
}
