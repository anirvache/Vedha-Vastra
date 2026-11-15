'use client';
// AI studio photos. Nothing is added to a saree until the shopkeeper ticks it and taps Approve.

import { useState } from 'react';
import { compressImage, blobToDataUrl } from '@/lib/compress';

const SLOTS = [
  { id: 'saree', label: 'A. Saree body', hint: 'Show the main colour and design' },
  { id: 'blouse', label: 'B. Blouse', hint: 'Show the blouse colour and design' },
  { id: 'pallu', label: 'C. Pallu / Mundhani', hint: 'Show the full pallu' },
];
const BACKDROPS = [['cream', 'Cream (warm, classic)'], ['grey', 'Soft grey (modern)'], ['maroon', 'Deep maroon (rich)']];
const MANNEQUINS = [['full', 'Full-length mannequin'], ['torso', 'Torso mannequin']];
const MAX_TRIES = 3;

export default function PhotoTool({ onApproved }) {
  const [slots, setSlots] = useState({});
  const [backdrop, setBackdrop] = useState('cream');
  const [mannequin, setMannequin] = useState('full');
  const [count, setCount] = useState(4);
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const ready = SLOTS.every((s) => slots[s.id]);

  async function pickSlot(id, file) {
    if (!file) return;
    try {
      const blob = await compressImage(file, 1280, 0.8);
      const url = await blobToDataUrl(blob);
      setSlots((s) => ({ ...s, [id]: url }));
    } catch (e) {
      setMsg('Could not read that photo. Please choose another one.');
    }
  }

  async function makeShot(shot) {
    const res = await fetch('/api/admin/ai/photo', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saree: slots.saree, blouse: slots.blouse, pallu: slots.pallu, shot, backdrop, mannequin }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) { window.location.href = '/admin/login'; throw new Error('Please log in again.'); }
    if (!res.ok) throw new Error(data.error || 'The AI could not make this photo.');
    return data.url;
  }

  async function createAll() {
    setBusy(true); setMsg(''); setResults([]);
    const out = [];
    for (let shot = 1; shot <= count; shot++) {
      setMsg('Creating photo ' + shot + ' of ' + count + '. Please wait, do not close this screen...');
      try {
        out.push({ shot, url: await makeShot(shot), tries: 1, keep: false, error: '' });
      } catch (e) {
        out.push({ shot, url: '', tries: 1, keep: false, error: e.message });
      }
      setResults([...out]);
    }
    setMsg('Done. Compare each photo with your real photos above, then tick only the ones that look exactly right.');
    setBusy(false);
  }

  async function retryUnticked() {
    setBusy(true); setMsg('');
    const next = results.slice();
    for (let i = 0; i < next.length; i++) {
      const r = next[i];
      if (r.keep || r.tries >= MAX_TRIES) continue;
      setMsg('Trying photo ' + r.shot + ' again...');
      try {
        next[i] = { ...r, url: await makeShot(r.shot), tries: r.tries + 1, error: '' };
      } catch (e) {
        next[i] = { ...r, tries: r.tries + 1, error: e.message };
      }
      setResults([...next]);
    }
    setMsg('Done. Tick the photos that look right.');
    setBusy(false);
  }

  function approve() {
    const urls = results.filter((r) => r.keep && r.url).map((r) => r.url);
    if (!urls.length) { setMsg('Please tick at least one photo first.'); return; }
    onApproved(urls);
    setResults(results.filter((r) => !(r.keep && r.url)));
    setMsg('\u2714 ' + urls.length + ' photo(s) added.');
  }

  const toggle = (i) => setResults((rs) => rs.map((r, n) => (n === i ? { ...r, keep: !r.keep } : r)));

  return (
    <div className="tool-box">
      <h2>Studio photo tool</h2>
      <p>Add 3 clear photos taken in daylight, then the AI makes studio-style photos. You decide which ones to keep.</p>

      <div className="slots">
        {SLOTS.map((s) => (
          <div key={s.id} className="slot">
            <p className="label">{s.label}</p>
            <p className="muted small">{s.hint}</p>
            {slots[s.id] ? <img src={slots[s.id]} alt={s.label} /> : <div className="slot-empty">No photo yet</div>}
            <label className="small-btn">
              {slots[s.id] ? 'Change' : 'Choose photo'}
              <input type="file" accept="image/*" hidden onChange={(e) => pickSlot(s.id, e.target.files[0])} />
            </label>
          </div>
        ))}
      </div>

      <div className="row">
        <div><label className="label">Background</label>
          <select className="input" value={backdrop} onChange={(e) => setBackdrop(e.target.value)}>
            {BACKDROPS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select></div>
        <div><label className="label">Mannequin</label>
          <select className="input" value={mannequin} onChange={(e) => setMannequin(e.target.value)}>
            {MANNEQUINS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select></div>
        <div><label className="label">How many photos</label>
          <select className="input" value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[3, 4, 5].map((n) => <option key={n} value={n}>{n} photos</option>)}
          </select></div>
      </div>

      <button type="button" className="big-btn gold" disabled={!ready || busy} onClick={createAll}>
        {busy ? 'Working...' : 'Create studio photos'}
      </button>
      {!ready ? <p className="muted small">Add all three photos to continue.</p> : null}
      {msg ? <p className="msg">{msg}</p> : null}

      {results.length ? (
        <>
          <h3>Check the results</h3>
          <p className="muted">Tick only the photos where the colour, border and design match your real saree.</p>
          <div className="result-grid">
            {results.map((r, i) => (
              <div key={r.shot} className={r.keep ? 'result on' : 'result'}>
                {r.url ? <img src={r.url} alt={'Studio photo ' + r.shot} /> : <div className="slot-empty">{r.error || 'No photo'}</div>}
                {r.url ? (
                  <label className="tick">
                    <input type="checkbox" checked={r.keep} onChange={() => toggle(i)} /> Looks right
                  </label>
                ) : null}
                <p className="muted small">Try {r.tries} of {MAX_TRIES}</p>
              </div>
            ))}
          </div>
          <div className="row">
            <button type="button" className="big-btn" disabled={busy} onClick={approve}>Approve ticked photos</button>
            <button type="button" className="big-btn ghost" disabled={busy} onClick={retryUnticked}>Try again for the others</button>
          </div>
        </>
      ) : null}
    </div>
  );
}
