import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ContactoComponent } from './features/public/contacto/contacto.component';
import { HorariosComponent } from './features/public/horarios/horarios.component';
import { InicioComponent } from './features/public/inicio/inicio.component';
import { ServiciosComponent } from './features/public/servicios/servicios.component';

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
    expect(element.querySelector('.course-grid')).toBeNull();
  });

  it('shows the three courses, requirements and pricing information', async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(ServiciosComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.course-card')).toHaveLength(3);
    expect(element.textContent).toContain('Curso A2');
    expect(element.textContent).toContain('Curso B1');
    expect(element.textContent).toContain('Curso de Refuerzo');
    expect(element.textContent).toContain('Certificado médico');
    expect(element.textContent).toContain('planes de financiación');
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
  });
});
