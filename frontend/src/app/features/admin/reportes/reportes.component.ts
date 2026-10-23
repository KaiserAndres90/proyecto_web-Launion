import { Component } from '@angular/core';

interface Metric {
  label: string;
  value: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-admin-reportes',
  templateUrl: './reportes.component.html',
})
export class ReportesComponent {
  protected readonly metrics: Metric[] = [
    { label: 'Total Solicitudes', value: '128', description: 'Solicitudes recibidas', icon: 'bi-inbox' },
    { label: 'Estudiantes Matriculados', value: '84', description: 'Matrículas registradas', icon: 'bi-people' },
    { label: 'Cursos Activos', value: '3', description: 'Programas disponibles', icon: 'bi-journal-bookmark' },
  ];
}
