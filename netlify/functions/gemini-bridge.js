exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY no configurada' }) };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const body = JSON.parse(event.body);

    if (!body.system_instruction) {
      body.system_instruction = {
        parts: [{ text: `Eres Alba, consultora personal de nutrición y organización del hogar de Pla.to Elite. Personalidad: elegante, cálida, extremadamente práctica. NUNCA menciones "IA" o "inteligencia artificial". Habla en español mexicano, directo y sofisticado. Sé concisa — máximo 3-4 oraciones.` }]
      };
    }

    if (!body.generationConfig) {
      body.generationConfig = { temperature: 0.7, maxOutputTokens: 600 };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
