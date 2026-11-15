import Link from 'next/link';
import { SITE } from '@/config/site';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">{SITE.name}</Link>
        <nav className="nav" aria-label="Main">
          <Link href="/collections">Collections</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
