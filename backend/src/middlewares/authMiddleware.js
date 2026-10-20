import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';

export const proteger = async (req, _res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return next(
      Object.assign(new Error('Se requiere un token Bearer'), {
        statusCode: 401,
      })
    );
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error('La variable de entorno JWT_SECRET es obligatoria'));
  }

  const payload = jwt.verify(match[1], process.env.JWT_SECRET);
  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof payload.id !== 'string'
  ) {
    return next(
      Object.assign(new Error('El token no es válido'), { statusCode: 401 })
    );
  }

  const usuario = await Usuario.findById(payload.id);
  if (!usuario || !usuario.activo) {
    return next(
      Object.assign(new Error('Usuario no autorizado'), { statusCode: 401 })
    );
  }

  req.usuario = usuario;
  return next();
};
