import { Injectable, inject } from '@angular/core';
import type { ManagedUser, Paginated, RegisterInput, UserRole } from '../models/auth';
import { ApiClient } from './api-client';

function userPath(id: string, action: string) {
  return `/users/${encodeURIComponent(id)}/${action}`;
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly api = inject(ApiClient);

  register(input: RegisterInput) {
    return this.api.request<ManagedUser>('/users', { method: 'POST', body: input });
  }

  list(page: number, limit: number) {
    return this.api.request<Paginated<ManagedUser>>('/users', { params: { page, limit } });
  }

  updateRole(id: string, role: UserRole) {
    return this.api.request<ManagedUser>(userPath(id, 'role'), { method: 'PATCH', body: { role } });
  }

  setActive(id: string, active: boolean) {
    return this.api.request<ManagedUser>(userPath(id, active ? 'activate' : 'deactivate'), {
      method: 'PATCH',
    });
  }
}
