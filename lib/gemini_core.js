// Shared helper for talking to Gemini over plain web requests. Server-side only.

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function callGemini(model, body, timeoutMs = 55000) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is missing');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(BASE + '/' + model + ':generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error((data && data.error && data.error.message) || 'Gemini error ' + res.status);
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function splitDataUrl(dataUrl) {
  const m = /^data:(.+?);base64,(.+)$/.exec(dataUrl || '');
  if (!m) throw new Error('Bad image data');
  return { mime: m[1], data: m[2] };
}

export function imagePart(dataUrl) {
  const { mime, data } = splitDataUrl(dataUrl);
  return { inline_data: { mime_type: mime, data } };
}
