import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Horario } from '../../../interfaces/horarios';
import { HorariosService } from '../../../services/horarios-service';

@Component({
  selector: 'app-admin-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horarios-admin.component.html',
})
export class HorariosAdminComponent implements OnInit {
  private readonly horariosService = inject(HorariosService);

  readonly horarios = signal<Horario[]>([]);
  readonly mostrarFormulario = signal(false);
  readonly modo = signal<'crear' | 'editar'>('crear');

  feedback = '';
  horarioForm: Horario = this.resetHorario();
  readonly diasDisponibles = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  ngOnInit(): void {
    this.obtenerHorarios();
  }

  obtenerHorarios(): void {
    this.horariosService.getAll().subscribe({
      next: (horarios) => this.horarios.set(horarios),
      error: (error) => {
        console.error('Error al obtener horarios:', error);
        this.feedback = 'No fue posible cargar los horarios.';
      },
    });
  }

  resetHorario(): Horario {
    return {
      tipo: 'administrativo',
      dias: [],
      horaInicio: '07:00',
      horaFin: '12:00',
      cupoMaximo: 20,
      cuposOcupados: 0,
    } as Horario;
  }

  prepararCrear(): void {
    this.modo.set('crear');
    this.horarioForm = this.resetHorario();
    this.feedback = '';
    this.mostrarFormulario.set(true);
  }

  seleccionarParaEditar(horario: Horario): void {
    this.modo.set('editar');
    this.horarioForm = {
      ...horario,
    };
    this.feedback = '';
    this.mostrarFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.horarioForm = this.resetHorario();
  }

  crearHorario(): void {
    const horario = this.horarioPayload();
    if (!horario) return;
    this.horariosService.crear(horario).subscribe({
      next: () => {
        alert('Horario creado correctamente');
        this.cancelarFormulario();
        this.obtenerHorarios();
      },
      error: (error) => {
        console.error('Error al crear el horario:', error);
        alert(error.error?.message || 'Error al crear el horario');
      },
    });
  }

  actualizarHorario(): void {
    if (!this.horarioForm._id) {
      alert('El horario no tiene ID');
      return;
    }
    const horario = this.horarioPayload();
    if (!horario) return;
    this.horariosService.actualizar(this.horarioForm._id, horario).subscribe({
      next: () => {
        alert('Horario actualizado correctamente');
        this.cancelarFormulario();
        this.obtenerHorarios();
      },
      error: (error) => {
        console.error('Error al actualizar el horario:', error);
        alert(error.error?.message || 'Error al actualizar el horario');
      },
    });
  }

  private horarioPayload(): Horario | null {
    if (this.horarioForm.dias.length === 0) {
      alert('Selecciona al menos un día');
      return null;
    }
    return {
      tipo: this.horarioForm.tipo,
      dias: [...this.horarioForm.dias],
      horaInicio: this.horarioForm.horaInicio,
      horaFin: this.horarioForm.horaFin,
      cupoMaximo: Number(this.horarioForm.cupoMaximo),
      cuposOcupados: Number(this.horarioForm.cuposOcupados ?? 0),
      activo: this.horarioForm.activo ?? true,
    };
  }

  eliminarHorario(id: string): void {
    if (!confirm('¿Está seguro de eliminar este horario?')) return;
    this.horariosService.eliminar(id).subscribe({
      next: () => this.obtenerHorarios(),
      error: (error) => console.error('Error al eliminar el horario:', error),
    });
  }

  nombreTipo(horario: Horario): string {
    const tipos: Record<Horario['tipo'], string> = {
      administrativo: 'Administrativo',
      teoria: 'Teoría',
      practica: 'Práctica',
    };
    return tipos[horario.tipo];
  }

  toggleDia(dia: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const dias = checked
      ? [...new Set([...this.horarioForm.dias, dia])]
      : this.horarioForm.dias.filter((valor) => valor !== dia);
    this.horarioForm = { ...this.horarioForm, dias };
  }

  diaSeleccionado(dia: string): boolean {
    return this.horarioForm.dias.includes(dia);
  }
}
