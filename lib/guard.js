// Used at the top of every admin API route (double protection on top of middleware).

import { cookies } from 'next/headers';
import { COOKIE, verifyToken } from './auth';

export async function requireAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}
