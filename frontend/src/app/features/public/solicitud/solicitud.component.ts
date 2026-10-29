import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudService } from '../../../services/solicitud-service';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css',
})
export class SolicitudComponent {
  private readonly solicitudService = inject(SolicitudService);
  private readonly router = inject(Router);

  protected submitted = false;
  protected isSubmitting = false;
  protected successMessage = '';
  protected errorMessage = '';
  protected formData = {
    nombre: '',
    telefono: '',
    email: '',
    curso: '',
  };

  protected enviarSolicitud(form: NgForm): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.solicitudService
      .crearSolicitud({
        nombre: this.formData.nombre.trim(),
        telefono: this.formData.telefono.trim(),
        email: this.formData.email.trim().toLowerCase(),
        tipo: 'contacto',
        mensaje: `Curso de interés: ${this.formData.curso}`,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMessage = 'Tu solicitud fue enviada correctamente. Nuestro equipo se pondrá en contacto contigo.';
          form.resetForm();
          this.submitted = false;

          window.setTimeout(() => {
            void this.router.navigate(['/inicio']);
          }, 2500);
        },
        error: () => {
          this.isSubmitting = false;
          this.errorMessage = 'No fue posible enviar la solicitud. Inténtalo nuevamente.';
        },
      });
  }
}
