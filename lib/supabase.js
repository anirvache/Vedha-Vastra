// The ONLY file that connects to the database. Server-side use only.
// publicDb(): can only read visible sarees (safe). adminDb(): full power, never import in client files.

import { createClient } from '@supabase/supabase-js';

export const BUCKET = 'saree-photos';

export function publicDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}

export function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// Only accept image links that live in our own storage bucket.
export function isStorageUrl(u) {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '') + '/storage/v1/object/public/';
  return typeof u === 'string' && u.startsWith(base);
}
