import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sedes.html',
  styleUrl: './sedes.css'
})
export class SedesComponent {
  sedes = [
    {
      id: 'ipiales',
      nombre: 'Sede Ipiales',
      direccion: 'Carrera 1 #1A-53, Barrio Centenario',
      telefono: '315 000 0000',
      descripcion: 'Atención personalizada y formación de calidad para los conductores de la frontera.',
      imagen: 'img/sede-ipiales.jpe',
      alt: 'Sede Ipiales'
    },
    {
      id: 'la-union',
      nombre: 'Sede La Unión',
      direccion: 'Calle 3 # 4-12, Barrio Centro',
      telefono: '320 000 0000',
      descripcion: 'Formación vial de excelencia para el norte del departamento de Nariño.',
      imagen: 'img/sede-union.jpe',
      alt: 'Sede La Unión'
    }
  ];

  usarImagenFallback(event: Event): void {
    const imagen = event.target as HTMLImageElement;

    if (!imagen.src.endsWith('/hero-image.jpg')) {
      imagen.src = 'hero-image.jpg';
    }
  }
}