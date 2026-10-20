import mongoose from 'mongoose';

const novedadSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [180, 'El título no puede superar 180 caracteres'],
    },
    contenido: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      trim: true,
      maxlength: [10000, 'El contenido no puede superar 10000 caracteres'],
    },
    imagen: {
      type: String,
      trim: true,
      default: '',
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El autor es obligatorio'],
    },
    publicada: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

novedadSchema.index({ publicada: 1, createdAt: -1 });

export default mongoose.model('Novedad', novedadSchema);
