import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { FEATURES } from '@/config/features';
import { buildTextPrompt } from '@/prompts/text';
import { writeDescription } from '@/lib/gemini_text';
import { isStorageUrl } from '@/lib/supabase';
import { logError } from '@/lib/log_error';
import { friendly } from '@/lib/friendly';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function urlToDataUrl(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Could not read a photo');
  const buf = Buffer.from(await r.arrayBuffer());
  const mime = r.headers.get('content-type') || 'image/jpeg';
  return 'data:' + mime + ';base64,' + buf.toString('base64');
}

export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  if (!FEATURES.descriptionTool) return NextResponse.json({ error: 'The description tool is switched off.' }, { status: 403 });
  try {
    const b = await req.json();
    const urls = (Array.isArray(b.imageUrls) ? b.imageUrls : []).filter(isStorageUrl).slice(0, 3);
    let imageDataUrls = [];
    try { imageDataUrls = await Promise.all(urls.map(urlToDataUrl)); } catch (e) { imageDataUrls = []; }

    const draft = await writeDescription({
      promptText: buildTextPrompt({ fields: b.fields, tone: b.tone, language: b.language }),
      imageDataUrls,
    });
    return NextResponse.json({ draft });
  } catch (err) {
    await logError('ai/text', err);
    return NextResponse.json({ error: friendly(err) }, { status: 500 });
  }
}
