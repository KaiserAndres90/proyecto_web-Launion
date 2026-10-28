import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  actualizarNovedad,
  crearNovedad,
  eliminarNovedad,
  listarNovedades,
  obtenerNovedad,
} from '../controllers/novedadController.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { autorizarRoles } from '../middlewares/roleMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const administrar = [proteger, autorizarRoles('admin', 'gerente')];
const idValido = param('id').isMongoId().withMessage('El ID de la novedad no es válido');
const camposNovedad = [
  body('titulo').trim().notEmpty().withMessage('El título es obligatorio'),
  body('contenido').trim().notEmpty().withMessage('El contenido es obligatorio'),
  body('imagen').optional().isString().withMessage('La imagen debe ser texto'),
  body('publicada').optional().isBoolean().withMessage('El estado publicada debe ser booleano').toBoolean(),
];
const camposNovedadOpcionales = [
  body('titulo').optional().trim().notEmpty().withMessage('El título no puede estar vacío'),
  body('contenido').optional().trim().notEmpty().withMessage('El contenido no puede estar vacío'),
  body('imagen').optional().isString().withMessage('La imagen debe ser texto'),
  body('publicada').optional().isBoolean().withMessage('El estado publicada debe ser booleano').toBoolean(),
];

router.get('/', listarNovedades);
router.get('/:id', idValido, validateRequest, obtenerNovedad);
router.post('/', administrar, camposNovedad, validateRequest, crearNovedad);
router.put(
  '/:id',
  administrar,
  idValido,
  camposNovedadOpcionales,
  validateRequest,
  actualizarNovedad
);
router.delete('/:id', administrar, idValido, validateRequest, eliminarNovedad);

export default router;
