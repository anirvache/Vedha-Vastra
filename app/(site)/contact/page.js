import { SITE } from '@/config/site';
import { waLink } from '@/lib/format';
import { generalText } from '@/content/texts';

export const metadata = { title: 'Contact, delivery and returns' };

export default function Contact() {
  const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(SITE.address);
  return (
    <div className="container section narrow">
      <h1>Contact us</h1>
      <p><a className="btn btn-wa" href={waLink(generalText())} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>
      <p>Call: <a href={'tel:+' + SITE.whatsapp}>{SITE.phoneDisplay}</a></p>
      <p>{SITE.address}<br /><a className="link" href={map} target="_blank" rel="noopener noreferrer">Open in Maps</a></p>
      <p className="muted">{SITE.hours}</p>

      <h2>Delivery, returns and care</h2>
      {SITE.policies.map((p) => (
        <div key={p.title} className="policy"><h3>{p.title}</h3><p>{p.text}</p></div>
      ))}
    </div>
  );
}
