import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BackgroundComponent } from './shared/background/background.component';

@Component({
  imports: [BackgroundComponent, NavbarComponent, FooterComponent, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class AppComponent {
  protected readonly showNavbar = signal(true);
  protected readonly showFooter = signal(true);

  constructor(router: Router) {
    this.setPublicLayoutVisibility(router.url);
    router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.setPublicLayoutVisibility(event.urlAfterRedirects));
  }

  private setPublicLayoutVisibility(url: string): void {
    const normalizedUrl = url.split('?')[0];
    const isAdminRoute = normalizedUrl.startsWith('/admin');
    const knownPublicRoutes = ['/inicio', '/servicios', '/horarios', '/tramites', '/contacto', '/solicitud', '/auxiliar', '/auxiliar/inicio'];
    const isKnownRoute = normalizedUrl === '/' || knownPublicRoutes.includes(normalizedUrl);
    const isNotFoundRoute = !isAdminRoute && !isKnownRoute;

    this.showNavbar.set(!isAdminRoute && !isNotFoundRoute);
    this.showFooter.set(!isAdminRoute && !isNotFoundRoute);
  }
}
