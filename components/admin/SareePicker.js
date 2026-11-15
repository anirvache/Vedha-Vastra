'use client';
// A simple dropdown listing all sarees. Used by the standalone AI tool screens.

import { useEffect, useState } from 'react';
import { api } from '@/lib/client_api';

export default function SareePicker({ onPick }) {
  const [list, setList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/sarees').then((d) => setList(d.sarees)).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <label className="label" htmlFor="picker">Which saree?</label>
      <select id="picker" className="input" defaultValue="" onChange={(e) => onPick(list.find((s) => s.id === e.target.value) || null)}>
        <option value="">Choose a saree...</option>
        {list.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
      </select>
      {error ? <p className="msg msg-bad">{error}</p> : null}
    </div>
  );
}
