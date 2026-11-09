import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HorariosComponent } from './features/public/horarios/horarios.component';
import { InicioComponent } from './features/public/inicio/inicio.component';
import { ServiciosComponent } from './features/public/servicios/servicios.component';
import { SolicitudComponent } from './features/public/solicitud/solicitud.component';

@Component({ template: '' })
class RoutePlaceholderComponent {}

describe('Public pages', () => {
  it('renders the hero and its registration route', async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Aprende a conducir con los mejores');
    expect(element.querySelector('a[routerLink="/solicitud"]')?.textContent).toContain('Solicitar');
    expect(element.querySelector('.inicio-hero__image')?.getAttribute('src')).toBe('/hero-image.jpg');
    expect(element.querySelector('.inicio-locations')?.getAttribute('aria-label')).toContain('Sedes');
    expect(element.querySelector('.inicio-locations__track')).not.toBeNull();
    expect(element.querySelectorAll('section[aria-labelledby="benefits-title"] .inicio-benefit').length).toBeGreaterThan(0);
    expect(element.querySelector('#hero-title')?.classList).toContain('animate__fadeInUp');
    expect(element.textContent).toContain('Instructores Certificados');
  });

  it('shows the enrollment steps, illustrative testimonials and interactive FAQ', async () => {
    await TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.inicio-step')).toHaveLength(4);
    expect(element.querySelectorAll('.inicio-testimonial').length).toBeGreaterThan(0);
    expect(element.textContent).toContain('Opiniones ilustrativas');

    const faqButtons = element.querySelectorAll<HTMLButtonElement>('.inicio-faq__accordion .accordion-button');
    expect(faqButtons.length).toBeGreaterThan(0);
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('true');
    faqButtons[1].click();
    fixture.detectChanges();
    expect(faqButtons[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('shows six courses and requirement modals', async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(ServiciosComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.course-card')).toHaveLength(6);
    expect(element.textContent).toContain('Curso A2');
    expect(element.textContent).toContain('Curso B1');
    expect(element.querySelector('.course-card__ribbon')?.textContent).toContain('solicitado');
    expect(element.querySelectorAll('.course-card button')).toHaveLength(6);
  });

  it('renders schedule information', async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HorariosComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Lunes a Viernes');
    expect(element.textContent).toContain('7:00 AM');
    expect(element.textContent).toContain('Consultar disponibilidad');
  });

  it('validates the pre-registration fields after submit', async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    const fixture = TestBed.createComponent(SolicitudComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.is-invalid').length).toBeGreaterThan(0);
  });

  it('uses router links for public navigation items', async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const links = Array.from(element.querySelectorAll('.navbar-nav a')).map((link) => link.getAttribute('href'));

    expect(links).toContain('/inicio');
    expect(links).toContain('/servicios');
    expect(links).toContain('/horarios');
    expect(links).toContain('/contacto');
    expect(links).toContain('/solicitud');
    expect(element.querySelector('.brand__logo')?.getAttribute('src')).toBe('/logo-cea.jpg');
  });
});

describe('App layout', () => {
  it('shows the footer on public routes and hides it in admin', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: 'inicio', component: RoutePlaceholderComponent },
          { path: 'admin/login', component: RoutePlaceholderComponent },
        ]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin/login');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-footer')).toBeNull();

    await router.navigateByUrl('/inicio');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-footer')).not.toBeNull();
  });
});