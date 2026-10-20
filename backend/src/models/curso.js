import mongoose from 'mongoose';

// Mapa categoría → tipo de servicio (según normativa colombiana)
const MAPA_SERVICIO = {
  A1: 'particular',
  A2: 'particular',
  B1: 'particular',
  B2: 'particular',
  B3: 'particular',
  C1: 'público',
  C2: 'público',
  C3: 'público',
};

// Descripción de cada categoría
const DESCRIPCION_CATEGORIAS = {
  A1: 'Motocicletas hasta 125 c.c.',
  A2: 'Motocicletas, motocarros y mototriciclos mayores a 125 c.c.',
  B1: 'Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses particulares',
  B2: 'Camiones rígidos, busetas y buses particulares',
  B3: 'Vehículos articulados particulares',
  C1: 'Automóviles, camperos, camionetas y microbuses de servicio público',
  C2: 'Camiones rígidos, busetas y buses de servicio público',
  C3: 'Vehículos articulados de servicio público',
};

// Edad mínima por tipo de servicio
const EDAD_MINIMA_PARTICULAR = 16;
const EDAD_MINIMA_PUBLICO = 18;

const cursoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del curso es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    categoria: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
      required: [true, 'La categoría es obligatoria'],
    },
    tipoServicio: {
      type: String,
      enum: ['particular', 'público'],
    },
    descripcionCategoria: {
      type: String,
    },
    duracionHoras: {
      type: Number,
      required: [true, 'La duración en horas es obligatoria'],
      min: [1, 'La duración debe ser al menos 1 hora'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    edadMinima: {
      type: Number,
    },
    requisitos: {
      type: [String],
      default: [],
    },
    imagen: {
      type: String,
      default: '',
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// Middleware: auto-asignar campos según categoría (Mongoose 9)
// ─────────────────────────────────────────────
cursoSchema.pre('validate', function () {
  if (this.categoria && MAPA_SERVICIO[this.categoria]) {
    this.tipoServicio = MAPA_SERVICIO[this.categoria];
    this.descripcionCategoria = DESCRIPCION_CATEGORIAS[this.categoria];

    // Regla legal: edad mínima según tipo de servicio
    this.edadMinima =
      this.tipoServicio === 'público'
        ? EDAD_MINIMA_PUBLICO
        : EDAD_MINIMA_PARTICULAR;
  }
});

// Índices para búsquedas rápidas
cursoSchema.index({ categoria: 1 });
cursoSchema.index({ tipoServicio: 1 });

export default mongoose.model('Curso', cursoSchema);