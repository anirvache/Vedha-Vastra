import { siteUrl } from '@/lib/format';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: siteUrl() + '/sitemap.xml',
  };
}
