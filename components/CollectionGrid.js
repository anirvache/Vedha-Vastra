'use client';
// Filters run in the browser, so they feel instant on a phone.

import { useEffect, useMemo, useState } from 'react';
import SareeCard from './SareeCard';

const BANDS = [
  { id: 'any', label: 'Any price', test: () => true },
  { id: 'u2', label: 'Under \u20B92,000', test: (p) => p < 2000 },
  { id: '2to5', label: '\u20B92,000 to \u20B95,000', test: (p) => p >= 2000 && p < 5000 },
  { id: '5to10', label: '\u20B95,000 to \u20B910,000', test: (p) => p >= 5000 && p < 10000 },
  { id: '10up', label: '\u20B910,000 and above', test: (p) => p >= 10000 },
];

const uniq = (arr) => Array.from(new Set(arr.filter(Boolean))).sort();

export default function CollectionGrid({ sarees }) {
  const [cat, setCat] = useState('All');
  const [fabric, setFabric] = useState('All');
  const [colour, setColour] = useState('All');
  const [band, setBand] = useState('any');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    try {
      const c = new URLSearchParams(window.location.search).get('cat');
      if (c) setCat(c);
    } catch (e) { /* ignore */ }
  }, []);

  const cats = useMemo(() => uniq(sarees.map((s) => s.category)), [sarees]);
  const fabrics = useMemo(() => uniq(sarees.map((s) => s.fabric)), [sarees]);
  const colours = useMemo(() => uniq(sarees.map((s) => s.colour)), [sarees]);

  const list = useMemo(() => {
    const test = BANDS.find((b) => b.id === band).test;
    let l = sarees.filter((s) =>
      (cat === 'All' || s.category === cat) &&
      (fabric === 'All' || s.fabric === fabric) &&
      (colour === 'All' || s.colour === colour) &&
      test(s.price));
    if (sort === 'low') l = l.slice().sort((a, b) => a.price - b.price);
    if (sort === 'high') l = l.slice().sort((a, b) => b.price - a.price);
    return l;
  }, [sarees, cat, fabric, colour, band, sort]);

  function reset() { setCat('All'); setFabric('All'); setColour('All'); setBand('any'); setSort('new'); }

  return (
    <>
      <div className="chips" role="tablist" aria-label="Categories">
        {['All', ...cats].map((c) => (
          <button key={c} type="button" className={c === cat ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      <div className="filters">
        <select value={fabric} onChange={(e) => setFabric(e.target.value)} aria-label="Fabric">
          <option value="All">All fabrics</option>
          {fabrics.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={colour} onChange={(e) => setColour(e.target.value)} aria-label="Colour">
          <option value="All">All colours</option>
          {colours.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={band} onChange={(e) => setBand(e.target.value)} aria-label="Price">
          {BANDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="new">Newest first</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      <p className="muted small">{list.length} {list.length === 1 ? 'saree' : 'sarees'}</p>

      {list.length ? (
        <div className="grid">{list.map((s) => <SareeCard key={s.id} saree={s} />)}</div>
      ) : (
        <div className="center section">
          <p className="muted">No sarees match these filters.</p>
          <button type="button" className="btn btn-ghost" onClick={reset}>Clear filters</button>
        </div>
      )}
    </>
  );
}
