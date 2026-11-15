'use client';
// One card per saree with big, plain buttons: SOLD OUT, HIDE, CHANGE PRICE, EDIT.

import { useEffect, useState } from 'react';
import { api } from '@/lib/client_api';
import { formatPrice } from '@/lib/format';

const LABEL = { live: 'Showing on website', hidden: 'Hidden', sold: 'Sold out', draft: 'Draft (not shown)' };

function Row({ s, reload, say }) {
  const [mode, setMode] = useState('');
  const [price, setPrice] = useState(String(s.price));
  const [name, setName] = useState(s.name);
  const [hook, setHook] = useState(s.hook || '');
  const [desc, setDesc] = useState(s.description || '');
  const [busy, setBusy] = useState(false);

  async function patch(body, okMsg) {
    setBusy(true);
    try {
      await api('/api/admin/sarees/' + s.id, { method: 'PATCH', body: JSON.stringify(body) });
      say('\u2714 ' + okMsg);
      setMode('');
      await reload();
    } catch (e) { say(e.message); }
    setBusy(false);
  }

  const hide = () => { if (window.confirm('Hide this saree from the website?')) patch({ status: 'hidden' }, 'Hidden.'); };

  return (
    <div className="saree-row">
      <div className="saree-top">
        {s.cover ? <img src={s.cover} alt={s.name} /> : <div className="placeholder mini" />}
        <div>
          <strong>{s.name}</strong>
          <div>{formatPrice(s.price)}</div>
          <span className={'status st-' + s.status}>{LABEL[s.status]}</span>
        </div>
      </div>

      <div className="saree-actions">
        {s.status === 'draft' ? <button type="button" className="act ok" disabled={busy} onClick={() => patch({ status: 'live' }, 'Published.')}>PUBLISH</button> : null}
        {s.status === 'live' ? <button type="button" className="act" disabled={busy} onClick={() => patch({ status: 'sold' }, 'Marked as sold out.')}>SOLD OUT</button> : null}
        {s.status === 'sold' ? <button type="button" className="act ok" disabled={busy} onClick={() => patch({ status: 'live' }, 'Back in stock.')}>BACK IN STOCK</button> : null}
        {s.status === 'hidden' ? <button type="button" className="act ok" disabled={busy} onClick={() => patch({ status: 'live' }, 'Now showing.')}>SHOW</button> : null}
        {s.status !== 'hidden' && s.status !== 'draft' ? <button type="button" className="act" disabled={busy} onClick={hide}>HIDE</button> : null}
        <button type="button" className="act" onClick={() => setMode(mode === 'price' ? '' : 'price')}>CHANGE PRICE</button>
        <button type="button" className="act" onClick={() => setMode(mode === 'edit' ? '' : 'edit')}>EDIT</button>
      </div>

      {mode === 'price' ? (
        <div className="inline-form">
          <label className="label">New price in rupees</label>
          <input className="input" type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          <button type="button" className="big-btn" disabled={busy} onClick={() => patch({ price }, 'Price changed.')}>Save price</button>
        </div>
      ) : null}

      {mode === 'edit' ? (
        <div className="inline-form">
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="label">One-line hook</label>
          <input className="input" value={hook} onChange={(e) => setHook(e.target.value)} />
          <label className="label">Description</label>
          <textarea className="input" rows={6} value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button type="button" className="big-btn" disabled={busy} onClick={() => patch({ name, hook, description: desc }, 'Saved.')}>Save changes</button>
        </div>
      ) : null}
    </div>
  );
}

export default function MySarees() {
  const [list, setList] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function reload() {
    try { const d = await api('/api/admin/sarees'); setList(d.sarees); setError(''); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { reload(); }, []);

  return (
    <>
      <h1>My sarees</h1>
      {msg ? <p className="msg toast">{msg}</p> : null}
      {error ? <p className="msg msg-bad">{error}</p> : null}
      {!list && !error ? <p>Loading...</p> : null}
      {list && !list.length ? <p>You have not added any sarees yet. Go back and tap "Add a new saree".</p> : null}
      {(list || []).map((s) => <Row key={s.id} s={s} reload={reload} say={setMsg} />)}
    </>
  );
}
