'use client';
import { useState } from 'react';
import SareePicker from '@/components/admin/SareePicker';
import PhotoTool from '@/components/admin/PhotoTool';
import { api } from '@/lib/client_api';

export default function PhotoToolPage() {
  const [saree, setSaree] = useState(null);
  const [msg, setMsg] = useState('');

  async function attach(urls) {
    try {
      await api('/api/admin/images', {
        method: 'POST',
        body: JSON.stringify({ saree_id: saree.id, images: urls.map((url) => ({ url, kind: 'ai' })) }),
      });
      setMsg('\u2714 Added to ' + saree.name + '. It is now on the website.');
    } catch (e) { setMsg(e.message); }
  }

  return (
    <>
      <h1>Photo tool</h1>
      <SareePicker onPick={(s) => { setSaree(s); setMsg(''); }} />
      {saree ? <PhotoTool onApproved={attach} /> : <p className="muted">Choose a saree to begin.</p>}
      {msg ? <p className="msg">{msg}</p> : null}
    </>
  );
}
