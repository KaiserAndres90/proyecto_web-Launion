import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  actualizarCurso,
  crearCurso,
  eliminarCurso,
  listarCursos,
  obtenerCurso,
} from '../controllers/cursoController.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { autorizarRoles } from '../middlewares/roleMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const administrar = [proteger, autorizarRoles('admin', 'auxiliar')];
const idValido = param('id').isMongoId().withMessage('El ID del curso no es válido');
const camposCurso = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es obligatoria'),
  body('categoria')
    .isIn(['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'])
    .withMessage('La categoría no es válida'),
  body('duracionHoras')
    .isInt({ min: 1 })
    .withMessage('La duración debe ser un entero mayor que 0')
    .toInt(),
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número igual o mayor que 0')
    .toFloat(),
];
const camposCursoOpcionales = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('descripcion')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía'),
  body('categoria')
    .optional()
    .isIn(['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'])
    .withMessage('La categoría no es válida'),
  body('duracionHoras')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La duración debe ser un entero mayor que 0')
    .toInt(),
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número igual o mayor que 0')
    .toFloat(),
  body('requisitos').optional().isArray().withMessage('Los requisitos deben ser una lista'),
  body('imagen').optional().isString().withMessage('La imagen debe ser texto'),
  body('activo').optional().isBoolean().withMessage('El estado activo debe ser booleano').toBoolean(),
];

router.get('/', listarCursos);
router.get('/:id', idValido, validateRequest, obtenerCurso);
router.post('/', administrar, camposCurso, validateRequest, crearCurso);
router.put(
  '/:id',
  administrar,
  idValido,
  camposCursoOpcionales,
  validateRequest,
  actualizarCurso
);
router.delete('/:id', administrar, idValido, validateRequest, eliminarCurso);

export default router;
