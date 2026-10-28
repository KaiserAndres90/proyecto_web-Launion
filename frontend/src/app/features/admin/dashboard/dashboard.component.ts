import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly isAdmin: boolean;

  constructor(private readonly router: Router) {
    this.isAdmin = this.getRole() === 'admin';
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }

  private getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode<{ rol?: string }>(token).rol ?? null;
    } catch {
      return null;
    }
  }
}
