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
    const isAdminRoute = url.startsWith('/admin');
    this.showNavbar.set(!isAdminRoute);
    this.showFooter.set(!isAdminRoute);
  }
}
