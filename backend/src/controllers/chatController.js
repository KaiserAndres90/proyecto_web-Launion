import Groq from 'groq-sdk';

const WHATSAPP_URL = 'https://wa.me/573003412175';
const FALLBACK_RESPUESTA =
  'Ahora no puedo responder con el asistente automático. Usa el formulario de "Solicitar Información" o escríbenos por WhatsApp para ayudarte.';

const SYSTEM_PROMPT = `Eres el asistente virtual del CEA Conductores La Unión (Pasto, Nariño). Tu tono es amable, claro, cercano y profesional. Responde breve (ideal 2-6 líneas) y SOLO con la información verificada abajo. NO inventes precios, tarifas, duraciones, cupos, fechas, promociones, direcciones adicionales ni requisitos que no estén aquí. Si falta un dato o piden confirmar algo específico, invita con amabilidad a usar el formulario "Solicitar Información" (/solicitud), a WhatsApp 300 341 2175, al correo jjrivera.dxp@gmail.com o a la página de Contacto/Horarios/Sedes/Servicios.

INFORMACIÓN VERIFICADA (sitio web):
- Nombre/alcance: CEA Conductores La Unión. Sedes/regional: Pasto, Ipiales y La Unión.
- Contacto principal (Pasto): direcciones Calle 18 #19B - 06 y Carrera 2 #16 - 18, Pasto, Nariño. Teléfono/WhatsApp 300 341 2175. Correo jjrivera.dxp@gmail.com. Mapa/ubicación disponible en la página de Contacto.
- Sede Ipiales: Carrera 1 #1A-53, Barrio Centenario. Teléfonos 300 341 2175 / 323 228 6235 / 300 469 7345. Horario de atención: Lunes a Viernes 8:00 a. m. - 12:00 p. m. y 2:00 p. m. - 6:00 p. m. (confirmar en Sedes).
- Sede La Unión: Calle 3 #4-12, Barrio Centro. Teléfono 320 000 0000. Horario de atención: Lunes a Viernes 7:30 a. m. - 12:30 p. m. y 1:30 p. m. - 5:30 p. m. (confirmar en Sedes).
- Horarios generales (página Horarios, Lunes a Viernes):
  • Atención administrativa: 7:00 a. m. - 12:00 p. m. y 2:00 p. m. - 5:00 p. m.
  • Clases teóricas: 7:00 a. m. - 11:00 a. m., 1:00 p. m. - 5:00 p. m. y 5:00 p. m. - 9:00 p. m.
  • Clases prácticas: 7:00 a. m. - 11:00 a. m., 1:00 p. m. - 5:00 p. m. y 5:00 p. m. - 7:00 p. m.
- Nota: los horarios pueden variar en días festivos o por programación; confirmar disponibilidad y agenda antes de asistir.
- Cursos de conducción (Servicios): A1 (motocicletas hasta 125 c.c.), A2 (motocicletas/motociclos/mototriciclos >125 c.c.), B1 (automóviles y similares de servicio particular), C1 (automóviles/microbuses de servicio público), C2 (camiones rígidos/busetas/buses de servicio público), C3 (vehículos articulados de servicio público). Los requisitos de inscripción se consultan con el botón "Ver requisitos" en cada curso.
- Requisitos generales que aparecen en cursos (pueden variar por categoría): mayoría de edad según categoría (16+ en A1/A2/B1; 18+ en C1/C2/C3), documento de identidad/cédula original, certificado médico vigente, registro en el RUNT; C2 requiere licencia C1 vigente y C3 requiere licencia C2 vigente. Invita a confirmar requisitos vigentes al inscribirse.
- Formación de Instructores Certificados (nivel profesional): programa con componentes teórico, pedagógico, técnico y legal; incluye formación para instructores A2, B1, C1 y C2. Para requisitos, intensidad/fechas y certificación, confirmar con el centro vía "Solicitar Información".
- Precios/costos: NO se publican en la web. Para precios vigentes, requisitos y horarios disponibles, dirigir al formulario "Solicitar Información", WhatsApp o Contacto.`;

let groqClient;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

const extraerMensaje = (body) => {
  if (!body || typeof body !== 'object') return '';
  const candidatos = [body.mensaje, body.message, body.texto, body.prompt, body.pregunta];
  const valor = candidatos.find((item) => typeof item === 'string' && item.trim() !== '');
  return typeof valor === 'string' ? valor.trim() : '';
};

const normalizar = (texto = '') =>
  String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,]/g, '')
    .trim();

