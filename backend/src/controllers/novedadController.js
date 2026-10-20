import Novedad from '../models/Novedad.js';
import { created, notFound, ok } from '../utils/responseHelpers.js';

const poblarAutor = (consulta) => consulta.populate('autor', 'nombre');

export const listarNovedades = async (_req, res, next) => {
  try {
    const novedades = await poblarAutor(
      Novedad.find({ publicada: true }).sort({ createdAt: -1 })
    );
    return ok(res, novedades, 'Novedades consultadas correctamente');
  } catch (error) {
    return next(error);
  }
};

export const obtenerNovedad = async (req, res, next) => {
  try {
    const novedad = await poblarAutor(
      Novedad.findOne({ _id: req.params.id, publicada: true })
    );
    if (!novedad) return notFound(res, 'Novedad no encontrada');
    return ok(res, novedad, 'Novedad consultada correctamente');
  } catch (error) {
    return next(error);
  }
};

export const crearNovedad = async (req, res, next) => {
  try {
    const novedad = await Novedad.create({
      ...req.body,
      autor: req.usuario._id,
    });
    await novedad.populate('autor', 'nombre');
    return created(res, novedad, 'Novedad creada correctamente');
  } catch (error) {
    return next(error);
  }
};

export const actualizarNovedad = async (req, res, next) => {
  try {
    const novedad = await Novedad.findById(req.params.id);
    if (!novedad) return notFound(res, 'Novedad no encontrada');

    const { autor: _autorIgnorado, ...datosActualizacion } = req.body;
    Object.assign(novedad, datosActualizacion);
    await novedad.save();
    await novedad.populate('autor', 'nombre');

    return ok(res, novedad, 'Novedad actualizada correctamente');
  } catch (error) {
    return next(error);
  }
};

export const eliminarNovedad = async (req, res, next) => {
  try {
    const novedad = await Novedad.findByIdAndDelete(req.params.id);
    if (!novedad) return notFound(res, 'Novedad no encontrada');
    return ok(res, null, 'Novedad eliminada correctamente');
  } catch (error) {
    return next(error);
  }
};
