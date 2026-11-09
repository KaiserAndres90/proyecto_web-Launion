import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuxiliarDashboardComponent } from './auxiliar-dashboard.component';

describe('AuxiliarDashboardComponent', () => {
  beforeEach(() => {
    const payload = btoa(JSON.stringify({ rol: 'aux_atencion' }));
    localStorage.setItem('token', `header.${payload}.signature`);
  });

  afterEach(() => localStorage.removeItem('token'));

  it('filters the requests table and exposes no administrative links', async () => {
    await TestBed.configureTestingModule({
      imports: [AuxiliarDashboardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(AuxiliarDashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    let element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(element.querySelectorAll('tbody .badge')).toHaveLength(4);
    expect(element.querySelector('a[href="/admin/cursos"]')).toBeNull();
    expect(element.querySelector('a[href="/admin/reportes"]')).toBeNull();

    const search = element.querySelector('input[type="search"]') as HTMLInputElement;
    search.value = 'Laura';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(element.textContent).toContain('Laura Martínez');
    expect(element.textContent).toContain('En revisión');
  });
});
