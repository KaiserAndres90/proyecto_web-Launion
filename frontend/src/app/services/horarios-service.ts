import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiHorarios, Horario } from '../interfaces/horarios';

@Injectable({ providedIn: 'root' })
export class HorariosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000/api/horarios';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  getAll(): Observable<Horario[]> {
    return this.http
      .get<ApiHorarios>(this.apiUrl)
      .pipe(map((respuesta) => respuesta.data ?? []));
  }

  crear(horario: Horario): Observable<ApiHorarios> {
    return this.http.post<ApiHorarios>(this.apiUrl, horario, { headers: this.getHeaders() });
  }

  actualizar(id: string, horario: Partial<Horario>): Observable<ApiHorarios> {
    return this.http.put<ApiHorarios>(`${this.apiUrl}/${id}`, horario, { headers: this.getHeaders() });
  }

  eliminar(id: string): Observable<ApiHorarios> {
    return this.http.delete<ApiHorarios>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
