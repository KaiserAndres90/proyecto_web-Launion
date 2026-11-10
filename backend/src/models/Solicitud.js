import mongoose from 'mongoose';

const ESTADOS_SOLICITUD = [
  'Recibida',
  'En revisión',
  'Aprobada',
  'Rechazada',
  'Contactado',
];

const solicitudSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ['preinscripcion', 'contacto'],
      default: 'contacto',
      required: [true, 'El tipo de solicitud es obligatorio'],
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio'],
      trim: true,
      maxlength: [150, 'El nombre no puede superar 150 caracteres'],
    },
    correo: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo electrónico no es válido'],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, 'El teléfono no es válido'],
    },
    curso: {
      type: String,
      trim: true,
      maxlength: [150, 'El curso no puede superar 150 caracteres'],
      default: '',
    },
    cursoInteres: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
    },
    mensaje: {
      type: String,
      trim: true,
      maxlength: [3000, 'El mensaje no puede superar 3000 caracteres'],
      default: '',
    },
    estado: {
      type: String,
      enum: ESTADOS_SOLICITUD,
      default: 'Recibida',
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: [3000, 'Las observaciones no pueden superar 3000 caracteres'],
      default: '',
    },
  },
  { timestamps: true }
);

solicitudSchema.index({ estado: 1, createdAt: -1 });
solicitudSchema.index({ correo: 1, createdAt: -1 });

export default mongoose.model('Solicitud', solicitudSchema);
