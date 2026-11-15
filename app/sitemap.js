import { getSarees } from '@/lib/data';
import { siteUrl } from '@/lib/format';

export const revalidate = 3600;

export default async function sitemap() {
  const base = siteUrl();
  const sarees = await getSarees();
  return [
    { url: base },
    { url: base + '/collections' },
    { url: base + '/about' },
    { url: base + '/contact' },
    ...sarees.map((s) => ({ url: base + '/saree/' + s.code })),
  ];
}
