import Link from 'next/link';
import { SITE } from '@/config/site';
import { TEXTS, generalText } from '@/content/texts';
import { waLink } from '@/lib/format';
import { getSarees } from '@/lib/data';
import SareeCard from '@/components/SareeCard';

export const revalidate = 60;

export default async function Home() {
  const sarees = await getSarees();
  const latest = sarees.slice(0, 8);
  const heroStyle = SITE.heroImage ? { backgroundImage: 'linear-gradient(rgba(35,31,32,.45),rgba(35,31,32,.45)), url(' + SITE.heroImage + ')' } : undefined;

  return (
    <>
      <section className={SITE.heroImage ? 'hero hero-photo' : 'hero'} style={heroStyle}>
        <div className="container hero-inner">
          <p className="eyebrow">{SITE.eyebrow}</p>
          <h1>{TEXTS.heroTitle}</h1>
          <p className="lead">{SITE.tagline}</p>
          <div className="hero-actions">
            <Link className="btn btn-light" href="/collections">{TEXTS.viewCollection}</Link>
            <a className="btn btn-wa" href={waLink(generalText())} target="_blank" rel="noopener noreferrer">{TEXTS.chatWhatsApp}</a>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="container trust-grid">
          {SITE.trust.map((t) => (
            <div key={t.title}><p className="trust-title">{t.title}</p><p className="muted small">{t.text}</p></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{TEXTS.shopByCategory}</h2>
          <div className="cat-grid">
            {SITE.categories.slice(0, 6).map((c) => (
              <Link key={c} href={'/collections?cat=' + encodeURIComponent(c)} className="cat-tile">{c}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>{TEXTS.newArrivals}</h2>
          {latest.length
            ? <div className="grid">{latest.map((s) => <SareeCard key={s.id} saree={s} />)}</div>
            : <p className="muted">{TEXTS.noSarees}</p>}
          <p className="center"><Link className="btn btn-ghost" href="/collections">See all sarees</Link></p>
        </div>
      </section>

      <section className="section">
        <div className="container narrow center">
          <h2>Our story</h2>
          <p>{SITE.about[0]}</p>
          <Link className="link" href="/about">Read more</Link>
        </div>
      </section>
    </>
  );
}
