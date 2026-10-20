import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,15}$/, 'Teléfono inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'Mínimo 6 caracteres'],
      select: false, // no se devuelve en consultas por defecto
    },
    rol: {
      type: String,
      enum: ['admin', 'gerente', 'auxiliar'],
      default: 'auxiliar',
    },
    activo: {
      type: Boolean,
      default: true,
    },
    ultimoAcceso: {
      type: Date,
      default: null,
    },
    // 🔐 Recuperación de contraseña
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// Middleware: hashear password antes de guardar (Compatible con Mongoose 9)
// ─────────────────────────────────────────────
usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────
// Método: comparar contraseñas (login)
// ─────────────────────────────────────────────
usuarioSchema.methods.matchPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// ─────────────────────────────────────────────
// Método: generar token de recuperación
// ─────────────────────────────────────────────
usuarioSchema.methods.generarResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// ─────────────────────────────────────────────
// Método estático: hashear un token recibido
// ─────────────────────────────────────────────
usuarioSchema.statics.hashToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export default mongoose.model('Usuario', usuarioSchema);