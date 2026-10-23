import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type RequestStatus = 'Recibida' | 'En revisión' | 'Aprobada';

interface RequestRecord {
  id: number;
  date: string;
  name: string;
  identityNumber: string;
  phone: string;
  course: string;
  status: RequestStatus;
}

@Component({
  selector: 'app-admin-solicitudes',
  imports: [FormsModule],
  templateUrl: './solicitudes.component.html',
})
export class SolicitudesComponent {
  protected searchTerm = '';
  protected selectedRequest: RequestRecord | null = null;
  protected requests: RequestRecord[] = [
    { id: 1, date: '22/10/2026', name: 'Laura Martínez', identityNumber: '1085273641', phone: '3001234567', course: 'A2 - Motos', status: 'Recibida' },
    { id: 2, date: '21/10/2026', name: 'Andrés Gómez', identityNumber: '1004123789', phone: '3107654321', course: 'B1 - Automóviles', status: 'En revisión' },
    { id: 3, date: '20/10/2026', name: 'Camila Rosero', identityNumber: '1085332109', phone: '3154567890', course: 'Curso de Refuerzo', status: 'Aprobada' },
    { id: 4, date: '19/10/2026', name: 'Juan Carlos López', identityNumber: '983456712', phone: '3209876543', course: 'A2 - Motos', status: 'Recibida' },
  ];

  protected get filteredRequests(): RequestRecord[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    if (!term) {
      return this.requests;
    }

    return this.requests.filter((request) =>
      [
        request.name,
        request.identityNumber,
        request.phone,
        request.course,
        request.status,
      ].some((value) => value.toLocaleLowerCase().includes(term)),
    );
  }

  protected statusClasses(status: RequestStatus): string {
    switch (status) {
      case 'Recibida':
        return 'text-bg-info';
      case 'En revisión':
        return 'text-bg-warning';
      case 'Aprobada':
        return 'text-bg-success';
    }
  }

  protected showDetails(request: RequestRecord): void {
    this.selectedRequest = request;
  }

  protected changeStatus(request: RequestRecord): void {
    const statuses: RequestStatus[] = ['Recibida', 'En revisión', 'Aprobada'];
    const currentIndex = statuses.indexOf(request.status);
    request.status = statuses[(currentIndex + 1) % statuses.length];
  }
}
