export interface Horario {
  _id?: string;
  tipo: 'administrativo' | 'teoria' | 'practica';
  dias: string[];
  horaInicio: string;
  horaFin: string;
  cupoMaximo: number;
  cuposOcupados?: number;
  activo?: boolean;
}

export interface ApiHorarios {
  success?: boolean;
  result?: boolean;
  message: string;
  data: Horario[];
}
