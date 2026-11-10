import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Solicitud, SolicitudService } from '../../../services/solicitud-service';

@Component({
  selector: 'app-admin-solicitudes',
  imports: [FormsModule],
  templateUrl: './solicitudes.component.html',
})
export class SolicitudesComponent implements OnInit {
  private readonly solicitudService = inject(SolicitudService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected searchTerm = '';
  protected selectedRequest: Solicitud | null = null;
  protected requests: Solicitud[] = [];
  protected isLoading = false;
  protected errorMessage = '';
  protected successMessage = '';

  protected plantillaSeleccionada = '';
  protected respuestaTexto = '';
  protected isSending = false;
  protected modalError = '';

  ngOnInit(): void {
    this.obtenerSolicitudes();
  }

  protected obtenerSolicitudes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.solicitudService.obtenerSolicitudes().subscribe({
      next: (response) => {
        this.requests = response?.data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message ||
          `No fue posible cargar las solicitudes (HTTP ${err?.status || 'desconocido'}).`;
        console.error('ERROR COMPLETO:', err);
        this.cdr.detectChanges();
      },
    });
  }

  protected get filteredRequests(): Solicitud[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    if (!term) return this.requests;

    return this.requests.filter((request) =>
      [request.nombre, request.correo, request.telefono, request.curso || '', request.estado]
        .some((value) => (value || '').toLocaleLowerCase().includes(term))
    );
  }

  protected formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString('es-CO') : 'â€”';
  }

  protected statusClasses(status: string): string {
    switch (status) {
      case 'Recibida':
        return 'text-bg-info';
      case 'En revisión':
        return 'text-bg-warning';
      case 'Aprobada':
        return 'text-bg-success';
      case 'Contactado':
        return 'text-bg-primary';
      case 'Rechazada':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  }

  protected showDetails(request: Solicitud): void {
    this.selectedRequest = request;
    this.plantillaSeleccionada = '';
    this.respuestaTexto = '';
    this.modalError = '';
  }

  protected closeModal(): void {
    if (this.isSending) return;
    this.selectedRequest = null;
    this.plantillaSeleccionada = '';
    this.respuestaTexto = '';
    this.modalError = '';
  }

  protected aplicarPlantilla(): void {
    if (!this.selectedRequest) return;
    const nombre = this.selectedRequest.nombre;
    const curso = this.selectedRequest.curso || 'el curso de tu interÃ©s';

    switch (this.plantillaSeleccionada) {
      case 'precios':
        this.respuestaTexto =
          `Hola ${nombre}, gracias por tu interÃ©s en el CEA Conductores La UniÃ³n.\n\n` +
          `Te compartimos información sobre "${curso}". Con gusto te indicaremos el valor actualizado, modalidades disponibles y próximos horarios. ` +
          `Si deseas, podemos agendar tu proceso de inscripción.\n\n` +
          `Quedamos atentos a tus inquietudes.`;
        break;
      case 'requisitos':
        this.respuestaTexto =
          `Hola ${nombre}, gracias por comunicarte con el CEA Conductores La UniÃ³n.\n\n` +
          `Para iniciar tu inscripción al curso "${curso}", generalmente se requieren: documento de identidad, certificado mÃ©dico/aptitud segÃºn la categorÃ­a y el registro correspondiente. ` +
          `Nuestro equipo puede orientarte con el detalle específico de tu caso.\n\n` +
          `¡Estaremos atentos para ayudarte!`;
        break;
      case 'personalizada':
      default:
        this.respuestaTexto = `Hola ${nombre}, gracias por tu interÃ©s en "${curso}".\n\n`;
        break;
    }
  }

  protected enviarRespuesta(): void {
    if (!this.selectedRequest) return;
    const texto = this.respuestaTexto.trim();
    if (!texto) {
      this.modalError = 'Escribe una respuesta antes de enviar.';
      return;
    }

    this.isSending = true;
    this.modalError = '';
    this.successMessage = '';

    this.solicitudService.responderSolicitud(this.selectedRequest._id, texto).subscribe({
      next: (response) => {
        this.isSending = false;
        this.successMessage = response?.message || 'Respuesta enviada y solicitud actualizada correctamente.';
        this.selectedRequest = null;
        this.plantillaSeleccionada = '';
        this.respuestaTexto = '';
        this.obtenerSolicitudes();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSending = false;
        this.modalError =
          err?.error?.message || `No fue posible enviar la respuesta (HTTP ${err?.status || 'desconocido'}).`;
        console.error('[solicitudes] Error al responder:', err);
        this.cdr.detectChanges();
      },
    });
  }
}

