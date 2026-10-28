import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface MenuOption {
  label: string;
  placeholder: string;
}

@Component({
  selector: 'app-auxiliar-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './auxiliar-dashboard.component.html',
  styleUrl: './auxiliar-dashboard.component.css',
})
export class AuxiliarDashboardComponent {
  private readonly router = inject(Router);

  readonly role: string | null;
  readonly menuOptions: MenuOption[];

  constructor() {
    this.role = this.getRole();
    const optionsByRole: Record<string, MenuOption[]> = {
      aux_atencion: [
        { label: 'Bandeja de Solicitudes', placeholder: 'Solicitudes recibidas desde el sitio web' },
        { label: 'Novedades', placeholder: 'Novedades y comunicaciones internas' },
      ],
      aux_practica: [
        { label: 'Programación de Clases', placeholder: 'Programación y horarios de clases prácticas' },
        { label: 'Vehículos', placeholder: 'Disponibilidad y asignación de vehículos' },
      ],
      aux_documentacion: [
        { label: 'Revisión de Documentos', placeholder: 'Documentos pendientes de revisión' },
      ],
      aux_teoria: [
        { label: 'Programación Teórica', placeholder: 'Clases y contenidos teóricos' },
      ],
    };

    this.menuOptions = this.role ? optionsByRole[this.role] ?? [] : [];
  }

  logout(): void {
    localStorage.removeItem('token');
    void this.router.navigate(['/admin/login']);
  }

  private getRole(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode<{ rol?: string }>(token).rol ?? null;
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  }
}
