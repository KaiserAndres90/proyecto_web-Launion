import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-recover',
  templateUrl: './recover.component.html',
})
export class Recover {
  private readonly http = inject(HttpClient);

  protected readonly recoverForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  protected readonly mensaje = signal<string>('');

  protected handleRecover(): void {
    if (this.recoverForm.valid) {
      const email = this.recoverForm.value.email;

      this.http
        .post<any>('http://localhost:3000/api/auth/forgot-password', { email })
        .subscribe({
          next: (res) => {
            this.mensaje.set(res.message || 'Revisa tu correo para ver el nuevo password');
          },
          error: (err) => {
            this.mensaje.set('Ocurrió un error al enviar el correo');
            console.log(err);
          },
        });
    } else {
      this.mensaje.set('Por favor ingrese un correo electrónico válido');
    }
  }
}
