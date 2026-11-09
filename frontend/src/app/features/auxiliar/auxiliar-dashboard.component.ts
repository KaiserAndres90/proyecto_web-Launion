import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { SidebarComponent, SidebarItem } from '../../shared/sidebar/sidebar.component';

interface MenuOption {
  label: string;
  placeholder: string;
}

interface SolicitudAuxiliar {
  nombre: string;
  curso: string;
  fecha: string;
  estado: 'Recibida' | 'En revisión' | 'Aprobada';
}

@Component({
  selector: 'app-auxiliar-dashboard',
  imports: [RouterLink, SidebarComponent],
  templateUrl: './auxiliar-dashboard.component.html',
  styleUrl: './auxiliar-dashboard.component.css',
})
export class AuxiliarDashboardComponent {
  private readonly router = inject(Router);

  readonly role: string | null;
  readonly menuOptions: MenuOption[];
  readonly sidebarItems: readonly SidebarItem[] = [
    { label: 'Inicio', route: '/auxiliar/inicio', icon: 'bi-grid-1x2-fill' },
  ];
  readonly solicitudes: readonly SolicitudAuxiliar[] = [
    { nombre: 'Camila Rosero', curso: 'Automóvil', fecha: '2026-10-28', estado: 'Recibida' },
    { nombre: 'Laura Martínez', curso: 'Motocicleta', fecha: '2026-10-27', estado: 'En revisión' },
    { nombre: 'Andrés Pantoja', curso: 'Automóvil', fecha: '2026-10-26', estado: 'Aprobada' },
    { nombre: 'Daniela Gómez', curso: 'Motocicleta', fecha: '2026-10-25', estado: 'Recibida' },
  ];
  searchTerm = '';

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

  get solicitudesFiltradas(): readonly SolicitudAuxiliar[] {
    const termino = this.searchTerm.trim().toLocaleLowerCase();
    if (!termino) return this.solicitudes;

    return this.solicitudes.filter(({ nombre, curso, estado }) =>
      `${nombre} ${curso} ${estado}`.toLocaleLowerCase().includes(termino),
    );
  }

  actualizarBusqueda(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  claseEstado(estado: SolicitudAuxiliar['estado']): string {
    switch (estado) {
      case 'Recibida':
        return 'text-bg-primary';
      case 'En revisión':
        return 'text-bg-warning';
      case 'Aprobada':
        return 'text-bg-success';
    }
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
