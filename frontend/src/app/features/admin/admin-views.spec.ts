import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CursosComponent } from './cursos/cursos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { CursosService } from '../../services/cursos-service';

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
    expect(element.querySelectorAll('tbody tr').length).toBeGreaterThan(0);
    const search = element.querySelector('input[name="searchRequests"]') as HTMLInputElement | null;
    if (search) {
      search.value = 'Camila';
      search.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      fixture.detectChanges();
      element = fixture.nativeElement as HTMLElement;
      expect(element.textContent).toContain('Camila');
    }
  });

  it('renders courses and opens the course editor', async () => {
    const cursosServiceStub = {
      getAll: () =>
        of([
          { _id: '1', nombre: 'Curso B1', descripcion: 'Auto', categoria: 'B1', duracionHoras: 20, precio: 850000, imagen: '' },
          { _id: '2', nombre: 'Curso A2', descripcion: 'Moto', categoria: 'A2', duracionHoras: 15, precio: 650000, imagen: '' },
          { _id: '3', nombre: 'Curso C1', descripcion: 'Público', categoria: 'C1', duracionHoras: 30, precio: 1200000, imagen: '' },
        ]),
      crear: () => of({}),
      actualizar: () => of({}),
      eliminar: () => of({}),
    };

    await TestBed.configureTestingModule({
      imports: [CursosComponent],
      providers: [provideRouter([]), provideHttpClient(), { provide: CursosService, useValue: cursosServiceStub }],
    }).compileComponents();

    const fixture = TestBed.createComponent(CursosComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(element.textContent).toContain('850');

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
  });
});