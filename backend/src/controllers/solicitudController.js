import nodemailer from 'nodemailer';
import Solicitud from '../models/Solicitud.js';
import { created, notFound, ok } from '../utils/responseHelpers.js';

const ESTADOS_SOLICITUD = [
  'Recibida',
  'En revisión',
  'Aprobada',
  'Rechazada',
  'Contactado',
];

export const crearSolicitud = async (req, res, next) => {
  try {
    const { nombre, correo, email, telefono, tipo, curso, cursoInteres, mensaje } = req.body;
    const correoNormalizado = (correo || email || '').trim().toLowerCase();
    const cursoTexto = typeof curso === 'string' ? curso.trim() : '';

    if (!nombre || !telefono || !correoNormalizado) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, teléfono y correo son obligatorios',
      });
    }

    const solicitud = await Solicitud.create({
      nombre,
      correo: correoNormalizado,
      telefono,
      tipo: tipo || 'contacto',
      curso: cursoTexto,
      cursoInteres: cursoInteres || undefined,
      mensaje: mensaje || (cursoTexto ? `Curso de interés: ${cursoTexto}` : ''),
    });

    // Notificación por correo al administrador (no bloquea la respuesta al cliente)
    try {
      if (!process.env.EMAIL_NODE || !process.env.PASS_NODE) {
        console.error('[mailer] Faltan variables de entorno EMAIL_NODE o PASS_NODE; no se envió notificación.');
      } else {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_NODE,
            pass: process.env.PASS_NODE.replace(/\s+/g, ''),
          },
        });

        const fechaSolicitud = new Date(solicitud.createdAt).toLocaleString('es-CO', {
          dateStyle: 'short',
          timeStyle: 'short',
        });

        const mailOptions = {
          from: process.env.EMAIL_NODE,
          to: process.env.ADMIN_EMAIL || process.env.EMAIL_NODE,
          subject: 'Nueva solicitud de información - CEA Conductores La Unión',
          text:
            `Se ha recibido una nueva solicitud.\n\n` +
            `Nombre: ${solicitud.nombre}\n` +
            `Correo: ${solicitud.correo}\n` +
            `Teléfono: ${solicitud.telefono}\n` +
            `Curso: ${solicitud.curso || 'No especificado'}\n` +
            `Estado: ${solicitud.estado}\n` +
            `Fecha: ${fechaSolicitud}`,
          html: `
            <div style="margin:0;padding:24px;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#333333;">
              <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
                <div style="background-color:#333333;padding:20px 24px;border-bottom:4px solid #a5c300;text-align:center;">
                  <h1 style="margin:0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">CEA Conductores La Unión</h1>
                  <p style="margin:6px 0 0;font-size:14px;color:#f0f0f0;">Nueva solicitud de información</p>
                </div>
                <div style="padding:24px;background-color:#ffffff;">
                  <p style="margin:0 0 16px;font-size:15px;color:#333333;">Se ha recibido una nueva solicitud a través de la plataforma web. A continuación los datos del estudiante:</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;color:#333333;">
                    <tr>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;width:38%;">Nombre</td>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;">${solicitud.nombre}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;">Correo</td>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;">${solicitud.correo}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;">Teléfono</td>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;">${solicitud.telefono}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;">Curso</td>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;">${solicitud.curso || 'No especificado'}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;">Estado</td>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;"><span style="display:inline-block;padding:4px 10px;border-radius:12px;background-color:#a5c300;color:#333333;font-weight:bold;">${solicitud.estado}</span></td>
                    </tr>
                    <tr>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;">Fecha</td>
                      <td style="padding:10px 12px;border:1px solid #e0e0e0;">${fechaSolicitud}</td>
                    </tr>
                  </table>
                </div>
                <div style="padding:16px 24px;background-color:#f9f9f9;border-top:1px solid #e0e0e0;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#777777;">Este es un mensaje automático generado por la plataforma web del CEA. Por favor, no responda a este correo.</p>
                </div>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (mailError) {
      console.error('[mailer] Error enviando notificación de solicitud:', mailError);
    }

    return created(res, solicitud, 'Solicitud recibida correctamente');
  } catch (error) {
    return next(error);
  }
};

export const listarSolicitudes = async (req, res, next) => {
  try {
    const filtros = {};
    if (req.query.estado) filtros.estado = req.query.estado;
    if (req.query.email) {
      const email = req.query.email.trim().toLowerCase();
      filtros.$or = [{ correo: email }, { email }];
    }

    const solicitudes = await Solicitud.find(filtros)
      .populate('cursoInteres', 'nombre categoria')
      .sort({ createdAt: -1 });

    return ok(res, solicitudes, 'Solicitudes consultadas correctamente');
  } catch (error) {
    return next(error);
  }
};

export const obtenerSolicitud = async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id).populate(
      'cursoInteres',
      'nombre categoria'
    );

    if (!solicitud) return notFound(res, 'Solicitud no encontrada');
    return ok(res, solicitud, 'Solicitud consultada correctamente');
  } catch (error) {
    return next(error);
  }
};

export const actualizarEstado = async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) return notFound(res, 'Solicitud no encontrada');

    solicitud.estado = req.body.estado;
    if (req.body.observaciones !== undefined) {
      solicitud.observaciones = req.body.observaciones;
    }

    await solicitud.save();
    await solicitud.populate('cursoInteres', 'nombre categoria');

    return ok(res, solicitud, 'Estado de la solicitud actualizado correctamente');
  } catch (error) {
    return next(error);
  }
};

export const responderSolicitud = async (req, res, next) => {
  try {
    const { respuesta } = req.body;
    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) return notFound(res, 'Solicitud no encontrada');

    if (!respuesta || !String(respuesta).trim()) {
      return res.status(400).json({
        success: false,
        message: 'El texto de la respuesta es obligatorio',
      });
    }

    if (!process.env.EMAIL_NODE || !process.env.PASS_NODE) {
      return res.status(500).json({
        success: false,
        message: 'Configuración de correo no disponible (EMAIL_NODE/PASS_NODE)',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_NODE,
        pass: process.env.PASS_NODE.replace(/\s+/g, ''),
      },
    });

    const fechaRespuesta = new Date().toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const respuestaTexto = String(respuesta).trim();

    await transporter.sendMail({
      from: process.env.EMAIL_NODE,
      to: solicitud.correo,
      subject: 'Respuesta a tu solicitud - CEA Conductores La Unión',
      text: `Hola ${solicitud.nombre},\n\n${respuestaTexto}\n\nCEA Conductores La Unión`,
      html: `
        <div style="margin:0;padding:24px;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#333333;">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
            <div style="background-color:#333333;padding:20px 24px;border-bottom:4px solid #a5c300;text-align:center;">
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">CEA Conductores La Unión</h1>
              <p style="margin:6px 0 0;font-size:14px;color:#f0f0f0;">Respuesta a tu solicitud</p>
            </div>
            <div style="padding:24px;background-color:#ffffff;">
              <p style="margin:0 0 12px;font-size:15px;color:#333333;">Hola <strong>${solicitud.nombre}</strong>,</p>
              <div style="margin:0 0 16px;padding:16px;background-color:#f9f9f9;border-left:4px solid #a5c300;font-size:14px;line-height:1.6;color:#333333;white-space:pre-line;">${respuestaTexto}</div>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:13px;color:#555555;margin-top:8px;">
                <tr>
                  <td style="padding:8px 10px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;width:38%;">Curso de interés</td>
                  <td style="padding:8px 10px;border:1px solid #e0e0e0;">${solicitud.curso || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding:8px 10px;border:1px solid #e0e0e0;background-color:#f9f9f9;font-weight:bold;">Fecha de respuesta</td>
                  <td style="padding:8px 10px;border:1px solid #e0e0e0;">${fechaRespuesta}</td>
                </tr>
              </table>
            </div>
            <div style="padding:16px 24px;background-color:#f9f9f9;border-top:1px solid #e0e0e0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#777777;">Este es un mensaje automático generado por la plataforma web del CEA. Por favor, no responda a este correo.</p>
            </div>
          </div>
        </div>
      `,
    });

    solicitud.estado = 'Contactado';
    solicitud.observaciones = respuestaTexto;
    await solicitud.save();
    await solicitud.populate('cursoInteres', 'nombre categoria');

    return ok(res, solicitud, 'Respuesta enviada y solicitud actualizada correctamente');
  } catch (error) {
    console.error('[mailer] Error enviando respuesta de solicitud:', error);
    return next(error);
  }
};

export { ESTADOS_SOLICITUD };
