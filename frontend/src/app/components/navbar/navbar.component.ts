import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected menuOpen = false;

  protected closeMenu(): void {
    this.menuOpen = false;
  }

  protected toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
