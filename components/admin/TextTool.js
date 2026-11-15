'use client';
// AI description writer. The draft can be edited, and nothing is saved until "Use this description".

import { useState } from 'react';

const TONES = ['Traditional', 'Modern', 'Short'];
const LANGS = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada'];

export default function TextTool({ fields, imageUrls = [], onUse }) {
  const [tone, setTone] = useState('Traditional');
  const [language, setLanguage] = useState('English');
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function generate() {
    if (!fields.colour && !fields.fabric) {
      setMsg('Please fill in at least the colour and the fabric first.');
      return;
    }
    setBusy(true); setMsg('');
    try {
      const res = await fetch('/api/admin/ai/text', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields, imageUrls: imageUrls.slice(0, 3), tone, language }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { window.location.href = '/admin/login'; return; }
      if (!res.ok) throw new Error(data.error || 'The AI could not write this.');
      setDraft(data.draft);
    } catch (e) {
      setMsg(e.message);
    }
    setBusy(false);
  }

  const edit = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });

  return (
    <div className="tool-box">
      <h2>Description writer</h2>
      <div className="row">
        <div><label className="label">Style of writing</label>
          <select className="input" value={tone} onChange={(e) => setTone(e.target.value)}>
            {TONES.map((t) => <option key={t}>{t}</option>)}
          </select></div>
        <div><label className="label">Language</label>
          <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {LANGS.map((t) => <option key={t}>{t}</option>)}
          </select></div>
      </div>
      <button type="button" className="big-btn gold" onClick={generate} disabled={busy}>
        {busy ? 'Writing...' : (draft ? 'Write again' : 'Write the description for me')}
      </button>
      {msg ? <p className="msg msg-bad">{msg}</p> : null}

      {draft ? (
        <div>
          <label className="label">Headline</label>
          <input className="input" value={draft.headline || ''} onChange={edit('headline')} />
          <label className="label">One-line hook</label>
          <input className="input" value={draft.hook || ''} onChange={edit('hook')} />
          <label className="label">Description (you can change any word)</label>
          <textarea className="input" rows={8} value={draft.description || ''} onChange={edit('description')} />
          <p className="muted small">Fabric and care: {draft.fabric_care}</p>
          <p className="muted small">Styling: {draft.styling}</p>
          <label className="label">WhatsApp message to share</label>
          <textarea className="input" rows={3} value={draft.whatsapp_caption || ''} onChange={edit('whatsapp_caption')} />
          <label className="label">Instagram captions</label>
          {(draft.instagram_captions || []).map((c, i) => <p key={i} className="caption">{c}</p>)}
          <button type="button" className="big-btn" onClick={() => onUse({ description: draft.description, hook: draft.hook })}>
            Use this description
          </button>
        </div>
      ) : null}
    </div>
  );
}
