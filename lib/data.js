// Reads sarees for the PUBLIC website. If the database is down, returns an empty list
// instead of crashing, so the site still opens.

import { cache } from 'react';
import { publicDb } from './supabase';

const SELECT = '*, saree_images(url,kind,sort_order)';

// Real photos first, then AI studio images.
export function shape(row) {
  const imgs = (row.saree_images || []).slice().sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'real' ? -1 : 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });
  const { saree_images, ...rest } = row;
  return { ...rest, images: imgs, cover: imgs.length ? imgs[0].url : null };
}

export const getSarees = cache(async () => {
  try {
    const { data, error } = await publicDb()
      .from('sarees').select(SELECT)
      .in('status', ['live', 'sold'])
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(shape);
  } catch (e) {
    console.error('getSarees failed:', e.message);
    return [];
  }
});

export const getSaree = cache(async (code) => {
  try {
    const { data, error } = await publicDb()
      .from('sarees').select(SELECT)
      .in('status', ['live', 'sold']).eq('code', code).maybeSingle();
    if (error) throw error;
    return data ? shape(data) : null;
  } catch (e) {
    console.error('getSaree failed:', e.message);
    return null;
  }
});
