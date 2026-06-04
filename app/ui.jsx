/* ui.jsx — primitives: placeholder imagery, gallery, lightbox, mini-map, badges */
/* eslint-disable */
const { useState, useRef, useEffect, useCallback } = React;

/* curated harmonious placeholder palettes (low chroma, travel-guide tones) */
const PH_TONES = [
  ['#9fb3a6', '#6f8a7c'], // sage
  ['#a9bccb', '#76909f'], // mist blue
  ['#c4b49a', '#9c8669'], // sand
  ['#9bb0a0', '#5f7a6a'], // forest
  ['#b7a6b0', '#8a7480'], // heather
  ['#aebfb4', '#7e9586'], // eucalyptus
];
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

/* ---- Real image or placeholder ---- */
function MediaSlide({ image, height = 200, rounded = false, showLabel = true }) {
  if (image && image.src) {
    return (
      <div className="ph" style={{ height, borderRadius: rounded ? 'var(--radius-sm)' : 0, overflow: 'hidden' }}>
        <img src={image.src} alt={image.alt || ''}
             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  return <Placeholder label={(image && image.label) || 'Photo coming soon'} height={height} rounded={rounded} showLabel={showLabel} />;
}

function Placeholder({ label, height = 200, icon = 'camera', rounded = false, showLabel = true }) {
  const [a, b] = PH_TONES[hashStr(label || '') % PH_TONES.length];
  const ang = 145 + (hashStr(label || 'x') % 40);
  return (
    <div className="ph" style={{
      height,
      borderRadius: rounded ? 'var(--radius-sm)' : 0,
      background: `linear-gradient(${ang}deg, ${a}, ${b})`,
    }}>
      <div className="ph__stripes" />
      <div className="ph__ic"><Icon name={icon} size={Math.min(34, height / 4)} stroke={1.5} /></div>
      {showLabel && <div className="ph__label"><Icon name="camera" size={11} /> {label}</div>}
    </div>
  );
}

/* ---- Gallery: swipe carousel + dots + fullscreen lightbox ---- */
function Gallery({ images, height = 200, onOpen }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const onScroll = useCallback(() => {
    const el = ref.current; if (!el) return;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  }, []);
  if (!images || !images.length) return <Placeholder label="No photos yet" height={height} />;
  return (
    <div className="gallery">
      <div className="gallery__strip" ref={ref} onScroll={onScroll}>
        {images.map((im, i) => (
          <div className="gallery__slide" key={i} onClick={() => onOpen && onOpen(i)} role="button"
               aria-label={`Open photo ${i + 1} of ${images.length}: ${im.alt || im.label || ''}`}>
            <MediaSlide image={im} height={height} showLabel={!im.src && i === idx} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="gallery__dots">
            {images.map((_, i) => <span key={i} className={'gallery__dot' + (i === idx ? ' on' : '')} />)}
          </div>
          <div className="gallery__count" aria-hidden="true">{idx + 1}/{images.length}</div>
        </>
      )}
    </div>
  );
}

/* ---- Fullscreen lightbox with pinch-zoom (native via touch-action) ---- */
function Lightbox({ images, start = 0, title, onClose }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(start);
  useEffect(() => {
    const el = ref.current; if (el) el.scrollLeft = start * el.clientWidth;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && ref.current) ref.current.scrollBy({ left: ref.current.clientWidth, behavior: 'smooth' });
      if (e.key === 'ArrowLeft' && ref.current) ref.current.scrollBy({ left: -ref.current.clientWidth, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [start, onClose]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} photo gallery`}>
      <div className="lightbox__bar">
        <span className="lightbox__title">{title} · {idx + 1} / {images.length}</span>
        <button className="lightbox__x" onClick={onClose} aria-label="Close gallery"><Icon name="close" size={20} /></button>
      </div>
      <div className="lightbox__stage" ref={ref}
           onScroll={(e) => setIdx(Math.round(e.target.scrollLeft / e.target.clientWidth))}>
        {images.map((im, i) => (
          <div className="lightbox__slide" key={i}>
            <div className="lightbox__zoom"><MediaSlide image={im} height={420} rounded /></div>
          </div>
        ))}
      </div>
      <div className="lightbox__foot">Pinch to zoom · swipe to browse</div>
    </div>
  );
}

/* ---- Mini map preview + open-in-app actions ---- */
function MiniMap({ coords, title, expanded }) {
  const q = encodeURIComponent(title || `${coords.lat},${coords.lng}`);
  const ll = `${coords.lat},${coords.lng}`;
  const apps = [
    { name: 'Google Maps', icon: 'navigation', href: `https://www.google.com/maps/search/?api=1&query=${ll}` },
    { name: 'Apple Maps', icon: 'map', href: `https://maps.apple.com/?q=${q}&ll=${ll}` },
    { name: 'Waze', icon: 'arrowUpRight', href: `https://waze.com/ul?ll=${ll}&navigate=yes` },
  ];
  const open = (href) => window.open(href, '_blank', 'noopener');
  return (
    <div>
      <div className="map" onClick={() => open(apps[0].href)} role="button" aria-label={`Open ${title} in Google Maps`}>
        <div className="map__grid" />
        <div className="map__road" style={{ left: '-10%', top: '34%', width: '70%', transform: 'rotate(-9deg)' }} />
        <div className="map__road" style={{ left: '40%', top: '62%', width: '80%', transform: 'rotate(7deg)' }} />
        <div className="map__road" style={{ left: '20%', top: '10%', width: '8px', height: '90%', transform: 'rotate(4deg)' }} />
        <div className="map__pulse" />
        <div className="map__pin"><Icon name="pin" size={26} stroke={2} /></div>
        <div className="map__cta"><Icon name="navigation" size={12} /> Directions</div>
      </div>
      {expanded && (
        <div className="map__apps">
          {apps.map(a => (
            <button className="map__app" key={a.name} onClick={() => open(a.href)}>
              <Icon name={a.icon} size={14} /> {a.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Badge pills ---- */
function BadgeRow({ items, lang = 'en' }) {
  if (!items || !items.length) return null;
  return (
    <div className="badges">
      {items.map(b => {
        const meta = BADGES[b]; if (!meta) return null;
        const warn = b === 'stroller-no' || b === 'cold';
        const label = t('badge_' + b, lang) || meta.label;
        return (
          <span className={'badge' + (warn ? ' badge--warn' : '')} key={b}>
            <Icon name={meta.icon} size={14} /> {label}
          </span>
        );
      })}
    </div>
  );
}

const fmtMoney = (cur, n) => n === 0 ? 'Free' : `${cur} ${n.toLocaleString('pt-BR')}`;
const fmtDuration = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m} min`;
};

/* ---- MapChip — WhatsApp/Telegram style link preview ---- */
function MapChip({ mapsUrl, mapsPreview, title }) {
  if (!mapsUrl) return null;
  const p = mapsPreview || {};
  const display = p.domain || 'maps.google.com';
  const label = p.title || title || 'Open location';
  const desc = p.description || '';
  return (
    <a className="mapchip" href={mapsUrl} target="_blank" rel="noopener noreferrer"
       aria-label={`Open ${label} in Google Maps`}>
      <span className="mapchip__stripe" />
      <span className="mapchip__body">
        <span className="mapchip__domain">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round" style={{marginRight:4,verticalAlign:-1}}>
            <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>
          </svg>
          {display}
        </span>
        <span className="mapchip__title">{label}</span>
        {desc && <span className="mapchip__desc">{desc}</span>}
      </span>
      <span className="mapchip__arrow">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>
      </span>
    </a>
  );
}

Object.assign(window, { Placeholder, MediaSlide, Gallery, Lightbox, MiniMap, MapChip, BadgeRow, fmtMoney, fmtDuration });
