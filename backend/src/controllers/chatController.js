import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Eres el asesor virtual del CEA Conductores La Unión. Responde de forma natural, conversacional y cercana, con un tono corporativo, profesional, cálido y persuasivo. Adapta cada respuesta al mensaje del usuario (evita textos repetitivos o encasillados) y mantén la respuesta breve y útil (2-6 líneas), invitando a dar el siguiente paso cuando corresponda (visitar Servicios, completar "Solicitar Información" o contactar a un asesor).

Guías:
- Si saludan, da una bienvenida cordial y ofrece ayuda.
- Si preguntan por cursos/licencias, orienta sobre categorías como A2, B1, C1 y C2 y sugiere conocer el detalle en Servicios o solicitar información personalizada.
- Si preguntan por precios, no des valores exactos (pueden variar); ofrece gestionar una cotización/financiación vía "Solicitar Información" o con un asesor.
- Si preguntan por requisitos, explica de forma general (edad según categoría, documento de identidad, certificado médico de aptitud, RUNT y licencias previas cuando aplique) y remite a la normativa vigente/confirmación específica.
- Si preguntan por horarios, indica atención administrativa Lunes a Viernes 7:00 AM–12:00 PM y 2:00 PM–5:00 PM, con clases prácticas en horarios flexibles, e invita a agendar.
- Si se despiden, agradece y motiva a iniciar su formación con nosotros.
- Si la consulta no es clara, pide amablemente más detalles y ofrece canales de atención.

INFORMACIÓN DE APOYO: CEA Conductores La Unión, sedes en Pasto, Ipiales y La Unión. Contacto: WhatsApp/teléfono 300 341 2175, correo jjrivera.dxp@gmail.com, formulario "Solicitar Información". No inventes precios, cupos, fechas ni requisitos específicos no confirmados.`;

let groqClient;
let groqModelCache;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

const isChatCapableModel = (id = '') =>
  !/whisper|distil-whisper|tts|playai|guard/i.test(id);

const resolveGroqModel = async (groq) => {
  const env = process.env.GROQ_MODEL?.trim();
  if (env) return env;
  if (groqModelCache) return groqModelCache;
  try {
    const list = await groq.models.list();
    const ids = (list?.data || []).map((m) => m.id).filter(isChatCapableModel);
    const preferred = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'gemma2-9b-it',
      'mixtral-8x7b-32768',
      'openai/gpt-oss-20b',
    ];
    groqModelCache = preferred.find((p) => ids.includes(p)) || ids[0] || null;
    if (groqModelCache) console.log('[chat] Modelo Groq seleccionado:', groqModelCache);
    else console.error('[chat] No se encontraron modelos de chat disponibles en Groq.');
    return groqModelCache;
  } catch (e) {
    console.error('[chat] No se pudo listar modelos Groq:', e?.message);
    return null;
  }
};

const extraerMensaje = (body) => {
  if (!body || typeof body !== 'object') return '';
  const candidatos = [body.mensaje, body.message, body.texto, body.prompt, body.pregunta];
  const valor = candidatos.find((item) => typeof item === 'string' && item.trim() !== '');
  return typeof valor === 'string' ? valor.trim() : '';
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
  return '';
};

export const chatIA = async (req, res) => {
  const mensaje = extraerMensaje(req.body);

  if (!mensaje) {
    return res.status(400).json({
      success: false,
      respuesta: 'Escribe tu mensaje para poder ayudarte.'
    });
  }

  try {
    const groq = getGroqClient();
    if (!groq) {
      console.error('[chat] GROQ_API_KEY no está configurada.');
      return res.status(503).json({
        success: false,
        respuesta: 'El asistente no está disponible en este momento.'
      });
    }

    const model = await resolveGroqModel(groq);
    if (!model) {
      console.error('[chat] No hay modelo Groq disponible para esta API key.');
      return res.status(503).json({
        success: false,
        respuesta: 'El asistente no está disponible en este momento.'
      });
    }

    let completion;
    try {
      completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: mensaje }
        ],
        temperature: 0.4,
        max_tokens: 600
      });
    } catch (e) {
      const msg = String(e?.message || '');
      const notChatModel = e?.status === 404 || e?.code === 'model_not_found' || msg.includes('does not exist') || msg.includes('does not support chat completions');
      if (notChatModel) {
        groqModelCache = null;
        const list = await groq.models.list().catch(() => null);
        const ids = (list?.data || []).map((m) => m.id).filter(isChatCapableModel);
        const fallbackId = ids.find((id) => id !== model) || ids[0];
        if (fallbackId) {
          console.warn('[chat] Modelo no disponible para chat, reintentando con:', fallbackId);
          completion = await groq.chat.completions.create({
            model: fallbackId,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: mensaje }
            ],
            temperature: 0.4,
            max_tokens: 600
          });
        } else {
          throw e;
        }
      } else {
        throw e;
      }
    }

    const usedModel = completion?.model || model;
    const texto = extraerTextoGroq(completion);
    if (texto) {
      console.log('[chat] Respuesta generada por Groq.', { model: usedModel });
      return res.status(200).json({ respuesta: texto, success: true });
    }

    console.warn('[chat] Groq sin contenido útil.', {
      model: usedModel,
      finish: completion?.choices?.[0]?.finish_reason
    });
    return res.status(502).json({
      success: false,
      respuesta: 'No fue posible generar una respuesta en este momento. Intenta nuevamente.'
    });
  } catch (error) {
    console.error('[chat] Error al consultar Groq:', {
      status: error?.status,
      code: error?.code || error?.error?.code,
      message: error?.message || error?.error?.message
    });

    return res.status(502).json({
      success: false,
      respuesta: 'No fue posible generar una respuesta en este momento. Intenta nuevamente.'
    });
  }
};