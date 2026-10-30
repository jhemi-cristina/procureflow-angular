import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import type { PurchaseRequest } from '../../core/models/purchase-request';
import { canDecide } from '../../core/purchase-requests';
import { BrlPipe, ShortDatePipe } from '../../shared/pipes/format.pipes';
import { Avatar } from '../../shared/ui/avatar';
import { EmptyState, ErrorState, LoadingState } from '../../shared/ui/feedback';
import { Icon } from '../../shared/ui/icon';
import { Panel, PanelHeader } from '../../shared/ui/panel';
import { injectApprovalQueue } from '../purchase-requests/purchase-request-queries';
import { RequestDialogs } from '../purchase-requests/request-dialogs';

const MAX_ITEMS = 4;

@Component({
  selector: 'app-pending-approvals',
  imports: [
    RouterLink,
    Avatar,
    EmptyState,
    ErrorState,
    Icon,
    LoadingState,
    Panel,
    PanelHeader,
    BrlPipe,
    ShortDatePipe,
  ],
  templateUrl: './pending-approvals.html',
  styleUrl: './pending-approvals.css',
})
export class PendingApprovals {
  private readonly auth = inject(AuthService);
  protected readonly dialogs = inject(RequestDialogs);
  protected readonly queue = injectApprovalQueue();

  readonly requests = input.required<PurchaseRequest[]>();

  protected readonly isApprover = computed(() => canDecide(this.auth.user()?.role));
  protected readonly pending = computed(() =>
    this.isApprover()
      ? (this.queue.data() ?? [])
      : this.requests().filter((request) => request.status === 'pending'),
  );
  protected readonly visible = computed(() => this.pending().slice(0, MAX_ITEMS));
  protected readonly errorMessage = computed(() => getErrorMessage(this.queue.error()));
}
