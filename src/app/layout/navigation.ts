import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import type { UserRole } from '../core/models/auth';
import type { IconName } from '../shared/ui/icon';

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  roles?: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Visão geral', href: '/', icon: 'layout-dashboard' },
  { label: 'Solicitações', href: '/solicitacoes', icon: 'clipboard-list' },
  {
    label: 'Aprovações',
    href: '/aprovacoes',
    icon: 'circle-check',
    roles: ['admin', 'approver'],
  },
  { label: 'Usuários', href: '/usuarios', icon: 'users', roles: ['admin'] },
];

export function navItemsFor(role: UserRole | undefined) {
  return NAV_ITEMS.filter((item) => !item.roles || (role && item.roles.includes(role)));
}

export function findNavItem(pathname: string) {
  return NAV_ITEMS.find((item) =>
    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  );
}

export function injectPathname() {
  const router = inject(Router);
  return toSignal(
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => router.url.split(/[?#]/)[0]),
    ),
    { initialValue: router.url.split(/[?#]/)[0] },
  );
}