const respuestaLocal = (mensaje) => {
  const texto = normalizar(mensaje);
  if (!texto) {
    return '¡Hola! Soy el asistente del CEA Conductores La Unión. ¿Quieres saber sobre sedes, horarios, cursos o contacto?';
  }
  if (/^(hola|buenos dias|buenas tardes|buenas noches|buen dia|saludos)\b/.test(texto)) {
    return '¡Hola! Con gusto te ayudo con información sobre sedes, horarios, cursos (A1–C3) o contacto. ¿Qué necesitas?';
  }
  if (/ipiales/.test(texto) && /sede|direccion|ubicacion|donde|horario|telefono/.test(texto)) {
    return 'Sede Ipiales: Carrera 1 #1A-53, Barrio Centenario. Tel: 300 341 2175 / 323 228 6235 / 300 469 7345. Horario: L-V 8:00 a.m.–12:00 p.m. y 2:00–6:00 p.m. Confirma detalles en la página de Sedes.';
  }
  if (/la union/.test(texto) && /sede|direccion|ubicacion|donde|horario|telefono/.test(texto)) {
    return 'Sede La Unión: Calle 3 #4-12, Barrio Centro. Tel: 320 000 0000. Horario: L-V 7:30 a.m.–12:30 p.m. y 1:30–5:30 p.m. Confirma detalles en la página de Sedes.';
  }
  if (/ubicacion|direccion|donde queda|donde estan|como llego|escuela|sede|ciudad|pasto/.test(texto)) {
    return 'Tenemos sedes en Pasto, Ipiales y La Unión. En Pasto: Calle 18 #19B-06 y Carrera 2 #16-18 (ver mapa en Contacto). También puedes escribir al WhatsApp 300 341 2175 o ver la página de Sedes.';
  }
  if (/horario|hora|cuando atienden|atencion administrativa|teoric|practic/.test(texto)) {
    return 'Horarios (L-V, generales): Atención administrativa 7:00 a.m.–12:00 p.m. y 2:00–5:00 p.m. Teóricas 7:00–11:00 a.m., 1:00–5:00 p.m. y 5:00–9:00 p.m. Prácticas 7:00–11:00 a.m., 1:00–5:00 p.m. y 5:00–7:00 p.m. Pueden variar; confirma disponibilidad.';
  }
  if (/precio|costo|valor|cuanto cuesta|cuanto vale|tarifa/.test(texto)) {
    return 'Los precios vigentes no se publican en la web. Con gusto te orientamos: usa el formulario "Solicitar Información" o escríbenos al WhatsApp 300 341 2175.';
  }
  if (/requisito|documento|papel|que debo llevar|que necesito|runt|certificado medico/.test(texto)) {
    return 'Los requisitos varían por categoría. En general suelen pedir documento de identidad/cédula, certificado médico vigente y registro en el RUNT (y licencias previas en C2/C3). Revisa "Ver requisitos" en Servicios o confirma por "Solicitar Información"/WhatsApp.';
  }
  if (/contact|whatsapp|telefono|correo|email|asesor/.test(texto)) {
    return 'Puedes contactarnos por WhatsApp/teléfono 300 341 2175, correo jjrivera.dxp@gmail.com, o el formulario "Solicitar Información". ¡Te responderemos con gusto!';
  }
  if (/instructor/.test(texto)) {
    return 'Contamos con Formación de Instructores Certificados (nivel profesional, categorías A2, B1, C1 y C2). Para requisitos, fechas y detalles, usa "Solicitar Información" o WhatsApp 300 341 2175.';
  }
  if (/\b(a1|a2|b1|b2|c1|c2|c3)\b/.test(texto) || /curso|licencia|conducir|matricula|inscripcion/.test(texto)) {
    return 'Ofrecemos cursos A1, A2, B1, C1, C2 y C3 (motos, particular y servicio público). Consulta "Ver requisitos" en Servicios y, para disponibilidad/precios vigentes, usa "Solicitar Información" o WhatsApp 300 341 2175.';
  }
  return null;
};

const extraerTextoGroq = (completion) => {
  const msg = completion?.choices?.[0]?.message;
  if (!msg) return '';
  if (typeof msg.content === 'string' && msg.content.trim()) return msg.content.trim();
  if (Array.isArray(msg.content)) {
    const joined = msg.content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
    if (joined) return joined;
  }
  if (typeof msg.reasoning === 'string' && msg.reasoning.trim()) {
    // Modelo de razonamiento sin contenido final: usar fallback manejado arriba
    return '';
  }
  return '';
};

export const chatIA = async (req, res) => {
  const mensaje = extraerMensaje(req.body);

  if (!mensaje) {
    return res.status(200).json({
      respuesta: 'Escribe tu pregunta y te ayudaré con cursos, horarios, requisitos o precios.',
      success: true
    });
  }

  const local = respuestaLocal(mensaje);

  try {
    const groq = getGroqClient();
    if (!groq) {
      console.error('GROQ_API_KEY no está configurada.');
      return res.status(200).json({
        respuesta: local || FALLBACK_RESPUESTA,
        success: Boolean(local)
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: mensaje }
      ],
      temperature: 0.4,
      max_tokens: 600
    });

    const texto = extraerTextoGroq(completion);
    if (texto) {
      return res.status(200).json({ respuesta: texto, success: true });
    }

    console.warn('Groq sin contenido útil; usando fallback local/genérico.', {
      finish: completion?.choices?.[0]?.finish_reason
    });
    return res.status(200).json({
      respuesta: local || FALLBACK_RESPUESTA,
      success: Boolean(local)
    });
  } catch (error) {
    console.error('Error al consultar Groq:', {
      status: error?.status,
      code: error?.code || error?.error?.code,
      message: error?.message || error?.error?.message
    });

    return res.status(200).json({
      respuesta: local || FALLBACK_RESPUESTA,
      success: Boolean(local)
    });
  }
};