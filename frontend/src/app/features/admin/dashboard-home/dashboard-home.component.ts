import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface KpiResumen {
  titulo: string;
  valor: string;
  detalle: string;
  icono: string;
  color: 'lime' | 'yellow' | 'dark' | 'red';
}

export interface IngresoMensual {
  mes: string;
  valor: number;
}

@Component({
  selector: 'app-admin-dashboard-home',
  imports: [RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent {
  readonly kpis = signal<KpiResumen[]>([]);
  readonly ingresosMensuales = signal<IngresoMensual[]>([]);

  constructor() {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.kpis.set([
      { titulo: 'Estudiantes', valor: '248', detalle: '+12 este mes', icono: 'bi-mortarboard-fill', color: 'lime' },
      { titulo: 'Solicitudes pendientes', valor: '18', detalle: '7 requieren atención', icono: 'bi-inbox-fill', color: 'yellow' },
      { titulo: 'Cursos activos', valor: '9', detalle: '3 categorías disponibles', icono: 'bi-journal-bookmark-fill', color: 'dark' },
      { titulo: 'Ingresos estimados', valor: '$42.8M', detalle: 'Proyección mensual', icono: 'bi-cash-stack', color: 'red' },
    ]);

    this.ingresosMensuales.set([
      { mes: 'Ene', valor: 58 }, { mes: 'Feb', valor: 67 }, { mes: 'Mar', valor: 54 },
      { mes: 'Abr', valor: 72 }, { mes: 'May', valor: 88 }, { mes: 'Jun', valor: 78 },
    ]);
  }
}
