import jwt from 'jsonwebtoken';

const generateToken = (usuarioId, rol) => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  if (!JWT_SECRET) {
    throw new Error('La variable de entorno JWT_SECRET es obligatoria');
  }

  return jwt.sign(
    { id: usuarioId.toString(), rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN || '24h' }
  );
};

export default generateToken;
