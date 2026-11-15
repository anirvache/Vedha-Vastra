import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guard';
import { adminDb, isStorageUrl } from '@/lib/supabase';
import { shape } from '@/lib/data';
import { logError } from '@/lib/log_error';

export const runtime = 'nodejs';
const clean = (v) => (v == null ? null : String(v).trim().slice(0, 3000) || null);
const makeCode = () => 'SR-' + Date.now().toString(36).slice(-5).toUpperCase();

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    const { data, error } = await adminDb()
      .from('sarees').select('*, saree_images(url,kind,sort_order)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ sarees: (data || []).map(shape) });
  } catch (err) {
    await logError('sarees/list', err);
    return NextResponse.json({ error: 'Could not load your sarees. Please refresh.' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    const b = await req.json();
    const name = String(b.name || '').trim();
    const price = Math.round(Number(b.price));
    if (!name) return NextResponse.json({ error: 'Please type the saree name.' }, { status: 400 });
    if (!(price > 0)) return NextResponse.json({ error: 'Please type the price.' }, { status: 400 });

    const row = {
      code: makeCode(), name, price,
      status: b.status === 'live' ? 'live' : 'draft',
      category: clean(b.category), colour: clean(b.colour), fabric: clean(b.fabric),
      occasion: clean(b.occasion), style: clean(b.style), length: clean(b.length),
      blouse_info: clean(b.blouse_info), care: clean(b.care),
      hook: clean(b.hook), description: clean(b.description),
    };
    const db = adminDb();
    const { data, error } = await db.from('sarees').insert(row).select('id,code').single();
    if (error) throw error;

    const imgs = (Array.isArray(b.images) ? b.images : [])
      .filter((i) => i && isStorageUrl(i.url))
      .map((i, n) => ({ saree_id: data.id, url: i.url, kind: i.kind === 'ai' ? 'ai' : 'real', sort_order: n, approved: true }));
    if (imgs.length) {
      const r = await db.from('saree_images').insert(imgs);
      if (r.error) throw r.error;
    }
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true, id: data.id, code: data.code });
  } catch (err) {
    await logError('sarees/create', err);
    return NextResponse.json({ error: 'The saree could not be saved.' }, { status: 500 });
  }
}
