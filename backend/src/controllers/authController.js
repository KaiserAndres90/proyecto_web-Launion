import Usuario from '../models/usuario.js';
import generateToken from '../utils/generateToken.js';

const obtenerDatosPublicos = (usuario) => {
  const datos = usuario.toObject();
  delete datos.password;
  delete datos.resetPasswordToken;
  delete datos.resetPasswordExpire;
  return datos;
};

export const registrarUsuario = async (req, res) => {
  const { nombre, email, telefono, password } = req.body;

  const usuario = await Usuario.create({
    nombre,
    email,
    telefono,
    password,
    // El registro público nunca permite asignar roles privilegiados.
    rol: 'auxiliar',
  });

  const token = generateToken(usuario._id);

  return res.status(201).json({
    success: true,
    token,
    data: obtenerDatosPublicos(usuario),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({
    email: email.trim().toLowerCase(),
  }).select('+password');

  if (
    !usuario ||
    !usuario.activo ||
    !(await usuario.matchPassword(password))
  ) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas',
    });
  }

  usuario.ultimoAcceso = new Date();
  await usuario.save();

  const token = generateToken(usuario._id);

  return res.status(200).json({
    success: true,
    token,
    data: obtenerDatosPublicos(usuario),
  });
};

export const obtenerPerfil = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.usuario,
  });
};
