import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarItem } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  protected readonly sidebarCollapsed = signal(false);
  protected readonly usuario = signal({ nombre: 'Administrador', rol: 'Administrador' });
  protected readonly sidebarItems: readonly SidebarItem[] = [
    { label: 'Inicio', route: '/admin/inicio', icon: 'bi-grid-1x2-fill' },
    { label: 'Solicitudes', route: '/admin/solicitudes', icon: 'bi-inbox-fill' },
    { label: 'Cursos', route: '/admin/cursos', icon: 'bi-journal-bookmark-fill' },
    { label: 'Horarios', route: '/admin/horarios', icon: 'bi-calendar-week-fill' },
    { label: 'Reportes', route: '/admin/reportes', icon: 'bi-file-earmark-bar-graph-fill' },
  ];

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  protected cerrarSesion(): void {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  }
}
