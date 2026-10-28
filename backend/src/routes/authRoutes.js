import { Router } from 'express';
import { validationResult, body } from 'express-validator';
import {
  login,
  forgotPassword,
  obtenerPerfil,
  registrarUsuario,
} from '../controllers/authController.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

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
  proteger,
  checkRole(['admin', 'gerente']),
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
  body('rol')
    .optional()
    .isIn(['admin', 'gerente', 'aux_teoria', 'aux_practica', 'aux_documentacion', 'aux_atencion'])
    .withMessage('El rol proporcionado no es válido'),
  validarSolicitud,
  registrarUsuario
);

router.post(
  '/login',
  body().custom((valor, { req }) => {
    const identificador = req.body.email || req.body.username;

    if (!identificador || typeof req.body.password !== 'string' || req.body.password.length === 0) {
      throw new Error('El email o usuario y la contraseña son obligatorios');
    }

    if (req.body.email && typeof req.body.email === 'string') {
      const emailNormalizado = req.body.email.trim();
      if (!/^\S+@\S+\.\S+$/.test(emailNormalizado)) {
        throw new Error('El email no es válido');
      }
      req.body.email = emailNormalizado.toLowerCase();
    }

    return true;
  }),
  validarSolicitud,
  login
);

router.post('/forgot-password', forgotPassword);

router.get('/me', proteger, obtenerPerfil);

export default router;
