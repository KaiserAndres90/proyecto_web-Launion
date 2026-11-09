import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home.component';

describe('DashboardHomeComponent', () => {
  it('renders the three requested KPI cards', async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardHomeComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('.kpi-card')).toHaveLength(3);
    expect(element.textContent).toContain('Solicitudes Nuevas');
    expect(element.textContent).toContain('Cursos Activos');
    expect(element.textContent).toContain('Estudiantes Matriculados');
  });
});
