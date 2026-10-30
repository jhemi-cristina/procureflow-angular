import { Component, computed, inject, signal } from '@angular/core';
import { ApiError, getErrorMessage } from '../../core/api/api-client';
import { AuthService } from '../../core/auth/auth.service';
import { hasErrors, isEmail, type FieldErrors } from '../../core/validation';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icon';
import { TextField } from '../../shared/ui/text-field';
import { AuthLayout } from './auth-layout';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type RegisterErrors = FieldErrors<keyof RegisterValues>;

function validate(values: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {};
  const name = values.name.trim();

  if (name.length < 2) errors.name = 'Informe seu nome completo.';
  else if (name.length > 150) errors.name = 'O nome deve ter no máximo 150 caracteres.';

  if (!isEmail(values.email)) errors.email = 'Informe um e-mail válido.';
  else if (values.email.length > 180) errors.email = 'O e-mail deve ter no máximo 180 caracteres.';

  if (values.password.length < 8) errors.password = 'A senha deve ter pelo menos 8 caracteres.';
  else if (values.password.length > 72) {
    errors.password = 'A senha deve ter no máximo 72 caracteres.';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem.';
  }

  return errors;
}

@Component({
  selector: 'app-register',
  imports: [AuthLayout, Button, Icon, TextField],
  templateUrl: './register.html',
  styleUrl: './auth-form.css',
})
export class Register {
  private readonly auth = inject(AuthService);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly confirmPassword = signal('');
  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  private readonly serverErrors = signal<RegisterErrors>({});
  private readonly submitted = signal(false);

  private readonly values = computed(() => ({
    name: this.name(),
    email: this.email(),
    password: this.password(),
    confirmPassword: this.confirmPassword(),
  }));

  protected readonly errors = computed(() => ({
    ...this.serverErrors(),
    ...(this.submitted() ? validate(this.values()) : {}),
  }));

  protected async submit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);
    this.serverErrors.set({});
    this.formError.set(null);
    if (hasErrors(this.errors()) || this.submitting()) return;

    this.submitting.set(true);
    try {
      await this.auth.signUp({
        name: this.name().trim(),
        email: this.email(),
        password: this.password(),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        this.serverErrors.set({ email: error.message });
      } else {
        this.formError.set(getErrorMessage(error, 'Não foi possível criar sua conta.'));
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
