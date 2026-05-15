// Vercel Serverless Function — proxy a Google Gemini
// Ruta pública: /api/gemini?model=gemini-1.5-flash-latest
//
// Pone tu GEMINI_API_KEY en Vercel:
//   Vercel → Project → Settings → Environment Variables
//   Name:  GEMINI_API_KEY
//   Value: AIzaSy...   (tu key NUEVA, recién generada)
//
// La key vive solo en el servidor, nunca llega al navegador,
// y por tanto no la pueden quemar al scrappear GitHub.

export default async function handler(req, res) {
  // CORS — ajusta el origin si quieres restringir a tu dominio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });

  const KEY = process.env.GEMINI_API_KEY;
  if (!KEY) return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en Vercel' });

  const model = (req.query.model || 'gemini-1.5-flash-latest').replace(/[^a-z0-9.\-]/gi, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body),
    });
    const text = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', 'application/json').send(text);
  } catch (e) {
    res.status(502).json({ error: 'Upstream error: ' + e.message });
  }
}
