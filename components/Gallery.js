'use client';
// Swipe on phones, tap thumbnails on larger screens.

import { useRef, useState } from 'react';

export default function Gallery({ images, name }) {
  const ref = useRef(null);
  const [i, setI] = useState(0);

  if (!images.length) return <div className="gallery-empty placeholder" aria-hidden="true" />;

  function onScroll() {
    const el = ref.current;
    if (el && el.clientWidth) setI(Math.round(el.scrollLeft / el.clientWidth));
  }
  function go(n) {
    const el = ref.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <div className="gallery">
      <div className="gallery-strip" ref={ref} onScroll={onScroll}>
        {images.map((im, n) => (
          <div className="gallery-slide" key={im.url}>
            <img src={im.url} alt={name + ' photo ' + (n + 1)} loading={n === 0 ? 'eager' : 'lazy'} />
            {im.kind === 'ai' ? <span className="badge badge-ai">Studio-style image</span> : null}
          </div>
        ))}
      </div>
      {images.length > 1 ? (
        <div className="thumbs">
          {images.map((im, n) => (
            <button key={im.url} type="button" className={n === i ? 'thumb on' : 'thumb'}
              onClick={() => go(n)} aria-label={'Show photo ' + (n + 1)}>
              <img src={im.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
