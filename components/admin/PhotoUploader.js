'use client';
// Pick photos, shrink them on the phone, upload them. The first photo is the main photo.

import { useRef, useState } from 'react';
import { compressImage } from '@/lib/compress';

export default function PhotoUploader({ images, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function pick(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setMsg('');
    const added = [];
    for (let i = 0; i < files.length; i++) {
      try {
        setMsg('Uploading photo ' + (i + 1) + ' of ' + files.length + '...');
        const blob = await compressImage(files[i]);
        const fd = new FormData();
        fd.append('file', blob, 'photo.jpg');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) { window.location.href = '/admin/login'; return; }
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        added.push({ url: data.url, kind: 'real' });
      } catch (err) {
        setMsg('Photo ' + (i + 1) + ' did not upload: ' + err.message + ' Please add it again.');
      }
    }
    if (added.length) onChange([...images, ...added]);
    if (added.length === files.length) setMsg('');
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  }

  const remove = (n) => onChange(images.filter((_, i) => i !== n));
  const makeMain = (n) => onChange([images[n], ...images.filter((_, i) => i !== n)]);

  return (
    <div>
      <input ref={inputRef} id="photo-input" type="file" accept="image/*" multiple onChange={pick} hidden />
      <label htmlFor="photo-input" className={busy ? 'big-btn disabled' : 'big-btn'}>
        {busy ? 'Uploading...' : (images.length ? '\uD83D\uDCF7 Add more photos' : '\uD83D\uDCF7 Add photos')}
      </label>
      {msg ? <p className="msg">{msg}</p> : null}

      <div className="thumb-grid">
        {images.map((im, n) => (
          <div className="thumb-card" key={im.url}>
            <img src={im.url} alt={'Photo ' + (n + 1)} />
            {n === 0 ? <span className="badge badge-main">Main photo</span> : null}
            {im.kind === 'ai' ? <span className="badge badge-ai">AI studio</span> : null}
            <div className="thumb-actions">
              {n !== 0 ? <button type="button" className="small-btn" onClick={() => makeMain(n)}>Make main</button> : null}
              <button type="button" className="small-btn bad" onClick={() => remove(n)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
