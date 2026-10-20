import { Router } from 'express';
import { validationResult, body } from 'express-validator';
import {
  login,
  obtenerPerfil,
  registrarUsuario,
} from '../controllers/authController.js';
import { proteger } from '../middlewares/authMiddleware.js';

const router = Router();

const validarSolicitud = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Los datos proporcionados no son válidos',
      errors: errores.array().map(({ path, msg }) => ({ field: path, message: msg })),
    });
  }

  return next();
};

router.post(
  '/register',
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().isEmail().withMessage('El email no es válido').normalizeEmail(),
  body('telefono')
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('El teléfono no es válido'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  validarSolicitud,
  registrarUsuario
);

router.post(
  '/login',
  body('email').trim().isEmail().withMessage('El email no es válido').normalizeEmail(),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  validarSolicitud,
  login
);

router.get('/me', proteger, obtenerPerfil);

export default router;
