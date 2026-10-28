import bcrypt from 'bcryptjs';
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

  const token = generateToken(usuario._id, usuario.rol);

  return res.status(201).json({
    success: true,
    token,
    data: obtenerDatosPublicos(usuario),
  });
};

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identificador = email || username;

    if (!identificador || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El email o usuario y la contraseña son obligatorios',
      });
    }

    const usuario = await Usuario.findOne({
      email: identificador.trim().toLowerCase(),
    }).select('+password');

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const contraseñaCoincide = await bcrypt.compare(password, usuario.password);

    if (!contraseñaCoincide) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    usuario.ultimoAcceso = new Date();
    await usuario.save();

    const token = generateToken(usuario._id, usuario.rol);

    return res.status(200).json({
      resultado: 'bien',
      message: 'Acceso exitoso',
      data: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

export const obtenerPerfil = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.usuario,
  });
};
