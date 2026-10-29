import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
})
export class Recover {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly recoverForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly isLoading = signal(false);
  protected readonly emailEnviado = signal(false);

  protected handleRecover(): void {
    this.recoverForm.markAllAsTouched();

    if (this.recoverForm.invalid) {
      return;
    }

    const email = this.recoverForm.controls.email.value?.trim() ?? '';
    console.log('Solicitud simulada de recuperación:', email);

    this.isLoading.set(true);

    // Simulación de carga; permite reemplazar fácilmente esta parte por una API real.
    const timeoutId = window.setTimeout(() => {
      this.isLoading.set(false);
      this.emailEnviado.set(true);
      this.recoverForm.disable();
    }, 900);

    this.destroyRef.onDestroy(() => window.clearTimeout(timeoutId));
  }
}
