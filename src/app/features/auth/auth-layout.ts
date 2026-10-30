import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon, type IconName } from '../../shared/ui/icon';

const HIGHLIGHTS: { icon: IconName; text: string }[] = [
  { icon: 'clipboard-list', text: 'Crie e acompanhe solicitações de compra em um só lugar.' },
  { icon: 'circle-check', text: 'Fluxo de aprovação com rastreabilidade de cada decisão.' },
  { icon: 'shield-check', text: 'Acesso seguro com autenticação JWT e perfis de permissão.' },
];

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink, Icon],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly switchPrompt = input.required<string>();
  readonly switchLabel = input.required<string>();
  readonly switchLink = input.required<string>();

  protected readonly highlights = HIGHLIGHTS;
  protected readonly bars = [40, 62, 48, 75, 58, 88, 70];
}
