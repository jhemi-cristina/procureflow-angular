import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'cadastro',
    title: 'Criar conta',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register').then((m) => m.Register),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell').then((m) => m.AppShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Visão geral',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'solicitacoes',
        title: 'Solicitações',
        loadComponent: () =>
          import('./features/purchase-requests/requests-page').then((m) => m.RequestsPage),
      },
      {
        path: 'aprovacoes',
        title: 'Aprovações',
        loadComponent: () =>
          import('./features/purchase-requests/approvals-page').then((m) => m.ApprovalsPage),
      },
      {
        path: 'usuarios',
        title: 'Usuários',
        loadComponent: () => import('./features/users/users-page').then((m) => m.UsersPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
