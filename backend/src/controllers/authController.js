import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import Usuario from '../models/usuario.js';
import generateToken from '../utils/generateToken.js';

const generarContrasenaAleatoria = () => crypto.randomBytes(6).toString('hex');

const obtenerDatosPublicos = (usuario) => {
  const datos = usuario.toObject();
  delete datos.password;
  delete datos.resetPasswordToken;
  delete datos.resetPasswordExpire;
  return datos;
};

export const registrarUsuario = async (req, res) => {
  const { nombre, email, telefono, password, rol } = req.body;
  const rolesPermitidos = [
    'admin',
    'gerente',
    'aux_teoria',
    'aux_practica',
    'aux_documentacion',
    'aux_atencion',
  ];

  const usuario = await Usuario.create({
    nombre,
    email,
    telefono,
    password,
    rol: rolesPermitidos.includes(rol) ? rol : 'aux_atencion',
  });

  const token = generateToken(usuario._id, usuario.rol);

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

  const token = generateToken(usuario._id, usuario.rol);

  return res.status(200).json({
    success: true,
    resultado: 'bien',
    token,
    data: token,
    usuario: obtenerDatosPublicos(usuario),
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.json({
        result: 'mistake',
        message: 'El correo ingresado no se encuentra en la base de datos',
        data: null,
      });
    }

    const newPass = generarContrasenaAleatoria();
    user.password = newPass;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_NODE,
        pass: process.env.PASS_NODE,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_NODE,
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Tu nueva contraseña temporal es: ${newPass}. Te recomendamos cambiarla después de iniciar sesión.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      result: 'fine',
      message: 'Se ha enviado una nueva contraseña al correo registrado.',
    });
  } catch (error) {
    return res.json({
      result: 'mistake',
      message: 'Error interno en el servidor',
      error: error.message,
    });
  }
};

export const obtenerPerfil = (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.usuario,
  });
};
