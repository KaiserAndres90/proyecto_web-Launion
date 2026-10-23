import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CursosComponent } from './cursos/cursos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';

describe('Administrative views', () => {
  it('filters requests and changes a request status', async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(SolicitudesComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr')).toHaveLength(4);
    const search = element.querySelector('input[name="searchRequests"]') as HTMLInputElement;
    search.value = 'Camila';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(element.textContent).toContain('Camila Rosero');

    search.value = '';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
    const changeStatusButton = element.querySelector(
      'button[aria-label="Cambiar estado de Laura Martínez"]',
    ) as HTMLButtonElement;
    changeStatusButton.click();
    fixture.detectChanges();
    expect(element.textContent).toContain('En revisión');
  });

  it('renders course cards and opens the local course editor', async () => {
    await TestBed.configureTestingModule({
      imports: [CursosComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(CursosComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('article')).toHaveLength(3);
    expect(element.textContent).toContain('$ 850.000');

    (element.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Nuevo curso');
    expect(element.querySelector('form')).toBeTruthy();
  });

  it('renders report metrics and chart placeholders', async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReportesComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Total Solicitudes');
    expect(element.textContent).toContain('Estudiantes Matriculados');
    expect(element.textContent).toContain('Cursos Activos');
    expect(element.textContent).toContain('Gráfico de Ingresos Mensuales');
    expect(element.textContent).toContain('Distribución de Cursos');
  });
});
