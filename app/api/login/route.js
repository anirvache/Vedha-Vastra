import { NextResponse } from 'next/server';
import { COOKIE, checkPassword, makeToken } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  if (!checkPassword(body.password)) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return NextResponse.json({ error: 'That password is not right. Please try again.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await makeToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
