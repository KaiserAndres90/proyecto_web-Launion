import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SolicitudPublica {
  nombre: string;
  telefono: string;
  email: string;
  tipo: 'contacto';
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000/api/v1/solicitudes';

  crearSolicitud(solicitud: SolicitudPublica): Observable<unknown> {
    return this.http.post(this.apiUrl, solicitud);
  }
}
