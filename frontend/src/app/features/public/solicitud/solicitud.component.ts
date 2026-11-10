import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { SolicitudService } from '../../../services/solicitud-service';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css',
})
export class SolicitudComponent {
  private readonly fb = inject(FormBuilder);
  private readonly solicitudService = inject(SolicitudService);

  protected submitted = false;
  protected isLoading = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected readonly solicitudForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,15}$/)]],
    correo: ['', [Validators.required, Validators.email]],
    curso: ['', [Validators.required]],
  });

  protected get f() {
    return this.solicitudForm.controls;
  }

  protected onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { nombre, telefono, correo, curso } = this.solicitudForm.getRawValue();

    this.solicitudService
      .crearSolicitud({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: correo.trim().toLowerCase(),
        curso,
        tipo: 'contacto',
        mensaje: `Curso de interés: ${curso}`,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage =
            response?.message || 'Tu solicitud fue enviada correctamente. Nuestro equipo se pondrá en contacto contigo.';
          this.solicitudForm.reset();
          this.submitted = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err?.error?.message || 'No fue posible enviar la solicitud. Inténtalo nuevamente.';
        },
      });
  }
}
