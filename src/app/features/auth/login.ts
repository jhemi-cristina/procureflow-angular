import { Component, computed, inject, signal } from '@angular/core';
import { getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import { hasErrors, isEmail, type FieldErrors } from '../../core/validation';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { TextField } from '../../shared/ui/text-field';
import { AuthLayout } from './auth-layout';

interface LoginValues {
  email: string;
  password: string;
}

function validate(values: LoginValues): FieldErrors<keyof LoginValues> {
  const errors: FieldErrors<keyof LoginValues> = {};
  if (!isEmail(values.email)) errors.email = 'Informe um e-mail válido.';
  if (values.password.length < 6) errors.password = 'A senha deve ter pelo menos 6 caracteres.';
  return errors;
}

@Component({
  selector: 'app-login',
  imports: [AuthLayout, Button, Icon, TextField],
  templateUrl: './login.html',
  styleUrl: './auth-form.css',
})
export class Login {
  private readonly auth = inject(AuthService);

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  private readonly submitted = signal(false);

  protected readonly errors = computed(() =>
    this.submitted() ? validate({ email: this.email(), password: this.password() }) : {},
  );

  protected async submit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);
    this.formError.set(null);
    if (hasErrors(this.errors()) || this.submitting()) return;

    this.submitting.set(true);
    try {
      await this.auth.signIn({ email: this.email(), password: this.password() });
    } catch (error) {
      this.formError.set(
        getErrorMessage(error, 'Não foi possível entrar. Verifique suas credenciais.'),
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
