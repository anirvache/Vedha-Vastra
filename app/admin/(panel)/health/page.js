'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/client_api';

export default function Health() {
  const [checks, setChecks] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/health').then((d) => setChecks(d.checks)).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <h1>Is everything working?</h1>
      <p className="muted">Green means fine. Red means tell your website helper which line is red.</p>
      {error ? <p className="msg msg-bad">{error}</p> : null}
      {!checks && !error ? <p>Checking...</p> : null}
      <ul className="health">
        {(checks || []).map((c) => (
          <li key={c.name} className={c.ok ? 'ok' : 'bad'}>
            <span className="dot" /> <strong>{c.name}</strong><br /><span className="muted small">{c.detail}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
