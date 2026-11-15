import { SITE } from '@/config/site';

export const metadata = { title: 'About us' };

export default function About() {
  return (
    <div className="container section narrow">
      <h1>About {SITE.name}</h1>
      {SITE.about.map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}
