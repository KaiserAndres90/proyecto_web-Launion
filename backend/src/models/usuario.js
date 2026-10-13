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
      enum: ['admin', 'auxiliar'],
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
// Middleware: hashear password antes de guardar
// ─────────────────────────────────────────────
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
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
  // 1. Genera un token aleatorio (el que se envía al usuario)
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hashea el token y lo guarda en la BD (seguridad)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Expira en 15 minutos
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // este es el que va por email
};

// ─────────────────────────────────────────────
// Método estático: hashear un token recibido (para comparar en BD)
// ─────────────────────────────────────────────
usuarioSchema.statics.hashToken = function (token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export default mongoose.model('Usuario', usuarioSchema);