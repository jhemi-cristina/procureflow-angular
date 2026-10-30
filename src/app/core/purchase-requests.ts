import type { UserRole } from './models/auth';
import type { PurchaseRequest, PurchaseRequestStatus } from './models/purchase-request';

export type StatusTone = 'neutral' | 'warning' | 'success' | 'danger' | 'muted';

export const STATUS_META: Record<PurchaseRequestStatus, { label: string; tone: StatusTone }> = {
  draft: { label: 'Rascunho', tone: 'neutral' },
  pending: { label: 'Em aprovação', tone: 'warning' },
  approved: { label: 'Aprovada', tone: 'success' },
  rejected: { label: 'Rejeitada', tone: 'danger' },
  cancelled: { label: 'Cancelada', tone: 'muted' },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador(a)',
  approver: 'Aprovador(a)',
  requester: 'Solicitante',
};

export function canDecide(role: UserRole | undefined) {
  return role === 'admin' || role === 'approver';
}

const MONTHS_IN_CHART = 6;

export interface MonthlyPoint {
  key: string;
  label: string;
  created: number;
  approved: number;
}

export interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  drafts: number;
  totalAmount: number;
  approvedAmount: number;
  approvalRate: number;
  monthly: MonthlyPoint[];
}

const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'short' });

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function buildMonthlySeries(requests: PurchaseRequest[], now: Date): MonthlyPoint[] {
  const points = Array.from({ length: MONTHS_IN_CHART }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (MONTHS_IN_CHART - 1 - index), 1);
    return {
      key: monthKey(date),
      label: monthLabel.format(date).replace('.', ''),
      created: 0,
      approved: 0,
    };
  });
  const byKey = new Map(points.map((point) => [point.key, point]));

  for (const request of requests) {
    const created = byKey.get(monthKey(new Date(request.createdAt)));
    if (created) created.created += 1;

    if (request.status === 'approved' && request.decidedAt) {
      const decided = byKey.get(monthKey(new Date(request.decidedAt)));
      if (decided) decided.approved += 1;
    }
  }

  return points;
}

export function computeRequestStats(requests: PurchaseRequest[], now: Date): RequestStats {
  const count = (status: PurchaseRequestStatus) =>
    requests.filter((request) => request.status === status).length;
  const sum = (list: PurchaseRequest[]) =>
    list.reduce((total, request) => total + Number(request.estimatedAmount), 0);

  const approved = count('approved');
  const rejected = count('rejected');
  const decided = approved + rejected;

  return {
    total: requests.length,
    pending: count('pending'),
    approved,
    rejected,
    drafts: count('draft'),
    totalAmount: sum(requests),
    approvedAmount: sum(requests.filter((request) => request.status === 'approved')),
    approvalRate: decided === 0 ? 0 : Math.round((approved / decided) * 100),
    monthly: buildMonthlySeries(requests, now),
  };
}
