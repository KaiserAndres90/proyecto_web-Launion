import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppComponent } from './app';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContactoComponent } from './features/public/contacto/contacto.component';
import { HorariosComponent } from './features/public/horarios/horarios.component';
import { InicioComponent } from './features/public/inicio/inicio.component';
import { ServiciosComponent } from './features/public/servicios/servicios.component';

@Component({
  template: '',
})
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
    expect(element.querySelector('a[routerLink="/contacto"]')?.textContent).toContain('Inscríbete Ya');
    expect(element.querySelector('.inicio-hero__image')?.getAttribute('src')).toBe('/hero-image.jpg');
    expect(element.querySelector('.inicio-locations')?.getAttribute('aria-label')).toContain('Sedes');
    expect(element.querySelectorAll('.inicio-locations .bi-geo-alt-fill')).toHaveLength(4);
    expect(element.querySelector('.inicio-locations__track')).not.toBeNull();
    expect(element.querySelector('.inicio-hero__visual-card')).toBeNull();
    expect(element.querySelector('.inicio-hero__visual')?.classList).toContain('overflow-hidden');
    const benefitCards = element.querySelectorAll(
      'section[aria-labelledby="benefits-title"] .inicio-benefit',
    );
    expect(benefitCards).toHaveLength(3);
    expect(benefitCards[0].classList).toContain('animate__fadeInUp');
    expect(element.querySelectorAll('.bento-card')).toHaveLength(3);
    expect(element.querySelector('.bento-card--main h3')?.textContent).toContain('Instructores');
    expect(element.querySelectorAll('.inicio-benefit--compact')).toHaveLength(2);
    expect(element.querySelector('.inicio-hero__glass')).not.toBeNull();
    expect(element.querySelector('.inicio-hero svg')).toBeNull();
    expect(element.querySelectorAll('.inicio-hero .floating-shape')).toHaveLength(3);
    expect(element.querySelector('#hero-title')?.classList).toContain('animate__fadeInUp');
    expect(element.querySelector('.inicio-hero__entrance--action')?.classList).toContain(
      'animate__fadeInUp',
    );
    expect(element.querySelector('.inicio-benefits .col-md-8')).not.toBeNull();
    expect(element.textContent).toContain('Instructores Certificados');
    expect(element.textContent).toContain('Vehículos Modernos');
    expect(element.textContent).toContain('Flexibilidad de Horarios');
    expect(element.querySelector('.bi-car-front-fill')).not.toBeNull();
    expect(element.querySelector('.bi-calendar-check')).not.toBeNull();
    expect(
      element.querySelector('section[aria-labelledby="home-cta-title"] a')?.textContent,
    ).toContain('Quiero empezar');
    expect(element.querySelector('#home-cta-title')?.textContent).toContain('¿Listo para empezar?');
    expect(element.querySelector('.course-grid')).toBeNull();
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
    expect(element.querySelectorAll('.inicio-testimonial')).toHaveLength(3);
    expect(element.textContent).toContain('Opiniones ilustrativas');

    const faqButtons = element.querySelectorAll<HTMLButtonElement>(
      '.inicio-faq__accordion .accordion-button',
    );
    expect(faqButtons).toHaveLength(3);
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('#faq-panel-1')?.classList).toContain('show');

    faqButtons[1].click();
    fixture.detectChanges();
    expect(faqButtons[0].getAttribute('aria-expanded')).toBe('false');
    expect(faqButtons[1].getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('#faq-panel-2')?.classList).toContain('show');
  });

  it('shows six courses, requirements, prices and registration links', async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(ServiciosComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.course-card')).toHaveLength(6);
    expect(element.textContent).toContain('Curso A2 (Motocicletas)');
    expect(element.textContent).toContain('Curso B1 (Automóviles)');
    expect(element.textContent).toContain('Refuerzo de Prácticas');
    expect(element.textContent).toContain('Curso C1 (Carros y Microbuses)');
    expect(element.textContent).toContain('Curso C2 (Servicio Público)');
    expect(element.textContent).toContain('Curso C3 (Transporte de Carga Pesada)');
    expect(element.textContent).toContain('Certificado médico');
    expect(element.textContent).toContain('$850.000');
    expect(element.textContent).toContain('$1.250.000');
    expect(element.textContent).toContain('$180.000');
    expect(element.textContent).toContain('$1.800.000');
    expect(element.textContent).toContain('$2.100.000');
    expect(element.textContent).toContain('$2.400.000');
    expect(element.querySelector('.course-card__ribbon')?.textContent).toContain('Más popular');
    expect(element.querySelectorAll('.course-card a[routerLink="/contacto"]')).toHaveLength(6);
    expect(element.querySelectorAll('.course-card .card-img-top')).toHaveLength(6);
    expect(element.querySelector('.row.row-cols-1.row-cols-md-2.row-cols-lg-3')).not.toBeNull();
    expect(element.querySelector('.instructor-banner')?.classList).toContain('animate__fadeInUp');
    expect(element.querySelector('#instructor-banner-title')?.textContent).toContain(
      'Conviértete en Instructor Certificado',
    );
    expect(element.querySelector('.instructor-banner a[routerLink="/contacto"]')).not.toBeNull();
    expect(element.querySelector('.instructor-banner__visual .bi-person-video3')).not.toBeNull();

    const c1Image = element.querySelector<HTMLImageElement>('img[src="/curso-c1.jfif"]');
    expect(c1Image?.getAttribute('alt')).toContain('curso C1');
    c1Image?.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(element.querySelector('[aria-label="Imagen no disponible: Curso C1 de carros y microbuses de hasta 10 personas"] .bi-truck'))
      .not.toBeNull();
  });

  it('renders the opening days and continuous service hours', async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(HorariosComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Lunes a Sábado');
    expect(element.textContent).toContain('7:00 AM');
    expect(element.textContent).toContain('6:00 PM');
    expect(element.textContent).toContain('Jornada Continua');
  });

  it('validates the pre-registration fields after submit', async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactoComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.is-invalid')).toHaveLength(5);
    expect(element.textContent).toContain('Pasto, Nariño');
    expect(element.querySelector('img[src="/certificacion.jpg"]')?.getAttribute('alt')).toBe(
      'Entrega de certificado',
    );
    expect(element.querySelector('.contact-form__status')).toBeNull();
  });

  it('uses router links for every public navigation item', async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const links = Array.from(element.querySelectorAll('.navbar-nav a')).map((link) =>
      link.getAttribute('href'),
    );

    expect(links).toEqual(['/inicio', '/servicios', '/horarios', '/contacto', '/contacto']);
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
