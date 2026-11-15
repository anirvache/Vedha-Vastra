import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/guard';
import { adminDb } from '@/lib/supabase';
import { logError } from '@/lib/log_error';

export const runtime = 'nodejs';
const TEXT_FIELDS = ['name', 'description', 'hook', 'category', 'colour', 'fabric', 'occasion', 'style', 'length', 'blouse_info', 'care'];
const STATUSES = ['draft', 'live', 'hidden', 'sold'];

export async function PATCH(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  try {
    const { id } = await params;
    const b = await req.json();
    const patch = {};
    for (const k of TEXT_FIELDS) {
      if (k in b) patch[k] = b[k] == null ? null : String(b[k]).trim().slice(0, 3000) || null;
    }
    if ('price' in b) {
      const p = Math.round(Number(b.price));
      if (!(p > 0)) return NextResponse.json({ error: 'Please type a valid price.' }, { status: 400 });
      patch.price = p;
    }
    if ('status' in b) {
      if (!STATUSES.includes(b.status)) return NextResponse.json({ error: 'Unknown status.' }, { status: 400 });
      patch.status = b.status;
    }
    if ('name' in patch && !patch.name) return NextResponse.json({ error: 'The name cannot be empty.' }, { status: 400 });
    if (!Object.keys(patch).length) return NextResponse.json({ error: 'Nothing to change.' }, { status: 400 });

    const { error } = await adminDb().from('sarees').update(patch).eq('id', id);
    if (error) throw error;
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (err) {
    await logError('sarees/update', err);
    return NextResponse.json({ error: 'The change could not be saved.' }, { status: 500 });
  }
}
