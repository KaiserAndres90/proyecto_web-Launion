import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Curso {
  code: string;
  category: string;
  name: string;
  image: string;
  imageAlt: string;
  price: string;
  priceUnit: string;
  shortDescription: string;
  requirements: string[];
  hoursTeoria: number | null;
  hoursPractica: number | null;
  hoursLabel: string;
  descripcionLarga: string;
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
})
export class ServiciosComponent {
  protected readonly failedImages = new Set<string>();
  protected cursoSeleccionado: Curso | null = null;
  protected cursoModalCerrando = false;
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

  protected readonly cursos: Curso[] = [
    {
      code: 'a2', category: 'Motocicletas',
      name: 'Curso conducción motocicletas 🏍️ A2', image: 'img/curso-a2.jpg',
      imageAlt: 'Curso de conducción de motocicletas categoría A2',
      price: '$ 1.100.000', priceUnit: 'COP',
      shortDescription: 'Formación para conducir motocicletas categoría A2.',
      requirements: ['Tener 16 años cumplidos', 'Documento de identidad', 'Certificado médico', 'Registro en el RUNT'],
      hoursTeoria: 30, hoursPractica: 15, hoursLabel: '30 horas de teoría - 15 horas práctica',
      descripcionLarga: 'Curso de conducción de motocicletas A2 con formación teórica y práctica.',
    },
    {
      code: 'b1', category: 'Automóviles',
      name: 'Curso conducción particular B1', image: 'img/curso-b1.jpg',
      imageAlt: 'Curso de conducción particular categoría B1',
      price: '$ 1.300.000', priceUnit: 'COP',
      shortDescription: 'Formación para conducir automóviles particulares.',
      requirements: ['Tener 16 años cumplidos', 'Documento de identidad', 'Certificado médico', 'Registro en el RUNT'],
      hoursTeoria: 30, hoursPractica: 20, hoursLabel: '30 horas teoría - 20 horas práctica',
      descripcionLarga: 'Curso de conducción particular categoría B1 con formación teórica y práctica.',
    },
    {
      code: 'c1', category: 'Servicio Público',
      name: 'Curso de conducción público C1 🚕', image: 'img/curso-c1.jpg',
      imageAlt: 'Curso de conducción público categoría C1',
      price: '$ 1.500.000', priceUnit: 'COP',
      shortDescription: 'Formación para conducción de servicio público categoría C1.',
      requirements: ['Tener 18 años cumplidos', 'Certificado médico', 'Registro en el RUNT', 'Requisitos vigentes para servicio público'],
      hoursTeoria: 30, hoursPractica: 30, hoursLabel: '30 horas teoría - 30 horas práctica',
      descripcionLarga: 'Curso de conducción público C1 con formación teórica y práctica.',
    },
    {
      code: 'c2', category: 'Camión',
      name: 'Curso de conducción C2 camión 🚛', image: 'img/curso-c2.jpg',
      imageAlt: 'Curso de conducción categoría C2 para camión',
      price: '$ 1.800.000', priceUnit: 'COP',
      shortDescription: 'Formación para conducción de vehículos categoría C2.',
      requirements: ['Tener 18 años cumplidos', 'Certificado médico', 'Registro en el RUNT', 'Licencia C1 vigente'],
      hoursTeoria: 40, hoursPractica: 15, hoursLabel: '40 horas teoría - 15 horas práctica',
      descripcionLarga: 'Curso de conducción C2 para camiones con formación teórica y práctica.',
    },
    {
      code: 'c3', category: 'Tractocamión',
      name: 'Curso conducción C3 tractocamión', image: 'img/curso-c3.jpg',
      imageAlt: 'Curso de conducción categoría C3 para tractocamión',
      price: '$ 3.300.000', priceUnit: 'COP',
      shortDescription: 'Formación para conducción de tractocamiones categoría C3.',
      requirements: ['Tener 18 años cumplidos', 'Certificado médico', 'Registro en el RUNT', 'Licencia C2 vigente'],
      hoursTeoria: 45, hoursPractica: 20, hoursLabel: '45 horas teoría - 20 horas práctica',
      descripcionLarga: 'Curso de conducción C3 para tractocamiones con formación teórica y práctica.',
    },
  ];

  protected abrirModal(curso: Curso): void {
    this.cerrarModalInstructores();
    this.cursoModalCerrando = false;
    this.cursoSeleccionado = curso;
    document.body.classList.remove('modal-open');
  }

  protected cerrarModalCurso(): void {
    if (!this.cursoSeleccionado) {
      return;
    }

    this.cursoModalCerrando = true;
    window.setTimeout(() => {
      this.cursoSeleccionado = null;
      this.cursoModalCerrando = false;
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    }, 220);
  }

  @HostListener('document:keydown.escape')
  protected cerrarModalConEscape(): void {
    if (this.cursoSeleccionado) {
      this.cerrarModalCurso();
    }
    if (this.mostrarModalInstructores) {
      this.cerrarModalInstructores();
    }
  }

  protected limpiarCursoSeleccionado(): void {
    this.cursoSeleccionado = null;
    this.cursoModalCerrando = false;
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

  protected markImageUnavailable(courseCode: string): void {
    this.failedImages.add(courseCode);
  }

}
