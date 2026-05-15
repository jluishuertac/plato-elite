# 🚀 Pla.to — Cómo desplegar en Vercel (3 pasos)

Todo el código ya está listo. Solo necesitas hacer 3 cosas y queda funcionando.

---

## ✅ Paso 1 — Generar key nueva de Gemini

La key vieja (`AIzaSyAlU6...`) **ya está muerta**: Google la revocó automáticamente cuando subiste el repo a GitHub.

1. Abre 👉 https://aistudio.google.com/apikey
2. Click **"Create API key"**
3. Copia la key (empieza con `AIzaSy...`)

---

## ✅ Paso 2 — Pegarla en Vercel como variable de entorno

1. Abre https://vercel.com/dashboard
2. Click en tu proyecto **plato**
3. **Settings → Environment Variables**
4. Add new:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `AIzaSy...` (la que acabas de generar)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
5. **Save**

---

## ✅ Paso 3 — Redeploy

1. **Deployments** (en el menú superior del proyecto)
2. En el último deployment, los 3 puntitos `⋯` → **Redeploy**
3. Espera ~30 segundos

---

## 🎉 Listo

Abre tu app, entra como usuario y prueba Alba. Debe responder normal.

---

## ¿Cómo funciona?

- El frontend (`app.html`) llama a **`/api/gemini`** (que está en tu mismo dominio Vercel).
- Vercel ejecuta `api/gemini.js` en el servidor.
- El servidor lee `GEMINI_API_KEY` de las env vars **(que nunca llega al browser)**.
- Hace la llamada a Google y devuelve la respuesta al frontend.
- **La key nunca aparece en HTML, JS, ni en el repo.** No la pueden quemar.

---

## ⚠️ Importante — Restringe la key en Google Cloud

Para que nadie pueda abusar de tu key aunque encontrara la URL de tu proxy:

1. Ve a https://console.cloud.google.com/apis/credentials
2. Click en tu key nueva
3. **API restrictions** → "Restrict key" → marca solo **Generative Language API**
4. **Application restrictions** → "HTTP referrers" → agrega:
   - `https://tu-proyecto.vercel.app/*`
   - `https://*.vercel.app/*` (para previews de PRs)
   - Si tienes dominio propio: `https://tu-dominio.com/*`
5. **Save**

---

## Plan B — Si Alba no responde después del redeploy

Verifica:

**a) ¿La env var está bien escrita?**
   Tiene que decir exactamente `GEMINI_API_KEY` (mayúsculas, guión bajo).

**b) ¿Hiciste redeploy DESPUÉS de agregar la var?**
   Vercel solo aplica env vars en deploys nuevos.

**c) ¿La key está activa?**
   En https://console.cloud.google.com/apis/credentials revisa que tu key no tenga ⚠️.

**d) Test manual desde la consola del browser** (en tu app live):
   ```js
   fetch('/api/gemini?model=gemini-1.5-flash-latest', {
     method:'POST', headers:{'Content-Type':'application/json'},
     body: JSON.stringify({contents:[{parts:[{text:'di hola'}]}]})
   }).then(r=>r.json()).then(console.log)
   ```
   Si te responde con texto generado por Gemini → todo OK.
   Si dice `"GEMINI_API_KEY no configurada"` → revisa paso 2 y 3.

---

## Modo dev local (sin tocar Vercel)

Si quieres probar Alba estando en local sin haber configurado Vercel, simplemente:
1. Entra a `/admin.html` (con tu cuenta `luiscomercializadora31@gmail.com`)
2. **Config IA → Gemini API Key → Guardar**
3. El frontend detecta que el proxy no responde y usa la key de localStorage como fallback.
