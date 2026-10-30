import { Component, computed, inject } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import { formatCurrency, getFirstName, pluralize } from '../../core/format';
import { canDecide, computeRequestStats } from '../../core/purchase-requests';
import { Button } from '../../shared/ui/button';
import { ErrorState, LoadingState } from '../../shared/ui/feedback';
import { Icon } from '../../shared/ui/icon';
import { PageHeader } from '../../shared/ui/page-header';
import { Panel } from '../../shared/ui/panel';
import {
  injectMyRequests,
  injectTeamRequests,
} from '../purchase-requests/purchase-request-queries';
import { RequestDialogs } from '../purchase-requests/request-dialogs';
import { MetricCard } from './metric-card';
import { PendingApprovals } from './pending-approvals';
import { RecentRequests } from './recent-requests';
import { RequestsChart } from './requests-chart';

const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

@Component({
  selector: 'app-dashboard',
  imports: [
    Button,
    ErrorState,
    Icon,
    LoadingState,
    MetricCard,
    PageHeader,
    Panel,
    PendingApprovals,
    RecentRequests,
    RequestsChart,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  protected readonly dialogs = inject(RequestDialogs);
  private readonly mine = injectMyRequests();
  private readonly team = injectTeamRequests();
  private readonly now = new Date();

  protected readonly isApprover = computed(() => canDecide(this.auth.user()?.role));
  protected readonly query = computed(() => (this.isApprover() ? this.team : this.mine));
  protected readonly requests = computed(() => this.query().data() ?? []);
  protected readonly myRequests = computed(() => this.mine.data() ?? []);
  protected readonly stats = computed(() => computeRequestStats(this.requests(), this.now));
  protected readonly errorMessage = computed(() => getErrorMessage(this.query().error()));

  protected readonly eyebrow = weekdayFormatter.format(this.now);
  protected readonly title = computed(
    () => `${greetingFor(this.now)}, ${getFirstName(this.auth.user()?.name ?? '')}`,
  );

  protected readonly totalFootnote = computed(() => {
    if (!this.isApprover()) {
      return pluralize(this.stats().drafts, 'rascunho em aberto', 'rascunhos em aberto');
    }
    const people = new Set(this.requests().map((request) => request.requester.id)).size;
    return `Enviadas por ${pluralize(people, 'pessoa', 'pessoas')}`;
  });

  protected readonly totalAmount = computed(() =>
    formatCurrency(this.stats().totalAmount, { compact: true }),
  );
  protected readonly approvedAmount = computed(
    () => `${formatCurrency(this.stats().approvedAmount, { compact: true })} aprovados`,
  );
}
