import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guard';
import { adminDb, BUCKET } from '@/lib/supabase';
import { SITE } from '@/config/site';
import { FEATURES } from '@/config/features';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });

  add('Admin password is set', !!process.env.ADMIN_PASSWORD, process.env.ADMIN_PASSWORD ? 'Yes' : 'Missing ADMIN_PASSWORD');
  add('Login secret is set', (process.env.SESSION_SECRET || '').length >= 16, 'SESSION_SECRET should be 16+ characters');

  const db = adminDb();
  try {
    const r = await db.from('sarees').select('id', { count: 'exact', head: true });
    add('Database', !r.error, r.error ? r.error.message : (r.count || 0) + ' sarees stored');
  } catch (e) { add('Database', false, e.message); }

  try {
    const r = await db.storage.from(BUCKET).list('', { limit: 1 });
    add('Photo storage', !r.error, r.error ? r.error.message : 'Bucket "' + BUCKET + '" is reachable');
  } catch (e) { add('Photo storage', false, e.message); }

  add('WhatsApp number format', /^\d{10,15}$/.test(SITE.whatsapp), 'Currently ' + SITE.whatsapp + ' (digits only, with country code)');

  const key = process.env.GEMINI_API_KEY;
  add('Gemini key is set', !!key, key ? 'Yes' : 'Missing GEMINI_API_KEY');
  if (key) {
    for (const [label, model] of [['Image model', process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image'], ['Text model', process.env.GEMINI_TEXT_MODEL || 'gemini-3.5-flash']]) {
      try {
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model, { headers: { 'x-goog-api-key': key } });
        add(label + ' (' + model + ')', r.ok, r.ok ? 'Found' : 'Not found or key problem (status ' + r.status + ')');
      } catch (e) { add(label, false, e.message); }
    }
  }

  try {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const r = await db.from('error_log').select('id', { count: 'exact', head: true }).gte('created_at', since);
    add('Errors in last 24 hours', (r.count || 0) === 0, (r.count || 0) + ' (see the error_log table in Supabase)');
  } catch (e) { add('Error log', false, e.message); }

  add('Photo tool switch', true, FEATURES.photoTool ? 'ON' : 'OFF');
  add('Description tool switch', true, FEATURES.descriptionTool ? 'ON' : 'OFF');
  return NextResponse.json({ checks });
}
