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
      id: 'pasto',
      nombre: 'Sede Principal - Pasto',
      direccion: 'Calle 18 # 20-45, Centro',
      telefono: '300 341 2175',
      descripcion: 'Nuestra sede principal equipada con la mejor tecnología y flota de vehículos.',
      icono: 'bi-building'
    },
    {
      id: 'ipiales',
      nombre: 'Sede Ipiales',
      direccion: 'Carrera 5 # 12-30, Centro',
      telefono: '315 000 0000',
      descripcion: 'Atención personalizada y formación de calidad para los conductores de la frontera.',
      icono: 'bi-geo-alt'
    },
    {
      id: 'la-union',
      nombre: 'Sede La Unión',
      direccion: 'Calle 3 # 4-12, Barrio Centro',
      telefono: '320 000 0000',
      descripcion: 'Formación vial de excelencia para el norte del departamento de Nariño.',
      icono: 'bi-signpost-split'
    }
  ];
}