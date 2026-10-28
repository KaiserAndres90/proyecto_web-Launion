import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  imports: [FormsModule],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  protected submitted = false;
  protected submissionMessage = '';
  protected formData = {
    fullName: '',
    phone: '',
    email: '',
    course: '',
  };

  protected submitPreRegistration(form: NgForm): void {
    this.submitted = true;
    this.submissionMessage = '';
    form.control.updateValueAndValidity();

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.submissionMessage =
      'Tus datos son válidos. La solicitud aún no se envió porque falta conectar el servicio de recepción.';
  }
}
