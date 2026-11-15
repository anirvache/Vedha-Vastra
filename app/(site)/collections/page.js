import { getSarees } from '@/lib/data';
import { TEXTS } from '@/content/texts';
import CollectionGrid from '@/components/CollectionGrid';

export const revalidate = 60;
export const metadata = { title: 'Collections', description: 'Browse our sarees by fabric, colour, occasion and price.' };

export default async function Collections() {
  const sarees = await getSarees();
  return (
    <div className="container section">
      <h1>Collections</h1>
      {sarees.length ? <CollectionGrid sarees={sarees} /> : <p className="muted">{TEXTS.noSarees}</p>}
    </div>
  );
}
