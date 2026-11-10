import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  actualizarEstado,
  crearSolicitud,
  ESTADOS_SOLICITUD,
  listarSolicitudes,
  obtenerSolicitud,
  responderSolicitud,
} from '../controllers/solicitudController.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const leerSolicitudes = [
  proteger,
  checkRole(['admin', 'gerente', 'aux_atencion']),
];
const administrarSolicitudes = [
  proteger,
  checkRole(['admin', 'gerente']),
];

const validarDatosPublicos = [
  body('nombre')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 150 })
    .withMessage('El nombre no puede superar 150 caracteres'),
  body('correo')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('El correo electrónico no es válido')
    .normalizeEmail(),
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('El correo electrónico no es válido')
    .normalizeEmail(),
  body().custom((_, { req }) => {
    if (!req.body.correo && !req.body.email) {
      throw new Error('El correo electrónico es obligatorio');
    }
    return true;
  }),
  body('telefono')
    .isString()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage('El teléfono no es válido'),
  body('tipo')
    .optional()
    .isIn(['preinscripcion', 'contacto'])
    .withMessage('El tipo de solicitud no es válido'),
  body('curso')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage('El curso no puede superar 150 caracteres'),
  body('cursoInteres')
    .optional({ values: 'falsy' })
    .isMongoId()
    .withMessage('El curso de interés no es válido'),
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

router.post(
  '/:id/responder',
  leerSolicitudes,
  param('id').isMongoId().withMessage('El ID de la solicitud no es válido'),
  body('respuesta')
    .isString()
    .withMessage('La respuesta debe ser texto')
    .trim()
    .notEmpty()
    .withMessage('El texto de la respuesta es obligatorio')
    .isLength({ max: 5000 })
    .withMessage('La respuesta no puede superar 5000 caracteres'),
  validateRequest,
  responderSolicitud
);

export default router;
