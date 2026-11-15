'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not log in.');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="admin-wrap">
      <h1>Shop admin</h1>
      <p>Type your password to open your shop panel.</p>
      <form onSubmit={submit}>
        <label className="label" htmlFor="pw">Password</label>
        <input id="pw" className="input" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" autoFocus />
        {error ? <p className="msg msg-bad">{error}</p> : null}
        <button className="big-btn" type="submit" disabled={busy || !password}>{busy ? 'Please wait...' : 'Open my shop panel'}</button>
      </form>
    </div>
  );
}
