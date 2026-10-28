import jwt from 'jsonwebtoken';

const generateToken = (usuarioId) => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  if (!JWT_SECRET) {
    throw new Error('La variable de entorno JWT_SECRET es obligatoria');
  }

  return jwt.sign(
    { id: usuarioId.toString() },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export default generateToken;
