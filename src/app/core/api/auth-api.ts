import { Injectable, inject } from '@angular/core';
import type { AuthUser, LoginInput, LoginResponse } from '../models/auth';
import { ApiClient } from './api-client';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly api = inject(ApiClient);

  login(credentials: LoginInput) {
    return this.api.request<LoginResponse>('/auth/login', { method: 'POST', body: credentials });
  }

  getProfile() {
    return this.api.request<AuthUser>('/auth/profile');
  }
}
