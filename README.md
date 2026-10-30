# ProcureFlow Angular

Versão em **Angular 22** do front-end do ProcureFlow, com o mesmo layout e as mesmas
funcionalidades do [procureflow-web](../procureflow-web) (Next.js). Consome a
[ProcureFlow API](../procureflow-api) (NestJS + PostgreSQL + JWT) nos mesmos endpoints.

## Funcionalidades

- Login e cadastro com JWT, sessão no `sessionStorage` com expiração automática e logout em `401`
- Visão geral com indicadores, gráfico mensal, fila pendente e solicitações recentes
- Solicitações com busca, filtro por status e paginação; criar/editar rascunhos e enviar
- Fila de aprovação com aprovar/rejeitar e justificativa (`admin` e `approver`)
- Gestão de usuários (perfil e ativação) para `admin`
- Layout responsivo com menu lateral no mobile

## Stack

- Componentes standalone, signals (`input`, `model`, `computed`, `linkedSignal`) e change detection zoneless
- `HttpClient` com um cache de consultas leve (`core/query`) no lugar do TanStack Query
- CSS por componente com os mesmos design tokens globais do procureflow-web
- Ícones Lucide inline (`shared/ui/icon.ts`), sem dependências extras

## Estrutura

```
src/app/
  core/        # api, auth (sessão, guards), cache de consultas, modelos, formatação
  shared/      # componentes de UI (Button, Modal, TextField, Panel...) e pipes
  layout/      # AppShell, Sidebar, Topbar
  features/    # auth, dashboard, purchase-requests, users
```

## Como rodar

1. Suba a API na porta `3000`.
2. Rode o front:

   ```bash
   npm install
   npm start
   ```

3. Acesse [http://localhost:4200](http://localhost:4200).

Em desenvolvimento, o `ng serve` encaminha `/api` para `http://localhost:3000`
(`proxy.conf.json`), então não é preciso alterar o `CORS_ORIGINS` da API. Em produção,
sirva o front e a API na mesma origem ou ajuste `src/environments/environment.ts`
para uma URL liberada no CORS.

| Script          | Descrição                          |
| --------------- | ---------------------------------- |
| `npm start`     | Servidor de desenvolvimento (4200) |
| `npm run build` | Build de produção                  |
| `npm test`      | Testes unitários (Vitest)          |
