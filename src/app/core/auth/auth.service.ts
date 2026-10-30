import { Injectable, computed, effect, inject, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClient } from '../api/api-client';
import { AuthApi } from '../api/auth-api';
import { UsersApi } from '../api/users-api';
import type { LoginInput, RegisterInput } from '../models/auth';
import { QueryClient } from '../query/query-client';
import { SessionStore } from './session-store';

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionStore = inject(SessionStore);
  private readonly authApi = inject(AuthApi);
  private readonly usersApi = inject(UsersApi);
  private readonly queryClient = inject(QueryClient);
  private readonly router = inject(Router);

  readonly user = computed(() => this.sessionStore.session()?.user ?? null);
  readonly token = this.sessionStore.token;
  readonly isAuthenticated = computed(() => this.sessionStore.session() !== null);

  constructor() {
    inject(ApiClient).setUnauthorizedHandler(() => this.signOut());

    // Sincroniza o perfil salvo com o da API (ex.: perfil alterado por um administrador).
    effect((onCleanup) => {
      const token = this.token();
      if (!token) return;
      let active = true;

      untracked(() => this.authApi.getProfile())
        .then((profile) => {
          const current = this.sessionStore.session()?.user;
          const changed =
            !current ||
            current.name !== profile.name ||
            current.email !== profile.email ||
            current.role !== profile.role;
          if (active && changed) {
            this.sessionStore.save(token, profile);
            this.queryClient.invalidate();
          }
        })
        .catch(() => undefined);

      onCleanup(() => (active = false));
    });

    effect((onCleanup) => {
      const expiresAt = this.sessionStore.session()?.expiresAt;
      if (!expiresAt) return;
      const delay = Math.min(expiresAt - Date.now(), MAX_TIMEOUT_MS);
      const timeout = setTimeout(() => this.signOut(), delay);
      onCleanup(() => clearTimeout(timeout));
    });
  }

  async signIn(credentials: LoginInput) {
    const { access_token, user } = await this.authApi.login(credentials);
    this.sessionStore.save(access_token, user);
    await this.router.navigateByUrl('/');
  }

  async signUp(input: RegisterInput) {
    await this.usersApi.register(input);
    try {
      await this.signIn({ email: input.email, password: input.password });
    } catch {
      throw new Error('Conta criada com sucesso! Faça login para continuar.');
    }
  }

  signOut() {
    this.sessionStore.clear();
    this.queryClient.clear();
    void this.router.navigateByUrl('/login');
  }
}
