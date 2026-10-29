import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Tramite {
  readonly id: string;
  readonly titulo: string;
  readonly descripcion: string;
  readonly icono: string;
  readonly pasos: readonly string[];
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
      titulo: 'Multas de tránsito',
      descripcion: 'Consulta tus comparendos, verifica su estado y realiza los pagos o acuerdos autorizados por las entidades competentes.',
      icono: 'bi-receipt',
      pasos: [
        'Ingresa al portal oficial del SIMIT con tu tipo y número de documento.',
        'Consulta los comparendos asociados, las fechas y el organismo de tránsito.',
        'Revisa el descuento disponible por pronto pago o acuerdo de pago según el caso.',
        'Realiza el pago por el canal oficial y conserva el comprobante.',
      ],
      enlace: 'https://www.fcm.org.co/simit/#/consulta',
      textoEnlace: 'Consultar y pagar aquí',
    },
    {
      id: 'aptitud',
      titulo: 'Certificado de aptitud física y coordinación motriz',
      descripcion: 'Antes del proceso de licencia, realiza la evaluación en un centro médico autorizado por el organismo nacional de tránsito.',
      icono: 'bi-heart-pulse',
      pasos: [
        'Solicita una cita en un centro médico autorizado y lleva tu documento de identidad.',
        'Realiza la evaluación de aptitud física y mental y coordinación motriz.',
        'Confirma que el profesional registre el certificado en el RUNT.',
        'Verifica el resultado desde la plataforma oficial antes de iniciar tu trámite.',
      ],
      enlace: 'https://www.runt.gov.co/centros-de-reconocimiento',
      textoEnlace: 'Buscar centro autorizado',
    },
    {
      id: 'runt',
      titulo: 'Registro en el RUNT',
      descripcion: 'El RUNT centraliza la información nacional relacionada con conductores, vehículos, licencias, seguros y trámites de tránsito.',
      icono: 'bi-folder-check',
      pasos: [
        'Ingresa al portal oficial del RUNT y selecciona la opción Ciudadano.',
        'Consulta o crea tu registro con tu documento de identidad.',
        'Mantén actualizados tus datos personales y el estado de tu licencia.',
        'Antes de desplazarte, verifica las sedes y documentos requeridos para cada servicio.',
      ],
      enlace: 'https://www.runt.gov.co/',
      textoEnlace: 'Ingresar al RUNT',
    },
  ]);
}
