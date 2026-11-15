import Link from 'next/link';
import { formatPrice } from '@/lib/format';

export default function SareeCard({ saree }) {
  const sold = saree.status === 'sold';
  const meta = [saree.fabric, saree.colour].filter(Boolean).join(' \u00B7 ');
  return (
    <Link href={'/saree/' + saree.code} className="card">
      <div className="card-media">
        {saree.cover
          ? <img src={saree.cover} alt={saree.name} loading="lazy" />
          : <div className="placeholder" aria-hidden="true" />}
        {sold ? <span className="badge badge-sold">Sold</span> : null}
      </div>
      <div className="card-body">
        <h3>{saree.name}</h3>
        {meta ? <p className="muted small">{meta}</p> : null}
        <p className="price">{formatPrice(saree.price)}</p>
      </div>
    </Link>
  );
}
