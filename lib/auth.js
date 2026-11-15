// Admin login by one password. Works in both the Edge (middleware) and Node runtimes.

const enc = new TextEncoder();
export const COOKIE = 'admin_session';
const DAYS = 30;

async function sign(message) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(process.env.SESSION_SECRET || ''),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function makeToken() {
  const exp = String(Date.now() + DAYS * 24 * 3600 * 1000);
  return exp + '.' + (await sign(exp));
}

export async function verifyToken(token) {
  if (!token || !process.env.SESSION_SECRET) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await sign(exp));
}

export function checkPassword(input) {
  const real = process.env.ADMIN_PASSWORD || '';
  return real.length > 0 && safeEqual(String(input || ''), real);
}
