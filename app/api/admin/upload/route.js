import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { adminDb, BUCKET } from '@/lib/supabase';
import { logError } from '@/lib/log_error';

export const runtime = 'nodejs';

export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No photo received.' }, { status: 400 });
    }
    if (file.size > 3.5 * 1024 * 1024) {
      return NextResponse.json({ error: 'That photo is too big.' }, { status: 413 });
    }
    const path = 'real/' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
    const db = adminDb();
    const up = await db.storage.from(BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: 'image/jpeg',
      cacheControl: '31536000',
    });
    if (up.error) throw up.error;
    const { data } = db.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    await logError('upload', err);
    return NextResponse.json({ error: 'The photo could not be saved.' }, { status: 500 });
  }
}
