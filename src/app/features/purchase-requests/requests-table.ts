import { Component, inject, input } from '@angular/core';
import type { PurchaseRequest } from '../../core/models/purchase-request';
import { BrlPipe, ShortDatePipe } from '../../shared/pipes/format.pipes';
import { Avatar } from '../../shared/ui/avatar';
import { Icon } from '../../shared/ui/icon';
import { StatusBadge } from '../../shared/ui/status-badge';
import { RequestActions } from './request-actions';
import { RequestDialogs } from './request-dialogs';

@Component({
  selector: 'app-requests-table',
  imports: [Avatar, Icon, StatusBadge, RequestActions, BrlPipe, ShortDatePipe],
  templateUrl: './requests-table.html',
  styleUrl: './requests-table.css',
})
export class RequestsTable {
  protected readonly dialogs = inject(RequestDialogs);

  readonly requests = input.required<PurchaseRequest[]>();
}
