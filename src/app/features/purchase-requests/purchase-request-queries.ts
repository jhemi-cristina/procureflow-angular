import { Injectable, inject } from '@angular/core';
import { PurchaseRequestsApi } from '../../core/api/purchase-requests-api';
import { AuthService } from '../../core/auth/auth.service';
import type {
  DecidePurchaseRequestInput,
  PurchaseRequestInput,
} from '../../core/models/purchase-request';
import { canDecide } from '../../core/purchase-requests';
import { QueryClient, injectQuery } from '../../core/query/query-client';

export const purchaseRequestKeys = {
  all: ['purchase-requests'] as const,
  mine: ['purchase-requests', 'mine'] as const,
  approvals: ['purchase-requests', 'approvals'] as const,
  team: ['purchase-requests', 'team'] as const,
  recent: (limit: number) => ['purchase-requests', 'recent', limit] as const,
};

export function injectMyRequests() {
  const api = inject(PurchaseRequestsApi);
  const auth = inject(AuthService);

  return injectQuery(() => ({
    key: purchaseRequestKeys.mine,
    fn: () => api.list(),
    enabled: auth.isAuthenticated(),
  }));
}

export function injectApprovalQueue() {
  const api = inject(PurchaseRequestsApi);
  const auth = inject(AuthService);

  return injectQuery(() => ({
    key: purchaseRequestKeys.approvals,
    fn: () => api.approvals(),
    enabled: canDecide(auth.user()?.role),
  }));
}

export function injectTeamRequests() {
  const api = inject(PurchaseRequestsApi);
  const auth = inject(AuthService);

  return injectQuery(() => ({
    key: purchaseRequestKeys.team,
    fn: () => api.team(),
    enabled: canDecide(auth.user()?.role),
  }));
}

export function injectTeamRecentRequests(limit: number) {
  const api = inject(PurchaseRequestsApi);
  const auth = inject(AuthService);

  return injectQuery(() => ({
    key: purchaseRequestKeys.recent(limit),
    fn: () => api.recent(limit),
    enabled: canDecide(auth.user()?.role),
  }));
}

@Injectable({ providedIn: 'root' })
export class PurchaseRequestCommands {
  private readonly api = inject(PurchaseRequestsApi);
  private readonly queryClient = inject(QueryClient);

  create(input: PurchaseRequestInput, submit: boolean) {
    return this.settle(async () => {
      const created = await this.api.create(input);
      return submit ? this.api.submit(created.id) : created;
    });
  }

  update(id: string, input: PurchaseRequestInput, submit: boolean) {
    return this.settle(async () => {
      const updated = await this.api.update(id, input);
      return submit ? this.api.submit(updated.id) : updated;
    });
  }

  submit(id: string) {
    return this.settle(() => this.api.submit(id));
  }

  decide(id: string, input: DecidePurchaseRequestInput) {
    return this.settle(() => this.api.decide(id, input));
  }

  private async settle<T>(mutation: () => Promise<T>) {
    try {
      return await mutation();
    } finally {
      this.queryClient.invalidate(purchaseRequestKeys.all);
    }
  }
}
