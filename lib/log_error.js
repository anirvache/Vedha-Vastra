// Saves any failure to the error_log table so you can see what went wrong.

import { adminDb } from './supabase';

export async function logError(place, err) {
  try {
    console.error('[' + place + ']', err);
    await adminDb().from('error_log').insert({
      place,
      message: String((err && err.message) || err).slice(0, 500),
    });
  } catch (e) {
    // never let logging break the app
  }
}
