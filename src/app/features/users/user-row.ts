import { Component, inject, input, signal } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import type { ManagedUser, UserRole } from '../../core/models/auth';
import { ROLE_LABELS } from '../../core/purchase-requests';
import { ToastService } from '../../core/toast/toast.service';
import { ShortDatePipe } from '../../shared/pipes/format.pipes';
import { Avatar } from '../../shared/ui/avatar';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { UserCommands } from './user-queries';

const ROLES: UserRole[] = ['admin', 'approver', 'requester'];

@Component({
  selector: 'tr[appUserRow]',
  imports: [Avatar, Button, Icon, ShortDatePipe],
  templateUrl: './user-row.html',
  styleUrl: './user-row.css',
  host: { '[class.inactive-row]': '!user().isActive' },
})
export class UserRow {
  private readonly toast = inject(ToastService);
  private readonly commands = inject(UserCommands);

  readonly user = input.required<ManagedUser>();
  readonly isSelf = input(false);

  protected readonly roles = ROLES;
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly updatingRole = signal(false);
  protected readonly togglingActive = signal(false);

  protected async changeRole(event: Event) {
    const select = event.target as HTMLSelectElement;
    const user = this.user();
    const role = select.value as UserRole;

    this.updatingRole.set(true);
    try {
      await this.commands.updateRole(user.id, role);
      this.toast.success(`${user.name} agora é ${ROLE_LABELS[role]}.`);
    } catch (error) {
      select.value = user.role;
      this.toast.error(getErrorMessage(error));
    } finally {
      this.updatingRole.set(false);
    }
  }

  protected async toggleActive() {
    const user = this.user();

    this.togglingActive.set(true);
    try {
      await this.commands.setActive(user.id, !user.isActive);
      this.toast.success(
        user.isActive ? `${user.name} foi desativado(a).` : `${user.name} foi reativado(a).`,
      );
    } catch (error) {
      this.toast.error(getErrorMessage(error));
    } finally {
      this.togglingActive.set(false);
    }
  }
}
