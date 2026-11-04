import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiCursos, Curso } from '../interfaces/cursos';

@Injectable({ providedIn: 'root' })
export class CursosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000/api/cursos';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  getAll(): Observable<Curso[]> {
    return this.http
      .get<ApiCursos>(this.apiUrl)
      .pipe(map((respuesta) => respuesta.data ?? []));
  }

  getByCategoria(categoria: string): Observable<Curso[]> {
    const params = new HttpParams().set('categoria', categoria);
    return this.http
      .get<ApiCursos>(this.apiUrl, { params })
      .pipe(map((respuesta) => respuesta.data ?? []));
  }

  crear(formData: FormData): Observable<ApiCursos> {
    return this.http.post<ApiCursos>(this.apiUrl, formData, {
      headers: this.getHeaders(),
    });
  }

  actualizar(id: string, formData: FormData): Observable<ApiCursos> {
    return this.http.put<ApiCursos>(`${this.apiUrl}/${id}`, formData, {
      headers: this.getHeaders(),
    });
  }

  eliminar(id: string): Observable<ApiCursos> {
    return this.http.delete<ApiCursos>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
