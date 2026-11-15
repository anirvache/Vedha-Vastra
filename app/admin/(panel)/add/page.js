'use client';
// The 3-step "Add a new saree" flow. Auto-saves on this phone, so nothing is lost if the page closes.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/config/site';
import { FEATURES } from '@/config/features';
import { api } from '@/lib/client_api';
import { formatPrice, siteUrl } from '@/lib/format';
import PhotoUploader from '@/components/admin/PhotoUploader';
import PhotoTool from '@/components/admin/PhotoTool';
import TextTool from '@/components/admin/TextTool';

const KEY = 'draft-saree-v1';
const EMPTY = {
  name: '', price: '', category: '', colour: '', fabric: '', occasion: '', style: '',
  length: '5.5 m saree with blouse piece', blouse_info: '', care: 'Dry clean recommended',
  hook: '', description: '',
};

function Pick({ label, value, onChange, options, id }) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input" list={id + '-list'} value={value} onChange={onChange} placeholder="Choose or type" />
      <datalist id={id + '-list'}>{options.map((o) => <option key={o} value={o} />)}</datalist>
    </div>
  );
}

export default function AddSaree() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [showPhotoTool, setShowPhotoTool] = useState(false);
  const [showTextTool, setShowTextTool] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [restored, setRestored] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if ((d.images && d.images.length) || (d.form && d.form.name)) {
          setForm({ ...EMPTY, ...d.form });
          setImages(d.images || []);
          setStep(d.step || 1);
          setRestored(true);
        }
      }
    } catch (e) { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify({ form, images, step })); } catch (e) { /* ignore */ }
  }, [form, images, step, loaded]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canStep2 = images.length > 0;
  const canStep3 = form.name.trim() && Number(form.price) > 0;

  async function publish(status) {
    setBusy(true); setError('');
    try {
      const data = await api('/api/admin/sarees', { method: 'POST', body: JSON.stringify({ ...form, status, images }) });
      try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
      setDone({ code: data.code, status });
    } catch (e) {
      setError(e.message + ' Your saree is still saved on this phone. Please tap the button again.');
    }
    setBusy(false);
  }

  function again() { setForm(EMPTY); setImages([]); setStep(1); setDone(null); setRestored(false); setShowPhotoTool(false); setShowTextTool(false); }

  if (done) {
    const link = siteUrl() + '/saree/' + done.code;
    const share = 'https://wa.me/?text=' + encodeURIComponent(form.name + ' ' + formatPrice(form.price) + '\n' + link);
    return (
      <div className="success">
        <h1>{done.status === 'live' ? '\u2714 Your saree is live!' : '\u2714 Saved as a draft'}</h1>
        {done.status === 'live' ? (
          <>
            <a className="big-btn" href={share} target="_blank" rel="noopener noreferrer">Share on WhatsApp</a>
            <Link className="big-btn ghost" href={'/saree/' + done.code} target="_blank">See it on the website</Link>
          </>
        ) : <p>You can publish it later from My sarees.</p>}
        <button type="button" className="big-btn ghost" onClick={again}>Add another saree</button>
        <Link className="link" href="/admin">Back to home</Link>
      </div>
    );
  }

  return (
    <>
      <ol className="stepper">
        {['Photos', 'Details', 'Publish'].map((t, i) => (
          <li key={t} className={step === i + 1 ? 'on' : (step > i + 1 ? 'done' : '')}><span>{i + 1}</span> {t}</li>
        ))}
      </ol>
      {restored && step === 1 ? <p className="msg">We kept your unfinished saree. You can carry on, or <button type="button" className="link-btn" onClick={again}>start fresh</button>.</p> : null}

      {step === 1 ? (
        <>
          <h1>Step 1: Add photos</h1>
          <p>Add clear photos of the saree. Real photos come first on the website.</p>
          <PhotoUploader images={images} onChange={setImages} />
          {FEATURES.photoTool ? (
            <>
              <button type="button" className="big-btn gold" onClick={() => setShowPhotoTool(!showPhotoTool)}>
                {showPhotoTool ? 'Hide the photo tool' : 'Make studio photos with AI (optional)'}
              </button>
              {showPhotoTool ? <PhotoTool onApproved={(urls) => setImages((im) => [...im, ...urls.map((url) => ({ url, kind: 'ai' }))])} /> : null}
            </>
          ) : null}
          <button type="button" className="big-btn" disabled={!canStep2} onClick={() => setStep(2)}>Next: details</button>
          {!canStep2 ? <p className="muted small">Add at least one photo to continue.</p> : null}
        </>
      ) : null}

      {step === 2 ? (
        <>
          <h1>Step 2: Details</h1>
          <label className="label" htmlFor="name">Saree name</label>
          <input id="name" className="input" value={form.name} onChange={set('name')} placeholder="For example: Maroon Kanchipuram Silk" />
          <label className="label" htmlFor="price">Price in rupees</label>
          <input id="price" className="input" type="number" inputMode="numeric" value={form.price} onChange={set('price')} placeholder="For example: 8500" />
          <Pick id="cat" label="Category" value={form.category} onChange={set('category')} options={SITE.categories} />
          <Pick id="col" label="Colour" value={form.colour} onChange={set('colour')} options={SITE.colours} />
          <Pick id="fab" label="Fabric" value={form.fabric} onChange={set('fabric')} options={SITE.fabrics} />
          <Pick id="occ" label="Occasion" value={form.occasion} onChange={set('occasion')} options={SITE.occasions} />
          <Pick id="sty" label="Fashion style" value={form.style} onChange={set('style')} options={SITE.styles} />
          <label className="label" htmlFor="len">Length</label>
          <input id="len" className="input" value={form.length} onChange={set('length')} />
          <label className="label" htmlFor="blo">Blouse details</label>
          <input id="blo" className="input" value={form.blouse_info} onChange={set('blouse_info')} placeholder="For example: Contrast gold blouse piece" />
          <label className="label" htmlFor="care">Care</label>
          <input id="care" className="input" value={form.care} onChange={set('care')} />

          <label className="label" htmlFor="desc">Description</label>
          <textarea id="desc" className="input" rows={6} value={form.description} onChange={set('description')} placeholder="Type it yourself, or let the AI write it." />
          {FEATURES.descriptionTool ? (
            <>
              <button type="button" className="big-btn gold" onClick={() => setShowTextTool(!showTextTool)}>
                {showTextTool ? 'Hide the description writer' : 'Write the description for me (optional)'}
              </button>
              {showTextTool ? (
                <TextTool fields={form} imageUrls={images.map((i) => i.url)}
                  onUse={(r) => { setForm((f) => ({ ...f, description: r.description || f.description, hook: r.hook || f.hook })); setShowTextTool(false); }} />
              ) : null}
            </>
          ) : null}

          <div className="row">
            <button type="button" className="big-btn ghost" onClick={() => setStep(1)}>Back</button>
            <button type="button" className="big-btn" disabled={!canStep3} onClick={() => setStep(3)}>Next: preview</button>
          </div>
          {!canStep3 ? <p className="muted small">Type the name and the price to continue.</p> : null}
        </>
      ) : null}

      {step === 3 ? (
        <>
          <h1>Step 3: Check and publish</h1>
          <p className="muted">This is how customers will see it.</p>
          <div className="preview">
            {images[0] ? <img src={images[0].url} alt="Main" /> : null}
            <h2>{form.name}</h2>
            <p className="price big">{formatPrice(form.price)}</p>
            {form.hook ? <p className="lead">{form.hook}</p> : null}
            {form.description ? <p>{form.description}</p> : null}
            <p className="muted small">{[form.fabric, form.colour, form.occasion, form.style].filter(Boolean).join(' \u00B7 ')}</p>
            <p className="muted small">{images.length} photo(s)</p>
          </div>
          {error ? <p className="msg msg-bad">{error}</p> : null}
          <button type="button" className="big-btn" disabled={busy} onClick={() => publish('live')}>{busy ? 'Please wait...' : 'PUBLISH NOW'}</button>
          <div className="row">
            <button type="button" className="big-btn ghost" disabled={busy} onClick={() => setStep(2)}>Back</button>
            <button type="button" className="big-btn ghost" disabled={busy} onClick={() => publish('draft')}>Save as draft</button>
          </div>
        </>
      ) : null}
    </>
  );
}
