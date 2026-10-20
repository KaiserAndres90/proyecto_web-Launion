import Servicio from '../models/Servicio.js';
import { created, notFound, ok } from '../utils/responseHelpers.js';

export const listarServicios = async (_req, res, next) => {
  try {
    const servicios = await Servicio.find({ activo: true }).sort({ nombre: 1 });
    return ok(res, servicios, 'Servicios consultados correctamente');
  } catch (error) {
    return next(error);
  }
};

export const obtenerServicio = async (req, res, next) => {
  try {
    const servicio = await Servicio.findOne({
      _id: req.params.id,
      activo: true,
    });
    if (!servicio) return notFound(res, 'Servicio no encontrado');
    return ok(res, servicio, 'Servicio consultado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const crearServicio = async (req, res, next) => {
  try {
    const servicio = await Servicio.create(req.body);
    return created(res, servicio, 'Servicio creado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const actualizarServicio = async (req, res, next) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) return notFound(res, 'Servicio no encontrado');

    Object.assign(servicio, req.body);
    await servicio.save();

    return ok(res, servicio, 'Servicio actualizado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const eliminarServicio = async (req, res, next) => {
  try {
    const servicio = await Servicio.findByIdAndDelete(req.params.id);
    if (!servicio) return notFound(res, 'Servicio no encontrado');
    return ok(res, null, 'Servicio eliminado correctamente');
  } catch (error) {
    return next(error);
  }
};
