import './globals.css';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { SITE } from '@/config/site';
import { siteUrl } from '@/lib/format';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-serif', display: 'swap' });

export const metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: SITE.name + ' | Sarees', template: '%s | ' + SITE.name },
  description: SITE.tagline,
  openGraph: { title: SITE.name, description: SITE.tagline, type: 'website' },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#FAF7F2' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable + ' ' + serif.variable}>
      <body>{children}</body>
    </html>
  );
}
