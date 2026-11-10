import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SolicitudPublica {
  nombre: string;
  telefono: string;
  correo: string;
  curso: string;
  tipo: 'contacto';
  mensaje: string;
}

export interface SolicitudResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Solicitud {
  _id: string;
  nombre: string;
  correo: string;
  telefono: string;
  curso?: string;
  mensaje?: string;
  estado: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class SolicitudService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000/api/solicitudes';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  crearSolicitud(solicitud: SolicitudPublica): Observable<SolicitudResponse> {
    return this.http.post<SolicitudResponse>(this.apiUrl, solicitud);
  }

  obtenerSolicitudes(): Observable<SolicitudResponse<Solicitud[]>> {
    return this.http.get<SolicitudResponse<Solicitud[]>>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  listarSolicitudes(): Observable<SolicitudResponse<Solicitud[]>> {
    return this.obtenerSolicitudes();
  }

  responderSolicitud(id: string, respuesta: string): Observable<SolicitudResponse<Solicitud>> {
    return this.http.post<SolicitudResponse<Solicitud>>(
      `${this.apiUrl}/${id}/responder`,
      { respuesta },
      { headers: this.getHeaders() }
    );
  }
}
