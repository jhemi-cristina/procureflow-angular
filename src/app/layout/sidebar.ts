import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { ROLE_LABELS } from '../core/purchase-requests';
import { Avatar } from '../shared/ui/avatar';
import { Icon } from '../shared/ui/icon';
import { findNavItem, injectPathname, navItemsFor } from './navigation';

@Component({
  selector: 'aside[appSidebar]',
  imports: [RouterLink, Avatar, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  host: { '[class.open]': 'open()' },
})
export class Sidebar {
  protected readonly auth = inject(AuthService);
  private readonly pathname = injectPathname();

  readonly open = input(false);
  readonly navigate = output<void>();

  protected readonly roleLabels = ROLE_LABELS;
  protected readonly items = computed(() => navItemsFor(this.auth.user()?.role));
  protected readonly activeHref = computed(() => findNavItem(this.pathname())?.href);
}
