import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import type { PurchaseRequest } from '../../core/models/purchase-request';
import { canDecide } from '../../core/purchase-requests';
import { Button } from '../../shared/ui/button';
import { EmptyState, ErrorState, LoadingState } from '../../shared/ui/feedback';
import { Icon } from '../../shared/ui/icon';
import { Panel, PanelHeader } from '../../shared/ui/panel';
import { injectTeamRecentRequests } from '../purchase-requests/purchase-request-queries';
import { RequestDialogs } from '../purchase-requests/request-dialogs';
import { RequestsTable } from '../purchase-requests/requests-table';

const RECENT_LIMIT = 5;

@Component({
  selector: 'app-recent-requests',
  imports: [
    RouterLink,
    Button,
    EmptyState,
    ErrorState,
    Icon,
    LoadingState,
    Panel,
    PanelHeader,
    RequestsTable,
  ],
  template: `
    <app-panel flush>
      <app-panel-header
        [title]="isApprover() ? 'Solicitações recentes da equipe' : 'Solicitações recentes'"
        [description]="
          isApprover()
            ? 'As últimas solicitações enviadas por todos os usuários.'
            : 'As últimas solicitações de compra que você criou.'
        "
      >
        <a
          appButton
          variant="secondary"
          size="sm"
          [routerLink]="isApprover() ? '/aprovacoes' : '/solicitacoes'"
        >
          {{ isApprover() ? 'Ver aprovações' : 'Ver todas' }}
          <app-icon name="arrow-up-right" [size]="15" />
        </a>
      </app-panel-header>

      @if (isApprover() && team.isPending()) {
        <app-loading-state label="Carregando solicitações..." />
      } @else if (isApprover() && team.isError()) {
        <app-error-state [message]="errorMessage()" (retry)="team.refetch()" />
      } @else if (items().length === 0) {
        <app-empty-state
          title="Nenhuma solicitação ainda"
          [description]="
            isApprover()
              ? 'Quando a equipe enviar solicitações, elas aparecem aqui.'
              : 'Crie sua primeira solicitação de compra para começar.'
          "
        >
          <button appButton size="sm" (click)="dialogs.openCreate()">
            <app-icon name="plus" [size]="15" /> Nova solicitação
          </button>
        </app-empty-state>
      } @else {
        <app-requests-table [requests]="items()" />
      }
    </app-panel>
  `,
})
export class RecentRequests {
  private readonly auth = inject(AuthService);
  protected readonly dialogs = inject(RequestDialogs);
  protected readonly team = injectTeamRecentRequests(RECENT_LIMIT);

  readonly requests = input.required<PurchaseRequest[]>();

  protected readonly isApprover = computed(() => canDecide(this.auth.user()?.role));
  protected readonly items = computed(() =>
    this.isApprover() ? (this.team.data() ?? []) : this.requests().slice(0, RECENT_LIMIT),
  );
  protected readonly errorMessage = computed(() => getErrorMessage(this.team.error()));
}
