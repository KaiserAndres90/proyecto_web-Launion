import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  actualizarHorario,
  crearHorario,
  eliminarHorario,
  listarHorarios,
  obtenerHorario,
} from '../controllers/horarioController.js';
import { proteger } from '../middlewares/authMiddleware.js';
import { autorizarRoles } from '../middlewares/roleMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();
const administrar = [proteger, autorizarRoles('admin', 'auxiliar')];
const idValido = param('id').isMongoId().withMessage('El ID del horario no es válido');
const diasValidos = body('dias')
  .isArray({ min: 1 })
  .withMessage('Debe indicar al menos un día');
const validarDias = body('dias.*')
  .isIn(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'])
  .withMessage('Uno o más días no son válidos');
const horasValidas = [
  body('horaInicio').matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/).withMessage('La hora de inicio debe tener formato HH:mm'),
  body('horaFin').matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/).withMessage('La hora de fin debe tener formato HH:mm'),
];
const camposHorario = [
  body('curso').isMongoId().withMessage('El curso no es válido'),
  diasValidos,
  validarDias,
  ...horasValidas,
  body('instructor').isMongoId().withMessage('El instructor no es válido'),
  body('cupoMaximo').isInt({ min: 1 }).withMessage('El cupo máximo debe ser al menos 1').toInt(),
];
const camposHorarioOpcionales = [
  body('curso').optional().isMongoId().withMessage('El curso no es válido'),
  body('dias').optional().isArray({ min: 1 }).withMessage('Debe indicar al menos un día'),
  body('dias.*')
    .optional()
    .isIn(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'])
    .withMessage('Uno o más días no son válidos'),
  body('horaInicio').optional().matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/).withMessage('La hora de inicio debe tener formato HH:mm'),
  body('horaFin').optional().matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/).withMessage('La hora de fin debe tener formato HH:mm'),
  body('instructor').optional().isMongoId().withMessage('El instructor no es válido'),
  body('cupoMaximo').optional().isInt({ min: 1 }).withMessage('El cupo máximo debe ser al menos 1').toInt(),
  body('cuposOcupados').optional().isInt({ min: 0 }).withMessage('Los cupos ocupados no pueden ser negativos').toInt(),
  body('activo').optional().isBoolean().withMessage('El estado activo debe ser booleano').toBoolean(),
];

router.get('/', listarHorarios);
router.get('/:id', idValido, validateRequest, obtenerHorario);
router.post('/', administrar, camposHorario, validateRequest, crearHorario);
router.put(
  '/:id',
  administrar,
  idValido,
  camposHorarioOpcionales,
  validateRequest,
  actualizarHorario
);
router.delete('/:id', administrar, idValido, validateRequest, eliminarHorario);

export default router;
