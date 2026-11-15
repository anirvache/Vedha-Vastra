import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container section center">
      <h1>We could not find that page</h1>
      <p className="muted">It may have moved, or the saree may have been sold.</p>
      <Link className="btn" href="/collections">See all sarees</Link>
    </div>
  );
}
