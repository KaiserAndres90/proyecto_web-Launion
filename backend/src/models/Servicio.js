import mongoose from 'mongoose';

const descuentoSchema = new mongoose.Schema(
  {
    porcentaje: {
      type: Number,
      min: [0, 'El descuento no puede ser menor a 0'],
      max: [100, 'El descuento no puede superar el 100 %'],
      default: 0,
    },
    fechaInicio: {
      type: Date,
      default: null,
    },
    fechaFin: {
      type: Date,
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const servicioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio'],
      trim: true,
      maxlength: [120, 'El nombre no puede superar 120 caracteres'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción del servicio es obligatoria'],
      trim: true,
      maxlength: [2000, 'La descripción no puede superar 2000 caracteres'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    descuentos: {
      type: [descuentoSchema],
      default: [],
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

servicioSchema.pre('validate', function () {
  for (const descuento of this.descuentos) {
    if (
      descuento.fechaInicio &&
      descuento.fechaFin &&
      descuento.fechaFin < descuento.fechaInicio
    ) {
      descuento.invalidate(
        'fechaFin',
        'La fecha de finalización debe ser posterior a la fecha de inicio'
      );
    }
  }
});

servicioSchema.index({ nombre: 1 }, { unique: true });
servicioSchema.index({ activo: 1 });

export default mongoose.model('Servicio', servicioSchema);
