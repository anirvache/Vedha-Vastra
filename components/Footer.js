import Link from 'next/link';
import { SITE } from '@/config/site';
import { waLink } from '@/lib/format';
import { generalText } from '@/content/texts';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="logo small-logo">{SITE.name}</p>
          <p className="muted">{SITE.tagline}</p>
        </div>
        <div>
          <p className="footer-title">Visit or call</p>
          <p className="muted">{SITE.address}</p>
          <p className="muted">{SITE.hours}</p>
          <p><a href={'tel:+' + SITE.whatsapp}>{SITE.phoneDisplay}</a></p>
        </div>
        <div>
          <p className="footer-title">Quick links</p>
          <p><Link href="/collections">Collections</Link></p>
          <p><Link href="/about">About us</Link></p>
          <p><Link href="/contact">Delivery and returns</Link></p>
          <p><a href={waLink(generalText())} target="_blank" rel="noopener noreferrer">WhatsApp us</a></p>
          {SITE.instagram ? <p><a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></p> : null}
        </div>
      </div>
      <p className="container copyright muted small">&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
    </footer>
  );
}
