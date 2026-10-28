import jwt from 'jsonwebtoken';

const generateToken = (usuarioId, rol) => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('La variable de entorno JWT_SECRET es obligatoria');
  }

  return jwt.sign(
    {
      id: usuarioId.toString(),
      rol,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export default generateToken;
