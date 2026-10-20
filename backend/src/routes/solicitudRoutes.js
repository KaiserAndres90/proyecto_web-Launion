import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  actualizarEstado,
  crearSolicitud,
  ESTADOS_SOLICITUD,
  listarSolicitudes,
  obtenerSolicitud,
} from '../controllers/solicitudController.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { autorizarRoles } from '../middlewares/roleMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const leerSolicitudes = [
  proteger,
  autorizarRoles('admin', 'auxiliar', 'gerente'),
];
const administrarSolicitudes = [
  proteger,
  autorizarRoles('admin', 'auxiliar'),
];

const validarDatosPublicos = [
  body('nombre')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 150 })
    .withMessage('El nombre no puede superar 150 caracteres'),
  body('email')
    .isEmail()
    .withMessage('El correo electrónico no es válido')
    .normalizeEmail(),
  body('telefono')
    .isString()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('El teléfono no es válido'),
  body('tipo')
    .optional()
    .isIn(['preinscripcion', 'contacto'])
    .withMessage('El tipo de solicitud no es válido'),
  body('cursoInteres')
    .optional()
    .isMongoId()
    .withMessage('El curso de interés no es válido'),
  body('cursoInteres').custom((cursoInteres, { req }) => {
    if (
      (req.body.tipo === undefined ||
        req.body.tipo === 'preinscripcion') &&
      !cursoInteres
    ) {
      throw new Error(
        'El curso de interés es obligatorio para una preinscripción'
      );
    }
    return true;
  }),
  body('mensaje')
    .optional()
    .isString()
    .withMessage('El mensaje debe ser texto')
    .trim()
    .isLength({ max: 3000 })
    .withMessage('El mensaje no puede superar 3000 caracteres'),
];

router.post('/', validarDatosPublicos, validateRequest, crearSolicitud);

router.get(
  '/',
  leerSolicitudes,
  query('estado')
    .optional()
    .isIn(ESTADOS_SOLICITUD)
    .withMessage('El estado de solicitud no es válido'),
  query('email')
    .optional()
    .isEmail()
    .withMessage('El correo electrónico del filtro no es válido'),
  validateRequest,
  listarSolicitudes
);

router.get(
  '/:id',
  leerSolicitudes,
  param('id').isMongoId().withMessage('El ID de la solicitud no es válido'),
  validateRequest,
  obtenerSolicitud
);

router.put(
  '/:id/estado',
  administrarSolicitudes,
  param('id').isMongoId().withMessage('El ID de la solicitud no es válido'),
  body('estado')
    .isIn(ESTADOS_SOLICITUD)
    .withMessage('El estado de solicitud no es válido'),
  body('observaciones')
    .optional()
    .isString()
    .withMessage('Las observaciones deben ser texto')
    .trim()
    .isLength({ max: 3000 })
    .withMessage('Las observaciones no pueden superar 3000 caracteres'),
  validateRequest,
  actualizarEstado
);

export default router;
