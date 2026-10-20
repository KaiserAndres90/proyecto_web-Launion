import mongoose from 'mongoose';

const DIAS_SEMANA = [
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
  'domingo',
];

const horarioSchema = new mongoose.Schema(
  {
    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
      required: [true, 'El curso es obligatorio'],
    },
    dias: {
      type: [
        {
          type: String,
          enum: DIAS_SEMANA,
        },
      ],
      required: [true, 'Debe especificar al menos un día'],
      validate: {
        validator: (dias) => Array.isArray(dias) && dias.length > 0,
        message: 'Debe especificar al menos un día',
      },
    },
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio es obligatoria'],
      match: [/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'La hora debe tener formato HH:mm'],
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de finalización es obligatoria'],
      match: [/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'La hora debe tener formato HH:mm'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El instructor es obligatorio'],
    },
    cupoMaximo: {
      type: Number,
      required: [true, 'El cupo máximo es obligatorio'],
      min: [1, 'El cupo máximo debe ser al menos 1'],
      validate: {
        validator: Number.isInteger,
        message: 'El cupo máximo debe ser un número entero',
      },
    },
    cuposOcupados: {
      type: Number,
      default: 0,
      min: [0, 'Los cupos ocupados no pueden ser negativos'],
      validate: {
        validator: Number.isInteger,
        message: 'Los cupos ocupados deben ser un número entero',
      },
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

horarioSchema.pre('validate', function () {
  if (this.horaInicio && this.horaFin && this.horaInicio >= this.horaFin) {
    this.invalidate(
      'horaFin',
      'La hora de finalización debe ser posterior a la hora de inicio'
    );
  }

  if (
    Number.isInteger(this.cuposOcupados) &&
    Number.isInteger(this.cupoMaximo) &&
    this.cuposOcupados > this.cupoMaximo
  ) {
    this.invalidate(
      'cuposOcupados',
      'Los cupos ocupados no pueden superar el cupo máximo'
    );
  }
});

horarioSchema.virtual('cuposDisponibles').get(function () {
  return Math.max(this.cupoMaximo - this.cuposOcupados, 0);
});

horarioSchema.index({ curso: 1, activo: 1 });
horarioSchema.index({ instructor: 1, dias: 1 });

export default mongoose.model('Horario', horarioSchema);
