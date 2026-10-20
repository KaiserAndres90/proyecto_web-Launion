import Horario from '../models/Horario.js';
import { created, notFound, ok } from '../utils/responseHelpers.js';

const poblarHorario = (consulta) =>
  consulta.populate('curso').populate('instructor', 'nombre');

export const listarHorarios = async (_req, res, next) => {
  try {
    const horarios = await poblarHorario(
      Horario.find({ activo: true }).sort({ dias: 1, horaInicio: 1 })
    );
    return ok(res, horarios, 'Horarios consultados correctamente');
  } catch (error) {
    return next(error);
  }
};

export const obtenerHorario = async (req, res, next) => {
  try {
    const horario = await poblarHorario(
      Horario.findOne({ _id: req.params.id, activo: true })
    );
    if (!horario) return notFound(res, 'Horario no encontrado');
    return ok(res, horario, 'Horario consultado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const crearHorario = async (req, res, next) => {
  try {
    const horario = await Horario.create(req.body);
    await horario.populate('curso');
    await horario.populate('instructor', 'nombre');
    return created(res, horario, 'Horario creado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const actualizarHorario = async (req, res, next) => {
  try {
    const horario = await Horario.findById(req.params.id);
    if (!horario) return notFound(res, 'Horario no encontrado');

    Object.assign(horario, req.body);
    await horario.save();
    await horario.populate('curso');
    await horario.populate('instructor', 'nombre');

    return ok(res, horario, 'Horario actualizado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const eliminarHorario = async (req, res, next) => {
  try {
    const horario = await Horario.findByIdAndDelete(req.params.id);
    if (!horario) return notFound(res, 'Horario no encontrado');
    return ok(res, null, 'Horario eliminado correctamente');
  } catch (error) {
    return next(error);
  }
};
