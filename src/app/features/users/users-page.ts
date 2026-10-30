import { Component, computed, inject, signal } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import { EmptyState, ErrorState, LoadingState } from '../../shared/ui/feedback';
import { PageHeader } from '../../shared/ui/page-header';
import { Pagination } from '../../shared/ui/pagination';
import { Panel, PanelHeader } from '../../shared/ui/panel';
import { injectUsers } from './user-queries';
import { UserRow } from './user-row';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-users-page',
  imports: [
    EmptyState,
    ErrorState,
    LoadingState,
    PageHeader,
    Pagination,
    Panel,
    PanelHeader,
    UserRow,
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage {
  protected readonly auth = inject(AuthService);
  protected readonly page = signal(1);
  protected readonly query = injectUsers(this.page, PAGE_SIZE);

  protected readonly isAdmin = computed(() => this.auth.user()?.role === 'admin');
  protected readonly users = computed(() => this.query.data()?.data ?? []);
  protected readonly meta = computed(() => this.query.data()?.meta);
  protected readonly errorMessage = computed(() => getErrorMessage(this.query.error()));

  protected readonly headerTitle = computed(() => {
    const meta = this.meta();
    return meta ? `${meta.total} ${meta.total === 1 ? 'usuário' : 'usuários'}` : 'Usuários';
  });
}
