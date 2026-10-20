import mongoose from 'mongoose';

const ESTADOS_SOLICITUD = [
  'Recibida',
  'En revisión',
  'Aprobada',
  'Rechazada',
];

const solicitudSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ['preinscripcion', 'contacto'],
      default: 'preinscripcion',
      required: [true, 'El tipo de solicitud es obligatorio'],
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio'],
      trim: true,
      maxlength: [150, 'El nombre no puede superar 150 caracteres'],
    },
    email: {
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
    cursoInteres: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curso',
      required: [
        function () {
          return this.tipo === 'preinscripcion';
        },
        'El curso de interés es obligatorio para una preinscripción',
      ],
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
solicitudSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model('Solicitud', solicitudSchema);
