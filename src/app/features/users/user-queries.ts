import { Injectable, inject, type Signal } from '@angular/core';
import { UsersApi } from '../../core/api/users-api';
import { AuthService } from '../../core/auth/auth.service';
import type { UserRole } from '../../core/models/auth';
import { QueryClient, injectQuery } from '../../core/query/query-client';

export const userKeys = {
  all: ['users'] as const,
  page: (page: number, limit: number) => ['users', page, limit] as const,
};

export function injectUsers(page: Signal<number>, limit: number) {
  const api = inject(UsersApi);
  const auth = inject(AuthService);

  return injectQuery(() => {
    const current = page();
    return {
      key: userKeys.page(current, limit),
      fn: () => api.list(current, limit),
      enabled: auth.user()?.role === 'admin',
      keepPreviousData: true,
    };
  });
}

@Injectable({ providedIn: 'root' })
export class UserCommands {
  private readonly api = inject(UsersApi);
  private readonly queryClient = inject(QueryClient);

  updateRole(id: string, role: UserRole) {
    return this.settle(() => this.api.updateRole(id, role));
  }

  setActive(id: string, active: boolean) {
    return this.settle(() => this.api.setActive(id, active));
  }

  private async settle<T>(mutation: () => Promise<T>) {
    try {
      return await mutation();
    } finally {
      this.queryClient.invalidate(userKeys.all);
    }
  }
}
