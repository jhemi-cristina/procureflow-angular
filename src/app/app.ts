import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { ToastViewport } from './shared/toast-viewport';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastViewport],
  template: '<router-outlet /><app-toast-viewport />',
})
export class App {
  private readonly auth = inject(AuthService);
}
