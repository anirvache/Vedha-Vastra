import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { FEATURES } from '@/config/features';
import { buildPhotoPrompt, SHOTS } from '@/prompts/photo';
import { generateShot } from '@/lib/gemini_image';
import { adminDb, BUCKET } from '@/lib/supabase';
import { logError } from '@/lib/log_error';
import { friendly } from '@/lib/friendly';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Makes ONE studio photo per request. The screen asks several times (one per shot).
export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  if (!FEATURES.photoTool) return NextResponse.json({ error: 'The photo tool is switched off.' }, { status: 403 });

  const db = adminDb();
  try {
    const b = await req.json();
    const shot = Number(b.shot);
    if (!(shot >= 1 && shot <= SHOTS.length)) return NextResponse.json({ error: 'Unknown photo number.' }, { status: 400 });
    if (!b.saree || !b.blouse || !b.pallu) {
      return NextResponse.json({ error: 'Please add all three photos: saree, blouse and pallu.' }, { status: 400 });
    }

    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await db.from('ai_jobs').select('id', { count: 'exact', head: true })
      .eq('tool', 'photo').eq('status', 'ok').gte('created_at', since);
    if ((count || 0) >= FEATURES.dailyPhotoLimit) {
      return NextResponse.json({ error: 'Today\'s limit of ' + FEATURES.dailyPhotoLimit + ' AI photos is used up. Please try again tomorrow.' }, { status: 429 });
    }

    const img = await generateShot({
      promptText: buildPhotoPrompt({ shot, backdrop: b.backdrop, mannequin: b.mannequin }),
      images: [
        { label: 'Image A: saree body', dataUrl: b.saree },
        { label: 'Image B: blouse', dataUrl: b.blouse },
        { label: 'Image C: pallu / mundhani', dataUrl: b.pallu },
      ],
    });

    const ext = img.mime.includes('jpeg') ? 'jpg' : 'png';
    const path = 'ai/' + Date.now() + '-' + shot + '-' + Math.random().toString(36).slice(2, 7) + '.' + ext;
    const up = await db.storage.from(BUCKET).upload(path, Buffer.from(img.data, 'base64'), {
      contentType: img.mime, cacheControl: '31536000',
    });
    if (up.error) throw up.error;
    const { data } = db.storage.from(BUCKET).getPublicUrl(path);

    await db.from('ai_jobs').insert({ tool: 'photo', status: 'ok', detail: 'shot ' + shot });
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    await logError('ai/photo', err);
    await db.from('ai_jobs').insert({ tool: 'photo', status: 'failed', detail: String(err.message).slice(0, 200) }).then(() => {}, () => {});
    return NextResponse.json({ error: friendly(err) }, { status: 500 });
  }
}
