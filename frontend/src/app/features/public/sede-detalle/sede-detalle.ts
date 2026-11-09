import { Component, HostListener, OnInit, inject } from '@angular/core';
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
  private readonly route = inject(ActivatedRoute);

  sedeId: string = '';
  sedeInfo: any = {};
  fotoAmpliada = false;

  baseDatosSedes: any = {
    'pasto': {
      nombre: 'Sede Principal - Pasto',
      direccion: 'Calle 18 # 20-45, Centro',
      telefono: '300 341 2175',
      horario: 'Lunes a Viernes: 7:00 AM - 12:00 PM y 2:00 PM - 5:00 PM'
    },
    'ipiales': {
      nombre: 'Sede Ipiales',
      direccion: 'Carrera 1 #1A-53, Barrio Centenario',
      telefono: '300 341 2175 / 323 228 6235 / 300 469 7345',
      horario: 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM',
      imagen: 'img/ipiales-sede.jpeg',
      imagenAlt: 'Foto de la Sede Ipiales - CEA Conductores La Unión'
    },
    'la-union': {
      nombre: 'Sede La Unión',
      direccion: 'Calle 3 # 4-12, Barrio Centro',
      telefono: '320 000 0000',
      horario: 'Lunes a Viernes: 7:30 AM - 12:30 PM y 1:30 PM - 5:30 PM',
      imagen: 'img/sede-union.jpe',
      imagenAlt: 'Foto de la Sede La Unión - CEA Conductores La Unión'
    }
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sedeId = params['id'];
      this.sedeInfo = this.baseDatosSedes[this.sedeId] ?? null;
    });
  }

  usarImagenFallback(event: Event): void {
    const imagen = event.target as HTMLImageElement;
    if (!imagen.src.endsWith('/hero-image.jpg')) {
      imagen.src = '/hero-image.jpg';
    }
  }

  abrirFoto(): void {
    if (this.sedeInfo?.imagen) {
      this.fotoAmpliada = true;
    }
  }

  cerrarFoto(): void {
    this.fotoAmpliada = false;
  }

  @HostListener('document:keydown.escape')
  cerrarFotoConEscape(): void {
    if (this.fotoAmpliada) {
      this.cerrarFoto();
    }
  }
}