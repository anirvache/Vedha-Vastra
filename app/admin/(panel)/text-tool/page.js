'use client';
import { useState } from 'react';
import SareePicker from '@/components/admin/SareePicker';
import TextTool from '@/components/admin/TextTool';
import { api } from '@/lib/client_api';

export default function TextToolPage() {
  const [saree, setSaree] = useState(null);
  const [msg, setMsg] = useState('');

  async function save(result) {
    try {
      await api('/api/admin/sarees/' + saree.id, { method: 'PATCH', body: JSON.stringify(result) });
      setMsg('\u2714 Saved. The new description is on the website.');
    } catch (e) { setMsg(e.message); }
  }

  return (
    <>
      <h1>Description tool</h1>
      <SareePicker onPick={(s) => { setSaree(s); setMsg(''); }} />
      {saree ? (
        <TextTool key={saree.id} fields={saree} imageUrls={saree.images.map((i) => i.url)} onUse={save} />
      ) : <p className="muted">Choose a saree to begin.</p>}
      {msg ? <p className="msg">{msg}</p> : null}
    </>
  );
}
