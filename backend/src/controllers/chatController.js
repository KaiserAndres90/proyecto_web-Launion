const WHATSAPP_URL = 'https://wa.me/573003412175';

const normalizar = (texto = '') =>
  String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,]/g, '')
    .trim();

const obtenerRespuesta = (mensaje) => {
  const texto = normalizar(mensaje);

  if (!texto) {
    return 'Escribe tu pregunta y te ayudaré con cursos, horarios, requisitos o precios.';
  }

  if (/^hola\b|^buen[oa]s?|^saludos?\b/.test(texto)) {
    return '¡Hola! Soy el asistente virtual de CEA Conductores La Unión. ¿Qué información necesitas sobre nuestros cursos?';
  }

  if (/horario|hora|cuando|dia|dias/.test(texto)) {
    return 'Nuestros horarios dependen del curso y de los cupos disponibles. Escríbenos por WhatsApp para consultar el horario más cercano.';
  }

  if (/requisito|documento|papel|que debo llevar|que necesito/.test(texto)) {
    return 'Los requisitos pueden variar según el tipo de licencia o curso. En general se solicita documento de identidad y documentos vigentes según el curso. Confirma tu caso por WhatsApp.';
  }

  if (/precio|costo|valor|cuanto cuesta|cuanto vale|tarifa/.test(texto)) {
    return 'El valor depende de la categoría y del curso seleccionado. Para darte el precio actualizado, escríbenos por WhatsApp.';
  }

  if (/matricula|inscripcion|inscrib|como me inscribo|reservar|cupos?/.test(texto)) {
    return 'Para matricularte o reservar un cupo necesitamos confirmar el curso, horario y disponibilidad. Escríbenos por WhatsApp para continuar con la inscripción.';
  }

  if (/direccion|ubicacion|donde estan|como llego|ciudad|pasto/.test(texto)) {
    return 'Estamos en Pasto. Para indicarte nuestra ubicación exacta y cómo llegar, puedes comunicarte por WhatsApp.';
  }

  if (/whatsapp|asesor|asesora|persona|humano|contacto/.test(texto)) {
    return `Puedes hablar directamente con un asesor real aquí: ${WHATSAPP_URL}`;
  }

  if (/\b(a1|a2|b1|b2|c1|c2|c3)\b/.test(texto) || /curso|licencia|conducir/.test(texto)) {
    return 'Trabajamos con diferentes cursos y categorías de conducción. Indícame si buscas una categoría como A2, B1, C1 o C2 y te orientaré sobre requisitos y disponibilidad.';
  }

  return `Entiendo tu consulta. Para darte una respuesta exacta sobre cursos, precios, requisitos o horarios, puedes escribirnos por WhatsApp: ${WHATSAPP_URL}`;
};

export const chatIA = (req, res) => {
  try {
    const mensaje = typeof req?.body?.mensaje === 'string'
      ? req.body.mensaje.trim()
      : '';

    const respuesta = obtenerRespuesta(mensaje);

    return res.status(200).json({
      respuesta,
      success: true
    });
  } catch (error) {
    console.error('Error local en el chat:', error);

    return res.status(200).json({
      respuesta: `Ocurrió un inconveniente. Puedes hablar con un asesor por WhatsApp: ${WHATSAPP_URL}`,
      success: false
    });
  }
};