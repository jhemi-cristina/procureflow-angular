import { Injectable, inject } from '@angular/core';
import type {
  DecidePurchaseRequestInput,
  PurchaseRequest,
  PurchaseRequestInput,
} from '../models/purchase-request';
import { ApiClient } from './api-client';

const BASE_PATH = '/purchase-requests';

function requestPath(id: string, action?: string) {
  const path = `${BASE_PATH}/${encodeURIComponent(id)}`;
  return action ? `${path}/${action}` : path;
}

@Injectable({ providedIn: 'root' })
export class PurchaseRequestsApi {
  private readonly api = inject(ApiClient);

  list() {
    return this.api.request<PurchaseRequest[]>(BASE_PATH);
  }

  approvals() {
    return this.api.request<PurchaseRequest[]>(`${BASE_PATH}/approvals`);
  }

  team() {
    return this.api.request<PurchaseRequest[]>(`${BASE_PATH}/team`);
  }

  recent(limit = 10) {
    return this.api.request<PurchaseRequest[]>(`${BASE_PATH}/recent`, { params: { limit } });
  }

  get(id: string) {
    return this.api.request<PurchaseRequest>(requestPath(id));
  }

  create(input: PurchaseRequestInput) {
    return this.api.request<PurchaseRequest>(BASE_PATH, { method: 'POST', body: input });
  }

  update(id: string, input: Partial<PurchaseRequestInput>) {
    return this.api.request<PurchaseRequest>(requestPath(id), { method: 'PATCH', body: input });
  }

  submit(id: string) {
    return this.api.request<PurchaseRequest>(requestPath(id, 'submit'), { method: 'PATCH' });
  }

  decide(id: string, input: DecidePurchaseRequestInput) {
    return this.api.request<PurchaseRequest>(requestPath(id, 'decision'), {
      method: 'PATCH',
      body: input,
    });
  }
}
