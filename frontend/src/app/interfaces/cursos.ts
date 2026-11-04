export interface Curso {
  _id?: string;
  nombre: string;
  descripcion: string;
  categoria: 'A1' | 'A2' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3';
  duracionHoras: number;
  precio: number;
  imagen?: string;
  activo?: boolean;
}

export interface ApiCursos {
  result?: boolean;
  success?: boolean;
  message: string;
  data: Curso[];
}
