import Solicitud from '../models/Solicitud.js';
import { created, notFound, ok } from '../utils/responseHelpers.js';

const ESTADOS_SOLICITUD = [
  'Recibida',
  'En revisión',
  'Aprobada',
  'Rechazada',
];

export const crearSolicitud = async (req, res, next) => {
  try {
    const { nombre, email, telefono, tipo, cursoInteres, mensaje } = req.body;
    const solicitud = await Solicitud.create({
      nombre,
      email,
      telefono,
      tipo,
      cursoInteres,
      mensaje,
    });

    return created(res, solicitud, 'Solicitud recibida correctamente');
  } catch (error) {
    return next(error);
  }
};

export const listarSolicitudes = async (req, res, next) => {
  try {
    const filtros = {};
    if (req.query.estado) filtros.estado = req.query.estado;
    if (req.query.email) filtros.email = req.query.email.trim().toLowerCase();

    const solicitudes = await Solicitud.find(filtros)
      .populate('cursoInteres', 'nombre categoria')
      .sort({ createdAt: -1 });

    return ok(res, solicitudes, 'Solicitudes consultadas correctamente');
  } catch (error) {
    return next(error);
  }
};

export const obtenerSolicitud = async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id).populate(
      'cursoInteres',
      'nombre categoria'
    );

    if (!solicitud) return notFound(res, 'Solicitud no encontrada');
    return ok(res, solicitud, 'Solicitud consultada correctamente');
  } catch (error) {
    return next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) return notFound(res, 'Solicitud no encontrada');

    solicitud.estado = req.body.estado;
    if (req.body.observaciones !== undefined) {
      solicitud.observaciones = req.body.observaciones;
    }

    await solicitud.save();
    await solicitud.populate('cursoInteres', 'nombre categoria');

    return ok(res, solicitud, 'Estado de la solicitud actualizado correctamente');
  } catch (error) {
    return next(error);
  }
};

export { ESTADOS_SOLICITUD };
