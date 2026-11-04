import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Curso } from '../../../interfaces/cursos';
import { CursosService } from '../../../services/cursos-service';

@Component({
  selector: 'app-admin-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.component.html',
})
export class CursosComponent implements OnInit {
  private readonly cursosService = inject(CursosService);

  readonly cursos = signal<Curso[]>([]);
  readonly mostrarFormulario = signal(false);
  readonly modo = signal<'crear' | 'editar'>('crear');
  readonly selectedFile = signal<File | null>(null);
  readonly imagenBaseURL = 'http://localhost:4000/uploads/';

  protected feedback = '';
  cursoForm: Curso = this.resetCurso();

  ngOnInit(): void {
    this.obtenerCursos();
  }

  obtenerCursos(): void {
    this.cursosService.getAll().subscribe({
      next: (cursos) => this.cursos.set(cursos),
      error: (error) => {
        console.error('Error al obtener cursos:', error);
        this.feedback = 'No fue posible cargar los cursos.';
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
  }

  resetCurso(): Curso {
    return {
      nombre: '',
      descripcion: '',
      categoria: 'B1',
      duracionHoras: 1,
      precio: 0,
      imagen: '',
    };
  }

  prepararCrear(): void {
    this.modo.set('crear');
    this.cursoForm = this.resetCurso();
    this.selectedFile.set(null);
    this.feedback = '';
    this.mostrarFormulario.set(true);
  }

  seleccionarParaEditar(curso: Curso): void {
    this.modo.set('editar');
    this.cursoForm = { ...curso };
    this.selectedFile.set(null);
    this.feedback = '';
    this.mostrarFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.cursoForm = this.resetCurso();
    this.selectedFile.set(null);
  }

  crearCurso(): void {
    const file = this.selectedFile();
    if (!file) {
      alert('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.cursoForm.nombre);
    formData.append('descripcion', this.cursoForm.descripcion);
    formData.append('categoria', this.cursoForm.categoria);
    formData.append('duracionHoras', String(this.cursoForm.duracionHoras));
    formData.append('precio', String(this.cursoForm.precio));
    formData.append('imagen', file);

    this.cursosService.crear(formData).subscribe({
      next: () => {
        alert('Curso creado correctamente');
        this.cancelarFormulario();
        this.obtenerCursos();
      },
      error: (error) => {
        console.error('Error al crear el curso:', error);
        alert(error.error?.message || 'Error al crear el curso');
      },
    });
  }

  actualizarCurso(): void {
    if (!this.cursoForm._id) {
      alert('El curso no tiene ID');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.cursoForm.nombre);
    formData.append('descripcion', this.cursoForm.descripcion);
    formData.append('categoria', this.cursoForm.categoria);
    formData.append('duracionHoras', String(this.cursoForm.duracionHoras));
    formData.append('precio', String(this.cursoForm.precio));

    const file = this.selectedFile();
    if (file) {
      formData.append('imagen', file);
    }

    this.cursosService.actualizar(this.cursoForm._id, formData).subscribe({
      next: () => {
        alert('Curso actualizado correctamente');
        this.cancelarFormulario();
        this.obtenerCursos();
      },
      error: (error) => {
        console.error('Error al actualizar el curso:', error);
        alert(error.error?.message || 'Error al actualizar el curso');
      },
    });
  }

  eliminarCurso(id: string): void {
    if (!confirm('¿Está seguro de eliminar este curso?')) return;

    this.cursosService.eliminar(id).subscribe({
      next: () => this.obtenerCursos(),
      error: (error) => console.error('Error al eliminar el curso:', error),
    });
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  }

}
