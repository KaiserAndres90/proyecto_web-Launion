import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface DescuentoMulta {
  readonly etiqueta: string;
  readonly detalle: string;
}

interface Tramite {
  readonly id: string;
  readonly titulo: string;
  readonly descripcion: string;
  readonly icono: string;
  readonly imagen: string;
  readonly imagenAlt: string;
  readonly pasos: readonly string[];
  readonly descuentos: readonly DescuentoMulta[];
  readonly enlace: string;
  readonly textoEnlace: string;
}

@Component({
  selector: 'app-tramites',
  imports: [],
  templateUrl: './tramites.component.html',
  styleUrl: './tramites.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TramitesComponent {
  protected readonly tramites = signal<readonly Tramite[]>([
    {
      id: 'multas',
      titulo: 'Descuentos disponibles en Multas',
      descripcion:
        'Si tienes comparendos pendientes, puedes acceder a los siguientes descuentos según el tiempo en que realices el curso:',
      icono: 'bi-receipt',
      imagen: '/img/multas.jpg',
      imagenAlt: 'Multa Soluciones, aliado para gestionar infracciones de tránsito',
      pasos: [],
      descuentos: [
        {
          etiqueta: '50% de descuento:',
          detalle:
            'Si realizas el curso dentro de los 5 días hábiles siguientes a la imposición del comparendo físico.',
        },
        {
          etiqueta: '25% de descuento:',
          detalle:
            'Si realizas el curso entre el 6.º y el 20.º día hábil posterior al comparendo.',
        },
      ],
      enlace: 'https://www.fcm.org.co/simit/#/consulta',
      textoEnlace: 'Consultar aqui',
    },
    {
      id: 'aptitud',
      titulo: 'Certificado de aptitud física y coordinación motriz',
      descripcion:
        'Antes del proceso de licencia, realiza la evaluación en un centro médico autorizado por el organismo nacional de tránsito.',
      icono: 'bi-heart-pulse',
      imagen: '/img/certificado-fisico.jpg',
      imagenAlt: 'Valorar S.A.S., centro de reconocimiento de conductores',
      pasos: [
        'Solicita una cita en nuestro aliado Valorar S.A.S. centro de reconocimiento de conductores autorizado y lleva tu documento de identidad.',
        'Realiza la evaluación de aptitud física y mental y coordinación motriz.',
        'Confirma que el profesional registre el certificado en el RUNT.',
        'Verifica el resultado desde la plataforma oficial antes de iniciar tu trámite.',
      ],
      descuentos: [],
      enlace: 'https://www.runt.gov.co/centros-de-reconocimiento',
      textoEnlace: 'Agendar cita aqui',
    },
  ]);
}
