import { SITE } from '@/config/site';

export function formatPrice(n) {
  const v = Number(n);
  if (!isFinite(v)) return '';
  return SITE.currencySymbol + v.toLocaleString('en-IN');
}

export function waLink(text) {
  return 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(text || '');
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}
