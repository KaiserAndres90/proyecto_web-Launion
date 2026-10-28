import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal(false);
  readonly usuario = signal({ nombre: 'Andrés Gómez', rol: 'Administrador' });

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  cerrarSesion(): void {
    this.router.navigate(['/admin/login']);
  }
}
