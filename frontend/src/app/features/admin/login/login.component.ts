import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Credential, LoginService } from '../../../services/login-service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  protected readonly credentialsForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  protected loginError = '';
  protected isSubmitting = false;

  protected handleSubmit(): void {
    console.log('works');

    this.credentialsForm.markAllAsTouched();
    this.loginError = '';

    if (!this.credentialsForm.valid) {
      console.warn('Formulario inválido', this.credentialsForm.errors, this.credentialsForm.value);
      return;
    }

    const { username, password } = this.credentialsForm.getRawValue();
    if (typeof username !== 'string' || typeof password !== 'string') {
      return;
    }

    const credential: Credential = { username, password };
    this.isSubmitting = true;
    this.changeDetector.markForCheck();

    this.loginService.login(credential).subscribe({
      next: (response) => {
        console.log('response:', response);

        if (response.resultado !== 'bien' || !response.data) {
          this.loginError = 'No fue posible iniciar sesión.';
          this.isSubmitting = false;
          this.changeDetector.markForCheck();
          return;
        }

        const token = response.data;
        localStorage.setItem('token', token);

        const decoded = this.loginService.decodeToken(token);
        console.log('Token decodificado:', decoded);

        const rolesAdministrativos = ['admin', 'gerente'];
        const rolesAuxiliares = [
          'aux_atencion',
          'aux_teoria',
          'aux_practica',
          'aux_documentacion',
        ];

        if (rolesAdministrativos.includes(decoded?.rol)) {
          void this.router.navigateByUrl('/admin/inicio');
        } else if (rolesAuxiliares.includes(decoded?.rol)) {
          void this.router.navigateByUrl('/auxiliar/inicio');
        } else {
          localStorage.removeItem('token');
          this.loginError = 'El usuario no tiene un rol autorizado para ingresar al sistema.';
          console.warn('Rol sin acceso:', decoded?.rol);
        }

        this.isSubmitting = false;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Error de login:', error);

        if (error.status === 0) {
          this.loginError = 'No se puede conectar con el servidor. Verifica que el backend esté activo en el puerto 4000.';
        } else if (error.status === 401) {
          this.loginError = 'Correo o contraseña incorrectos.';
        } else {
          this.loginError = error.error?.message || 'Ocurrió un error al iniciar sesión.';
        }

        this.isSubmitting = false;
        this.changeDetector.markForCheck();
      },
    });
  }
}
