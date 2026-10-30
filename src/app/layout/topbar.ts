import { Component, computed, inject, output } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { ROLE_LABELS } from '../core/purchase-requests';
import { Avatar } from '../shared/ui/avatar';
import { Icon } from '../shared/ui/icon';
import { findNavItem, injectPathname } from './navigation';

@Component({
  selector: 'header[appTopbar]',
  imports: [Avatar, Icon],
  template: `
    <div class="left">
      <button type="button" class="menu-button" aria-label="Abrir menu" (click)="openMenu.emit()">
        <app-icon name="menu" [size]="21" />
      </button>
      <nav class="breadcrumb" aria-label="Você está em">
        <span>Workspace</span>
        <span class="separator">/</span>
        <strong>{{ currentLabel() }}</strong>
      </nav>
    </div>

    @if (auth.user(); as user) {
      <div class="profile">
        <app-avatar [name]="user.name" size="md" variant="solid" />
        <div class="profile-copy">
          <strong>{{ user.name }}</strong>
          <span>{{ user.email }}</span>
        </div>
        <span class="role">{{ roleLabels[user.role] ?? user.role }}</span>
      </div>
    }
  `,
  styleUrl: './topbar.css',
})
export class Topbar {
  protected readonly auth = inject(AuthService);
  private readonly pathname = injectPathname();

  readonly openMenu = output<void>();

  protected readonly roleLabels = ROLE_LABELS;
  protected readonly currentLabel = computed(
    () => findNavItem(this.pathname())?.label ?? 'ProcureFlow',
  );
}
