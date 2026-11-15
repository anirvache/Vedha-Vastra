import { notFound } from 'next/navigation';
import { SITE } from '@/config/site';
import { TEXTS, enquiryText } from '@/content/texts';
import { formatPrice, waLink, siteUrl } from '@/lib/format';
import { getSaree, getSarees } from '@/lib/data';
import Gallery from '@/components/Gallery';
import SareeCard from '@/components/SareeCard';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { code } = await params;
  const s = await getSaree(code);
  if (!s) return { title: 'Saree not found' };
  return {
    title: s.name,
    description: (s.hook || s.description || SITE.tagline).slice(0, 155),
    openGraph: { title: s.name, images: s.cover ? [s.cover] : [] },
  };
}

export default async function SareePage({ params }) {
  const { code } = await params;
  const s = await getSaree(code);
  if (!s) notFound();

  const sold = s.status === 'sold';
  const url = siteUrl() + '/saree/' + s.code;
  const msg = sold ? 'Hello! I saw ' + s.name + ' (' + s.code + ') was sold. Do you have something similar?' : enquiryText(s, url);
  const cta = sold ? TEXTS.askSimilar : TEXTS.enquire;
  const hasAi = s.images.some((i) => i.kind === 'ai');

  const facts = [
    ['Fabric', s.fabric], ['Colour', s.colour], ['Length', s.length], ['Blouse', s.blouse_info],
    ['Occasion', s.occasion], ['Style', s.style], ['Care', s.care],
  ].filter(([, v]) => v);

  const all = await getSarees();
  const related = all.filter((x) => x.code !== s.code && x.status === 'live' &&
    (x.category === s.category || x.colour === s.colour)).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: s.name,
    description: s.description || s.hook || s.name, image: s.images.map((i) => i.url), sku: s.code,
    offers: { '@type': 'Offer', priceCurrency: 'INR', price: s.price, availability: sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' },
  };

  return (
    <div className="container section product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="product">
        <div>
          <Gallery images={s.images} name={s.name} />
          {hasAi ? <p className="muted small note">{TEXTS.aiNote}</p> : null}
        </div>

        <div>
          <p className="muted small">Code: {s.code}</p>
          <h1>{s.name}</h1>
          <p className="price big">{formatPrice(s.price)}</p>
          {sold ? <p className="sold-note">{TEXTS.soldNote}</p> : null}
          {s.hook ? <p className="lead">{s.hook}</p> : null}

          <a className="btn btn-wa btn-block only-desktop" href={waLink(msg)} target="_blank" rel="noopener noreferrer">{cta}</a>

          {s.description ? s.description.split(/\n+/).map((p, i) => <p key={i}>{p}</p>) : null}

          {facts.length ? (
            <table className="facts"><tbody>
              {facts.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
            </tbody></table>
          ) : null}

          <ul className="mini-policy">
            {SITE.policies.slice(0, 3).map((p) => <li key={p.title}><strong>{p.title}:</strong> {p.text}</li>)}
          </ul>
        </div>
      </div>

      {related.length ? (
        <section className="related">
          <h2>You may also like</h2>
          <div className="grid">{related.map((r) => <SareeCard key={r.id} saree={r} />)}</div>
        </section>
      ) : null}

      <div className="sticky-cta only-mobile">
        <a className="btn btn-wa btn-block" href={waLink(msg)} target="_blank" rel="noopener noreferrer">{cta}</a>
      </div>
    </div>
  );
}
