import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
})
export class ServiciosComponent {
  protected readonly failedImages = new Set<string>();
  protected cursoSeleccionado: Curso | null = null;
  protected mostrarModalInstructores = false;

  protected readonly horasFormacionInstructor: HorasFormacionInstructor[] = [
    { cat: 'A2', tipo: 'Motos', teoria: '90', pedagogica: '24', manejo: '36', total: '150' },
    { cat: 'B1', tipo: 'Automóviles', teoria: '90', pedagogica: '24', manejo: '36', total: '150' },
    { cat: 'C1', tipo: 'Servicio Público', teoria: '110', pedagogica: '24', manejo: '36', total: '170' },
    { cat: 'C2', tipo: 'Camiones/Buses', teoria: '110', pedagogica: '28', manejo: '42', total: '180' },
    { cat: 'C3', tipo: 'Tractocamiones', teoria: '120', pedagogica: '32', manejo: '48', total: '200' },
  ];

  protected readonly cursos: Curso[] = [
    {
      code: 'a2',
      category: 'Motocicletas',
      name: 'Curso A2 (Motocicletas)',
      image: '/curso-a2.jpg',
      imageAlt: 'Estudiante realizando el curso A2 de motocicletas',
      price: '$850.000',
      priceUnit: 'COP',
      shortDescription: 'Formación para conducir motocicletas de mayor cilindraje.',
      requirements: [
        'Tener 16 años cumplidos',
        'Documento de identidad: tarjeta de identidad o cédula',
        'Certificado médico',
        'Registro en el RUNT',
      ],
      hoursTeoria: 25,
      hoursPractica: 15,
      descripcionLarga:
        'Curso para obtener la licencia de conducción categoría A2, con formación teórica y práctica para motocicletas.',
    },
    {
      code: 'b1',
      category: 'Automóviles',
      name: 'Curso B1 (Automóviles)',
      image: '/curso-b1.jpg',
      imageAlt: 'Estudiante realizando el curso B1 de automóviles',
      price: '$1.250.000',
      priceUnit: 'COP',
      shortDescription: 'Formación para conducir automóviles y vehículos particulares.',
      requirements: [
        'Tener 16 años cumplidos',
        'Documento de identidad: tarjeta de identidad o cédula',
        'Certificado médico',
        'Registro en el RUNT',
      ],
      hoursTeoria: 25,
      hoursPractica: 20,
      descripcionLarga:
        'Curso para obtener la licencia de conducción categoría B1, con formación teórica y práctica para automóviles particulares.',
    },
    {
      code: 'refuerzo',
      category: 'Práctica adicional',
      name: 'Refuerzo de Prácticas',
      image: '/curso-teoria.jpg',
      imageAlt: 'Estudiante en clase de teoría y refuerzo de conducción',
      price: '$180.000',
      priceUnit: 'COP / clase',
      shortDescription: 'Prácticas personalizadas según las necesidades del estudiante.',
      requirements: [
        'Personas con licencia vigente',
        'Quienes desean reforzar su práctica',
      ],
      hoursTeoria: null,
      hoursPractica: null,
      descripcionLarga:
        'Sesiones de práctica personalizadas. La cantidad de horas se define según las necesidades y objetivos del estudiante.',
    },
    {
      code: 'c1',
      category: 'Carros y microbuses',
      name: 'Curso C1 (Carros y Microbuses)',
      image: '/curso-c1.jfif',
      imageAlt: 'Carro o microbús de hasta 10 personas para el curso C1',
      price: '$1.800.000',
      priceUnit: 'COP',
      shortDescription: 'Vehículos con capacidad máxima de 10 personas.',
      requirements: [
        'Tener 18 años cumplidos',
        'Certificado médico',
        'Registro en el RUNT',
        'Licencia B1 vigente o, si es primera vez en servicio público, aprobación del examen teórico-práctico',
      ],
      hoursTeoria: 30,
      hoursPractica: 30,
      descripcionLarga:
        'Formación para obtener la licencia C1, dirigida a la conducción de carros y microbuses con capacidad máxima de 10 personas.',
    },
    {
      code: 'c2',
      category: 'Servicio público',
      name: 'Curso C2 (Servicio Público)',
      image: '/curso-c2.jfif',
      imageAlt: 'Vehículo para el curso C2 de servicio público',
      price: '$2.100.000',
      priceUnit: 'COP',
      shortDescription: 'Curso de recategorización para vehículos de servicio público.',
      requirements: [
        'Tener 18 años cumplidos',
        'Certificado médico',
        'Registro en el RUNT',
        'Licencia C1 vigente',
      ],
      hoursTeoria: 20,
      hoursPractica: 15,
      descripcionLarga:
        'Curso de recategorización a C2, con formación teórica y práctica para conducir vehículos de servicio público.',
    },
    {
      code: 'c3',
      category: 'Transporte de carga',
      name: 'Curso C3 (Transporte de Carga Pesada)',
      image: '/curso-c3.jfif',
      imageAlt: 'Vehículo para el curso C3 de transporte de carga pesada',
      price: '$2.400.000',
      priceUnit: 'COP',
      shortDescription: 'Curso de recategorización para transporte de carga pesada.',
      requirements: [
        'Tener 18 años cumplidos',
        'Certificado médico',
        'Registro en el RUNT',
        'Licencia C2 vigente',
      ],
      hoursTeoria: 30,
      hoursPractica: 20,
      descripcionLarga:
        'Curso de recategorización a C3, con formación teórica y práctica para conducir vehículos de transporte de carga pesada.',
    },
  ];

  protected abrirModal(curso: Curso): void {
    this.cursoSeleccionado = curso;
  }

  protected limpiarCursoSeleccionado(): void {
    this.cursoSeleccionado = null;
  }

  protected abrirModalInstructores(): void {
    this.mostrarModalInstructores = true;
  }

  protected cerrarModalInstructores(): void {
    this.mostrarModalInstructores = false;
  }

  protected markImageUnavailable(courseCode: string): void {
    this.failedImages.add(courseCode);
  }

}
