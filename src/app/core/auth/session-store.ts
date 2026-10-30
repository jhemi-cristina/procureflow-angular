import { Injectable, computed, signal } from '@angular/core';
import type { AuthUser, Session } from '../models/auth';

const STORAGE_KEY = 'procureflow_session';

function decodeTokenExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function readSession(): Session | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (!session.token || !session.user) return null;
    if (session.expiresAt && session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly state = signal<Session | null>(readSession());

  readonly session = this.state.asReadonly();
  readonly token = computed(() => this.state()?.token ?? null);

  save(token: string, user: AuthUser) {
    const session: Session = { token, user, expiresAt: decodeTokenExpiry(token) };
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } finally {
      this.state.set(session);
    }
  }

  clear() {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      this.state.set(null);
    }
  }
}
