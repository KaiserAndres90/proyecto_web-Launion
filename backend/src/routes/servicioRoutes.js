import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  listarServicios,
  obtenerServicio,
} from '../controllers/servicioController.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { autorizarRoles } from '../middlewares/roleMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const administrar = [proteger, autorizarRoles('admin', 'auxiliar')];
const idValido = param('id').isMongoId().withMessage('El ID del servicio no es válido');
const camposServicio = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('descripcion').trim().notEmpty().withMessage('La descripción es obligatoria'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser igual o mayor que 0').toFloat(),
  body('descuentos').optional().isArray().withMessage('Los descuentos deben ser una lista'),
];
const camposServicioOpcionales = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('descripcion').optional().trim().notEmpty().withMessage('La descripción no puede estar vacía'),
  body('precio').optional().isFloat({ min: 0 }).withMessage('El precio debe ser igual o mayor que 0').toFloat(),
  body('descuentos').optional().isArray().withMessage('Los descuentos deben ser una lista'),
  body('activo').optional().isBoolean().withMessage('El estado activo debe ser booleano').toBoolean(),
];

router.get('/', listarServicios);
router.get('/:id', idValido, validateRequest, obtenerServicio);
router.post('/', administrar, camposServicio, validateRequest, crearServicio);
router.put(
  '/:id',
  administrar,
  idValido,
  camposServicioOpcionales,
  validateRequest,
  actualizarServicio
);
router.delete('/:id', administrar, idValido, validateRequest, eliminarServicio);

export default router;
