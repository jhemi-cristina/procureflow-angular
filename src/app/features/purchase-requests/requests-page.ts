import { Component, computed, inject, signal } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import type {
  PurchaseRequest,
  PurchaseRequestStatus,
} from '../../core/models/purchase-request';
import { STATUS_META } from '../../core/purchase-requests';
import { Button } from '../../shared/ui/button';
import { EmptyState, ErrorState, LoadingState } from '../../shared/ui/feedback';
import { Icon } from '../../shared/ui/icon';
import { PageHeader } from '../../shared/ui/page-header';
import { Pagination } from '../../shared/ui/pagination';
import { Panel, PanelHeader } from '../../shared/ui/panel';
import { injectMyRequests } from './purchase-request-queries';
import { RequestDialogs } from './request-dialogs';
import { RequestsTable } from './requests-table';

const PAGE_SIZE = 8;
const STATUS_FILTERS: StatusFilter[] = ['all', 'draft', 'pending', 'approved', 'rejected'];

type StatusFilter = 'all' | PurchaseRequestStatus;

function filterRequests(requests: PurchaseRequest[], search: string, status: StatusFilter) {
  const term = search.trim().toLowerCase();

  return requests.filter((request) => {
    if (status !== 'all' && request.status !== status) return false;
    if (!term) return true;
    return `${request.title} ${request.description ?? ''} ${request.requester.name} ${request.id}`
      .toLowerCase()
      .includes(term);
  });
}

@Component({
  selector: 'app-requests-page',
  imports: [
    Button,
    EmptyState,
    ErrorState,
    Icon,
    LoadingState,
    PageHeader,
    Pagination,
    Panel,
    PanelHeader,
    RequestsTable,
  ],
  templateUrl: './requests-page.html',
  styleUrl: './requests-page.css',
})
export class RequestsPage {
  protected readonly dialogs = inject(RequestDialogs);
  protected readonly query = injectMyRequests();

  protected readonly filters = STATUS_FILTERS;
  protected readonly search = signal('');
  protected readonly status = signal<StatusFilter>('all');
  private readonly requestedPage = signal(1);

  protected readonly requests = computed(() => this.query.data() ?? []);
  protected readonly errorMessage = computed(() => getErrorMessage(this.query.error()));
  protected readonly filtered = computed(() =>
    filterRequests(this.requests(), this.search(), this.status()),
  );

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)),
  );
  protected readonly page = computed(() => Math.min(this.requestedPage(), this.pageCount()));
  private readonly start = computed(() => (this.page() - 1) * PAGE_SIZE);
  protected readonly pageItems = computed(() =>
    this.filtered().slice(this.start(), this.start() + PAGE_SIZE),
  );
  protected readonly rangeStart = computed(() =>
    this.filtered().length === 0 ? 0 : this.start() + 1,
  );
  protected readonly rangeEnd = computed(() =>
    Math.min(this.start() + PAGE_SIZE, this.filtered().length),
  );

  protected readonly countByStatus = computed(() => {
    const counts: Record<string, number> = { all: this.requests().length };
    for (const request of this.requests()) {
      counts[request.status] = (counts[request.status] ?? 0) + 1;
    }
    return counts;
  });

  protected filterLabel(filter: StatusFilter) {
    return filter === 'all' ? 'Todas' : STATUS_META[filter].label;
  }

  protected setPage(next: number) {
    this.requestedPage.set(Math.min(Math.max(1, next), this.pageCount()));
  }

  protected changeStatus(next: StatusFilter) {
    this.status.set(next);
    this.requestedPage.set(1);
  }

  protected changeSearch(event: Event) {
    this.search.set((event.target as HTMLInputElement).value);
    this.requestedPage.set(1);
  }
}
