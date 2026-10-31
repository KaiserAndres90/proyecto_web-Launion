import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sede-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sede-detalle.html', // 👈 Corregido (sin .component)
  styleUrl: './sede-detalle.css'      // 👈 Corregido (sin .component)
})
export class SedeDetalleComponent implements OnInit {
  sedeId: string = '';
  sedeInfo: any = {};

  baseDatosSedes: any = {
    'pasto': {
      nombre: 'Sede Principal - Pasto',
      direccion: 'Calle 18 # 20-45, Centro',
      telefono: '300 341 2175',
      horario: 'Lunes a Viernes: 7:00 AM - 12:00 PM y 2:00 PM - 5:00 PM',
      mapaIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15957.696292019553!2d-77.2855346!3d1.2136105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2ed48647923c33%3A0xe5d6b3ad8a1d1693!2sPasto%2C%20Nari%C3%B1o!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco'
    },
    'ipiales': {
      nombre: 'Sede Ipiales',
      direccion: 'Carrera 5 # 12-30, Centro',
      telefono: '315 000 0000',
      horario: 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM',
      mapaIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15949.49199552389!2d-77.6468076!3d0.8276891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a36f6d1e36f33%3A0x9532c9c9c5c5c5c5!2sIpiales%2C%20Nari%C3%B1o!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco'
    },
    'la-union': {
      nombre: 'Sede La Unión',
      direccion: 'Calle 3 # 4-12, Barrio Centro',
      telefono: '320 000 0000',
      horario: 'Lunes a Viernes: 7:30 AM - 12:30 PM y 1:30 PM - 5:30 PM',
      mapaIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15950.123456789!2d-77.1333333!3d1.6000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a36f6d1e36f33%3A0x9532c9c9c5c5c5c5!2sLa%20Uni%C3%B3n%2C%20Nari%C3%B1o!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco'
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sedeId = params['id'];
      this.sedeInfo = this.baseDatosSedes[this.sedeId];
    });
  }
}