import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guard';
import { adminDb, isStorageUrl } from '@/lib/supabase';
import { logError } from '@/lib/log_error';

export const runtime = 'nodejs';

// Attach already-approved photos to an existing saree.
export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    const b = await req.json();
    const db = adminDb();
    const list = (Array.isArray(b.images) ? b.images : []).filter((i) => i && isStorageUrl(i.url));
    if (!b.saree_id || !list.length) return NextResponse.json({ error: 'Nothing to add.' }, { status: 400 });

    const { count } = await db.from('saree_images').select('id', { count: 'exact', head: true }).eq('saree_id', b.saree_id);
    const rows = list.map((i, n) => ({
      saree_id: b.saree_id, url: i.url, kind: i.kind === 'ai' ? 'ai' : 'real',
      sort_order: (count || 0) + n, approved: true,
    }));
    const r = await db.from('saree_images').insert(rows);
    if (r.error) throw r.error;
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (err) {
    await logError('images/attach', err);
    return NextResponse.json({ error: 'The photos could not be added.' }, { status: 500 });
  }
}
