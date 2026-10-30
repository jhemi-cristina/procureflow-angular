import { Component, computed, inject } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import { formatCurrency } from '../../core/format';
import { canDecide } from '../../core/purchase-requests';
import { EmptyState, ErrorState, LoadingState } from '../../shared/ui/feedback';
import { PageHeader } from '../../shared/ui/page-header';
import { Panel, PanelHeader } from '../../shared/ui/panel';
import { injectApprovalQueue } from './purchase-request-queries';
import { RequestsTable } from './requests-table';

@Component({
  selector: 'app-approvals-page',
  imports: [EmptyState, ErrorState, LoadingState, PageHeader, Panel, PanelHeader, RequestsTable],
  template: `
    @if (!canDecide()) {
      <app-panel>
        <app-empty-state
          icon="shield-alert"
          title="Acesso restrito"
          description="Apenas administradores e aprovadores podem revisar solicitações."
        />
      </app-panel>
    } @else {
      <app-page-header
        eyebrow="Aprovações"
        title="Fila de aprovação"
        description="Solicitações de toda a equipe aguardando sua decisão, das mais antigas para as mais novas."
      />

      <app-panel flush>
        <app-panel-header [title]="headerTitle()" [description]="headerDescription()" />

        @if (query.isPending()) {
          <app-loading-state label="Carregando fila de aprovação..." />
        } @else if (query.isError()) {
          <app-error-state [message]="errorMessage()" (retry)="query.refetch()" />
        } @else if (queue().length === 0) {
          <app-empty-state
            icon="circle-check"
            title="Nenhuma solicitação pendente"
            description="Quando alguém enviar uma solicitação para aprovação, ela aparece aqui."
          />
        } @else {
          <app-requests-table [requests]="queue()" />
        }
      </app-panel>
    }
  `,
})
export class ApprovalsPage {
  private readonly auth = inject(AuthService);
  protected readonly query = injectApprovalQueue();

  protected readonly canDecide = computed(() => canDecide(this.auth.user()?.role));
  protected readonly queue = computed(() => this.query.data() ?? []);
  protected readonly errorMessage = computed(() => getErrorMessage(this.query.error()));

  protected readonly headerTitle = computed(() => {
    const count = this.queue().length;
    return `${count} ${count === 1 ? 'solicitação pendente' : 'solicitações pendentes'}`;
  });

  protected readonly headerDescription = computed(() => {
    if (this.queue().length === 0) return undefined;
    const total = this.queue().reduce((sum, request) => sum + Number(request.estimatedAmount), 0);
    return `Valor total em análise: ${formatCurrency(total)}`;
  });
}
