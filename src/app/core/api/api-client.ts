import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessionStore } from '../auth/session-store';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number>;
}

const CONNECTION_ERROR =
  'Não foi possível conectar à API. Verifique se o servidor está em execução.';

function extractErrorMessage(error: HttpErrorResponse) {
  const message = (error.error as { message?: string | string[] } | null)?.message;
  if (Array.isArray(message)) return message.join(', ');
  return message ?? `Erro na API: ${error.status} ${error.statusText}`;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);
  private unauthorizedHandler: (() => void) | null = null;

  setUnauthorizedHandler(handler: (() => void) | null) {
    this.unauthorizedHandler = handler;
  }

  async request<T>(path: string, { method = 'GET', body, params }: ApiRequestOptions = {}) {
    const token = this.session.token();

    try {
      return await firstValueFrom(
        this.http.request<T>(method, `${environment.apiUrl}${path}`, {
          body,
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      );
    } catch (error) {
      if (!(error instanceof HttpErrorResponse)) throw error;
      if (error.status === 0 || error.status === 502 || error.status === 504) {
        throw new ApiError(CONNECTION_ERROR, 0);
      }
      if (error.status === 401 && token) this.unauthorizedHandler?.();
      throw new ApiError(extractErrorMessage(error), error.status);
    }
  }
}

export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  return error instanceof Error ? error.message : fallback;
}
