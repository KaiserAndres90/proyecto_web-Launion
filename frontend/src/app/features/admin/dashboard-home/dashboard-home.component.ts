import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface KpiResumen {
  titulo: string;
  valor: string;
  detalle: string;
  icono: string;
  fondo: string;
  texto: string;
  iconoFondo: string;
}

@Component({
  selector: 'app-admin-dashboard-home',
  imports: [RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent {
  readonly kpis = signal<KpiResumen[]>([]);

  constructor() {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.kpis.set([
      { titulo: 'Solicitudes Nuevas', valor: '18', detalle: '7 requieren atención', icono: 'bi-inbox-fill', fondo: 'bg-warning-subtle', texto: 'text-warning-emphasis', iconoFondo: 'bg-warning text-dark' },
      { titulo: 'Cursos Activos', valor: '9', detalle: '3 categorías disponibles', icono: 'bi-journal-bookmark-fill', fondo: 'bg-success-subtle', texto: 'text-success-emphasis', iconoFondo: 'bg-success text-white' },
      { titulo: 'Estudiantes Matriculados', valor: '248', detalle: '+12 este mes', icono: 'bi-mortarboard-fill', fondo: 'bg-secondary-subtle', texto: 'text-secondary-emphasis', iconoFondo: 'bg-dark text-white' },
    ]);
  }
}
