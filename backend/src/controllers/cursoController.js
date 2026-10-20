import Curso from '../models/curso.js';
import { created, notFound, ok } from '../utils/responseHelpers.js';

export const listarCursos = async (_req, res, next) => {
  try {
    const cursos = await Curso.find({ activo: true }).sort({ nombre: 1 });
    return ok(res, cursos, 'Cursos consultados correctamente');
  } catch (error) {
    return next(error);
  }
};

export const obtenerCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findOne({ _id: req.params.id, activo: true });
    if (!curso) return notFound(res, 'Curso no encontrado');
    return ok(res, curso, 'Curso consultado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const crearCurso = async (req, res, next) => {
  try {
    const curso = await Curso.create(req.body);
    return created(res, curso, 'Curso creado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const actualizarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return notFound(res, 'Curso no encontrado');

    Object.assign(curso, req.body);
    await curso.save();

    return ok(res, curso, 'Curso actualizado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const eliminarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) return notFound(res, 'Curso no encontrado');
    return ok(res, null, 'Curso eliminado correctamente');
  } catch (error) {
    return next(error);
  }
};
