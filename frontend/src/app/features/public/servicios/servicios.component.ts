import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Curso {
  readonly id: string;
  readonly nombre: string;
  readonly tipoVehiculo: string;
  readonly requisitos: readonly string[];
}

interface HorasFormacionInstructor {
  cat: string;
  tipo: string;
  teoria: string;
  pedagogica: string;
  manejo: string;
  total: string;
}

interface FormacionInstructor {
  code: string;
  name: string;
  image: string;
  imageAlt: string;
  hours: string;
  price: string;
  description: string;
}

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiciosComponent {
  private readonly destroyRef = inject(DestroyRef);
  private closeModalTimeoutId: number | null = null;

  protected readonly cursoSeleccionado = signal<Curso | null>(null);
  protected readonly cursoModalCerrando = signal(false);
  protected mostrarModalInstructores = false;
  protected instructorSeleccionado: FormacionInstructor | null = null;

  protected readonly formacionesInstructor: FormacionInstructor[] = [
    {
      code: 'instructor-a2',
      name: 'Formación instructor A2 🏍️',
      image: 'img/instructor-a2.jpg',
      imageAlt: 'Formación de instructor A2 para motocicletas',
      hours: '90 horas teoría - 60 horas práctica',
      price: '$ 3.200.000',
      description: 'Programa de formación para instructores de motocicletas categoría A2.',
    },
    {
      code: 'instructor-c2',
      name: 'Formación instructor C2',
      image: 'img/instructor-c2.jpg',
      imageAlt: 'Formación de instructor C2 para camiones',
      hours: '90 horas teoría - 70 horas práctica',
      price: '$ 5.200.000',
      description: 'Programa de formación para instructores de conducción categoría C2.',
    },
    {
      code: 'instructor-c1',
      name: 'Formación instructor C1 🚕',
      image: 'img/instructor-c1.jpg',
      imageAlt: 'Formación de instructor C1 para servicio público',
      hours: '90 horas teoría - 60 horas práctica',
      price: '$ 4.200.000',
      description: 'Programa de formación para instructores de servicio público categoría C1.',
    },
  ];

  protected readonly horasFormacionInstructor: HorasFormacionInstructor[] = [
    { cat: 'A2', tipo: 'Motocicletas', teoria: '90', pedagogica: '—', manejo: '60', total: '150' },
    { cat: 'C2', tipo: 'Camiones', teoria: '90', pedagogica: '—', manejo: '70', total: '160' },
    { cat: 'C1', tipo: 'Servicio Público', teoria: '90', pedagogica: '—', manejo: '60', total: '150' },
  ];

  constructor() {
    this.destroyRef.onDestroy(() => this.cancelCloseModal());
  }

  protected readonly cursos: readonly Curso[] = [
    {
      id: 'a1',
      nombre: 'Curso A1',
      tipoVehiculo: 'Motocicletas con cilindrada de hasta 125 c.c.',
      requisitos: ['Ser mayor de 16 años', 'Tarjeta de identidad o cédula de ciudadanía original', 'Certificado médico vigente', 'Registro en el RUNT'],
    },
    {
      id: 'a2',
      nombre: 'Curso A2',
      tipoVehiculo: 'Motocicletas, motociclos y mototriciclos con cilindrada mayor a 125 c.c.',
      requisitos: ['Ser mayor de 16 años', 'Tarjeta de identidad o cédula de ciudadanía original', 'Certificado médico vigente', 'Registro en el RUNT'],
    },
    {
      id: 'b1',
      nombre: 'Curso B1',
      tipoVehiculo: 'Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses de servicio particular.',
      requisitos: ['Ser mayor de 16 años', 'Tarjeta de identidad o cédula de ciudadanía original', 'Certificado médico vigente', 'Registro en el RUNT'],
    },
    {
      id: 'c1',
      nombre: 'Curso C1',
      tipoVehiculo: 'Automóviles, motocarros, camperos, camionetas y microbuses de servicio público.',
      requisitos: ['Ser mayor de 18 años', 'Cédula de ciudadanía original', 'Certificado médico vigente', 'Registro en el RUNT'],
    },
    {
      id: 'c2',
      nombre: 'Curso C2',
      tipoVehiculo: 'Camiones rígidos, busetas y buses de servicio público.',
      requisitos: ['Ser mayor de 18 años', 'Cédula de ciudadanía original', 'Certificado médico vigente', 'Licencia de conducción C1 vigente', 'Registro en el RUNT'],
    },
    {
      id: 'c3',
      nombre: 'Curso C3',
      tipoVehiculo: 'Vehículos articulados de servicio público.',
      requisitos: ['Ser mayor de 18 años', 'Cédula de ciudadanía original', 'Certificado médico vigente', 'Licencia de conducción C2 vigente', 'Registro en el RUNT'],
    },
  ];

  protected abrirModal(curso: Curso): void {
    this.cancelCloseModal();
    this.cerrarModalInstructores();
    this.cursoModalCerrando.set(false);
    this.cursoSeleccionado.set(curso);
  }

  protected cerrarModalCurso(): void {
    if (!this.cursoSeleccionado() || this.cursoModalCerrando()) {
      return;
    }

    this.cursoModalCerrando.set(true);
    this.closeModalTimeoutId = window.setTimeout(() => {
      this.cursoSeleccionado.set(null);
      this.cursoModalCerrando.set(false);
      this.closeModalTimeoutId = null;
    }, 220);
  }

  private cancelCloseModal(): void {
    if (this.closeModalTimeoutId !== null) {
      window.clearTimeout(this.closeModalTimeoutId);
      this.closeModalTimeoutId = null;
    }
    this.cursoModalCerrando.set(false);
  }

  @HostListener('document:keydown.escape')
  protected cerrarModalConEscape(): void {
    if (this.cursoSeleccionado()) {
      this.cerrarModalCurso();
    }
    if (this.mostrarModalInstructores) {
      this.cerrarModalInstructores();
    }
  }

  protected trackCurso(_index: number, curso: Curso): string {
    return curso.id;
  }

  protected limpiarCursoSeleccionado(): void {
    this.cancelCloseModal();
    this.cursoSeleccionado.set(null);
    this.cursoModalCerrando.set(false);
  }

  protected abrirModalInstructores(instructor?: FormacionInstructor): void {
    this.limpiarCursoSeleccionado();
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');

    this.instructorSeleccionado = instructor ?? null;
    this.mostrarModalInstructores = true;
  }

  protected cerrarModalInstructores(): void {
    const modal = document.getElementById('instructoresModal');

    if (modal) {
      modal.classList.remove('show', 'd-block');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.style.display = 'none';
    }

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');

    this.mostrarModalInstructores = false;
    this.instructorSeleccionado = null;
  }

}
