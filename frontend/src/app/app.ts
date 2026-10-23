import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  imports: [NavbarComponent, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class AppComponent {
  protected readonly showNavbar = signal(true);

  constructor(router: Router) {
    this.showNavbar.set(!router.url.startsWith('/admin'));
    router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.showNavbar.set(!event.urlAfterRedirects.startsWith('/admin')));
  }
}
