import { Injectable, computed, effect, inject, signal, untracked, type Signal } from '@angular/core';
import { ApiError } from '../api/api-client';

const STALE_TIME_MS = 30_000;
const MAX_RETRIES = 2;

export type QueryKey = readonly unknown[];
type QueryStatus = 'pending' | 'error' | 'success';

function shouldRetry(failureCount: number, error: unknown) {
  return (
    !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
    failureCount < MAX_RETRIES
  );
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class QueryEntry<T> {
  readonly data = signal<T | undefined>(undefined);
  readonly error = signal<unknown>(null);
  readonly status = signal<QueryStatus>('pending');
  private updatedAt = 0;
  private inFlight: Promise<void> | null = null;

  constructor(
    readonly key: QueryKey,
    public fetcher: () => Promise<T>,
  ) {}

  get isStale() {
    return Date.now() - this.updatedAt > STALE_TIME_MS;
  }

  fetch() {
    this.inFlight ??= Promise.resolve()
      .then(() => this.run())
      .finally(() => (this.inFlight = null));
    return this.inFlight;
  }

  invalidate() {
    this.updatedAt = 0;
  }

  private async run(attempt = 0): Promise<void> {
    try {
      const data = await this.fetcher();
      this.data.set(data);
      this.error.set(null);
      this.status.set('success');
      this.updatedAt = Date.now();
    } catch (error) {
      if (shouldRetry(attempt, error)) {
        await wait(1000 * 2 ** attempt);
        return this.run(attempt + 1);
      }
      this.error.set(error);
      this.status.set('error');
    }
  }
}

function matches(key: QueryKey, prefix: QueryKey) {
  return prefix.every((part, index) => key[index] === part);
}

@Injectable({ providedIn: 'root' })
export class QueryClient {
  private readonly entries = new Map<string, QueryEntry<unknown>>();

  ensure<T>(key: QueryKey, fetcher: () => Promise<T>): QueryEntry<T> {
    const hash = JSON.stringify(key);
    let entry = this.entries.get(hash) as QueryEntry<T> | undefined;
    if (!entry) {
      entry = new QueryEntry(key, fetcher);
      this.entries.set(hash, entry as QueryEntry<unknown>);
    }
    entry.fetcher = fetcher;
    if (entry.isStale) void entry.fetch();
    return entry;
  }

  invalidate(prefix: QueryKey = []) {
    for (const entry of this.entries.values()) {
      if (!matches(entry.key, prefix)) continue;
      entry.invalidate();
      void entry.fetch();
    }
  }

  clear() {
    this.entries.clear();
  }
}

export interface QueryOptions<T> {
  key: QueryKey;
  fn: () => Promise<T>;
  enabled?: boolean;
  keepPreviousData?: boolean;
}

export interface QueryResult<T> {
  data: Signal<T | undefined>;
  error: Signal<unknown>;
  isPending: Signal<boolean>;
  isError: Signal<boolean>;
  refetch: () => void;
}

export function injectQuery<T>(options: () => QueryOptions<T>): QueryResult<T> {
  const client = inject(QueryClient);
  const keepPreviousData = untracked(options).keepPreviousData ?? false;

  const entry = computed(() => {
    const { key, fn, enabled = true } = options();
    return enabled ? untracked(() => client.ensure(key, fn)) : null;
  });

  effect(() => entry());

  let previous: T | undefined;
  const data = computed(() => {
    const current = entry()?.data();
    if (current !== undefined) previous = current;
    return current ?? (keepPreviousData ? previous : undefined);
  });

  const isError = computed(() => entry()?.status() === 'error');

  return {
    data,
    error: computed(() => entry()?.error()),
    isError,
    isPending: computed(() => data() === undefined && !isError()),
    refetch: () => {
      const current = entry();
      if (!current) return;
      if (current.status() === 'error') current.status.set('pending');
      void current.fetch();
    },
  };
}
