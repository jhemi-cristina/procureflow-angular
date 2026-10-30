import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DecisionDialog } from '../features/purchase-requests/decision-dialog';
import { RequestDetailsDialog } from '../features/purchase-requests/request-details-dialog';
import { RequestDialogs } from '../features/purchase-requests/request-dialogs';
import { RequestFormDialog } from '../features/purchase-requests/request-form-dialog';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar, RequestFormDialog, RequestDetailsDialog, DecisionDialog],
  providers: [RequestDialogs],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  protected readonly dialogs = inject(RequestDialogs);
  protected readonly menuOpen = signal(false);

  protected closeMenu() {
    this.menuOpen.set(false);
  }
}
