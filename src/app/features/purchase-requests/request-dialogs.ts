import { Injectable, signal } from '@angular/core';
import type {
  PurchaseRequest,
  PurchaseRequestDecision,
} from '../../core/models/purchase-request';

export type RequestDialogState =
  | { type: 'form'; request: PurchaseRequest | null }
  | { type: 'details'; request: PurchaseRequest }
  | { type: 'decision'; request: PurchaseRequest; decision: PurchaseRequestDecision }
  | null;

@Injectable()
export class RequestDialogs {
  private readonly state = signal<RequestDialogState>(null);

  readonly current = this.state.asReadonly();

  openCreate() {
    this.state.set({ type: 'form', request: null });
  }

  openEdit(request: PurchaseRequest) {
    this.state.set({ type: 'form', request });
  }

  openDetails(request: PurchaseRequest) {
    this.state.set({ type: 'details', request });
  }

  openDecision(request: PurchaseRequest, decision: PurchaseRequestDecision) {
    this.state.set({ type: 'decision', request, decision });
  }

  close() {
    this.state.set(null);
  }
}
