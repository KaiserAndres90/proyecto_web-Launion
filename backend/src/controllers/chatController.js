import { GoogleGenAI } from '@google/genai';

// Inicializa la IA con tu clave secreta (la que guardaste en .env)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatIA = async (req, res) => {
  try {
    const { mensaje, historial } = req.body;

    // Instrucción de sistema: Le dice a la IA cómo comportarse
    const promptSistema = `Eres el asistente virtual del CEA Conductores La Unión en Pasto, . 
    Ayudas a los usuarios a resolver dudas sobre cursos (A2, B1, C1, C2), horarios, requisitos y precios.
    Sé amable, conciso y responde siempre en español. Si te preguntan algo que no sabes, sugiere contactar por WhatsApp.`;

    // Construimos el historial de conversación para que la IA tenga memoria
    let contents = [
      { role: 'user', parts: [{ text: promptSistema }] },
      ...historial.map(msg => ({
        role: msg.emisor === 'usuario' ? 'user' : 'model',
        parts: [{ text: msg.texto }]
      })),
      { role: 'user', parts: [{ text: mensaje }] }
    ];

    // Llamada a la API de Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Modelo rápido y gratuito
      contents: contents,
    });

    res.json({ respuesta: response.text });
  } catch (error) {
    console.error('Error en Chat IA:', error);
    res.status(500).json({ error: 'Error al procesar el mensaje' });
  }
};