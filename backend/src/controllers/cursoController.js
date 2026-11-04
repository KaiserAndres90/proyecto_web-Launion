import Curso from '../models/curso.js';
import { created, notFound, ok } from '../utils/responseHelpers.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const uploadsPath = fileURLToPath(new URL('../../uploads/', import.meta.url));

const eliminarArchivoImagen = async (imagen) => {
  if (!imagen) return;
  const archivo = path.join(uploadsPath, imagen);
  await fs.unlink(archivo).catch((error) => {
    if (error.code !== 'ENOENT') console.error('No se pudo eliminar la imagen:', error);
  });
};

export const listarCursos = async (req, res, next) => {
  try {
    const filtros = { activo: true };
    if (req.query.categoria) {
      filtros.categoria = String(req.query.categoria).toUpperCase();
    }
    const cursos = await Curso.find(filtros).sort({ nombre: 1 });
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
    const datos = { ...req.body };
    if (req.file) datos.imagen = req.file.filename;
    const curso = await Curso.create(datos);
    return created(res, curso, 'Curso creado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const actualizarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return notFound(res, 'Curso no encontrado');

    const imagenAnterior = curso.imagen;
    Object.assign(curso, req.body);
    if (req.file) {
      curso.imagen = req.file.filename;
    }
    await curso.save();

    if (req.file && imagenAnterior && imagenAnterior !== curso.imagen) {
      await eliminarArchivoImagen(imagenAnterior);
    }

    return ok(res, curso, 'Curso actualizado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const eliminarCurso = async (req, res, next) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) return notFound(res, 'Curso no encontrado');
    await eliminarArchivoImagen(curso.imagen);
    return ok(res, null, 'Curso eliminado correctamente');
  } catch (error) {
    return next(error);
  }
};
