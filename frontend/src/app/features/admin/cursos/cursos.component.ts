import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface Course {
  id: number;
  name: string;
  price: number;
  schedules: string[];
}

@Component({
  selector: 'app-admin-cursos',
  imports: [FormsModule],
  templateUrl: './cursos.component.html',
})
export class CursosComponent {
  protected courses: Course[] = [
    { id: 1, name: 'Curso A2 - Motos', price: 850000, schedules: ['Lun - Vie · 7:00 AM', 'Sábados · 8:00 AM'] },
    { id: 2, name: 'Curso B1 - Automóviles', price: 1250000, schedules: ['Lun - Vie · 9:00 AM', 'Sábados · 1:00 PM'] },
    { id: 3, name: 'Curso de Refuerzo', price: 180000, schedules: ['Lun - Vie · 2:00 PM', 'Sábados · 10:00 AM'] },
  ];

  protected editorOpen = false;
  protected editingCourseId: number | null = null;
  protected nextId = 4;
  protected feedback = '';
  protected draft = this.emptyDraft();

  protected openNewCourse(): void {
    this.editingCourseId = null;
    this.draft = this.emptyDraft();
    this.feedback = '';
    this.editorOpen = true;
  }

  protected editCourse(course: Course): void {
    this.editingCourseId = course.id;
    this.draft = {
      name: course.name,
      price: course.price,
      schedule: course.schedules.join(', '),
    };
    this.feedback = '';
    this.editorOpen = true;
  }

  protected saveCourse(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const updated: Course = {
      id: this.editingCourseId ?? this.nextId++,
      name: this.draft.name.trim(),
      price: Number(this.draft.price),
      schedules: this.draft.schedule
        .split(',')
        .map((schedule) => schedule.trim())
        .filter(Boolean),
    };

    if (this.editingCourseId === null) {
      this.courses = [...this.courses, updated];
      this.feedback = 'Curso agregado a esta vista de demostración.';
    } else {
      this.courses = this.courses.map((course) =>
        course.id === this.editingCourseId ? updated : course,
      );
      this.feedback = 'Curso actualizado en esta vista de demostración.';
    }

    this.editorOpen = false;
  }

  protected deleteCourse(course: Course): void {
    this.courses = this.courses.filter((item) => item.id !== course.id);
    this.feedback = `${course.name} se quitó de esta vista de demostración.`;
    if (this.editingCourseId === course.id) {
      this.editorOpen = false;
    }
  }

  protected closeEditor(): void {
    this.editorOpen = false;
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(price);
  }

  private emptyDraft(): { name: string; price: number | null; schedule: string } {
    return { name: '', price: null, schedule: '' };
  }
}
