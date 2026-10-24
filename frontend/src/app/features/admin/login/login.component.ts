import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected isLoading = false;
  protected errorMessage = '';

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    remember: new FormControl(false, { nonNullable: true }),
  });

  constructor(private readonly router: Router) {}

  protected async onSubmit(): Promise<void> {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Ingresa un correo válido y una contraseña para continuar.';
      return;
    }

    this.isLoading = true;
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));

    try {
      const navigated = await this.router.navigateByUrl('/admin/inicio');
      if (!navigated) {
        this.errorMessage = 'No fue posible abrir el panel. Inténtalo de nuevo.';
      }
    } catch {
      this.errorMessage = 'Ocurrió un error al abrir el panel. Inténtalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}
