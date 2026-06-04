/* timeline.jsx — full cards (outing/meal) + rest beats (nap/drive/routine) + animated spine */
/* eslint-disable */
const { useState: useS, useRef: useR, useEffect: useE } = React;

const REST_ICON = { nap: 'moon', travel: 'car', routine: 'bed', 'meal-light': 'coffeeCup' };

function Stars({ n }) {
  return (
    <span className="stars" aria-label={`Baby suitability ${n} of 5`}>
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name="star" size={12} stroke={1}
              style={{ fill: i <= n ? 'currentColor' : 'none', opacity: i <= n ? 1 : 0.3 }} />
      ))}
    </span>
  );
}

function DetailGrid({ d, lang = 'en' }) {
  const rows = [
    ['clock', t('detHours', lang), d.hours],
    ['wallet', t('detPrice', lang), d.ticket],
    ['parking', t('detParking', lang), d.parking],
    ['accessible', t('detAccess', lang), d.accessibility],
  ].filter(r => r[2]);
  return (
    <div className="detail-grid">
      {rows.map(([ic, k, v], i) => (
        <div className={'detail' + (rows.length % 2 && i === rows.length - 1 ? ' detail--full' : '')} key={k}>
          <span className="detail__k"><Icon name={ic} size={13} /> {k}</span>
          <span className="detail__v">{v}</span>
        </div>
      ))}
      {d.babyFriendly && (
        <div className="detail detail--full">
          <span className="detail__k"><Icon name="baby" size={13} /> {t('detBaby', lang)}</span>
          <span className="detail__v">{d.babyFriendly}</span>
        </div>
      )}
    </div>
  );
}

/* ---- quiet rest beat: nap / drive / evening routine ---- */
function RestRow({ act, lang = 'en' }) {
  const [open, setOpen] = useS(false);
  return (
    <article className={'tl-item tl-item--seen tl-item--rest tl-item--' + act.mode} data-time={act.time}>
      <div className="tl-item__node" />
      <div className="tl-item__time" aria-hidden="true">{act.time}</div>
      <button className="rest" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="rest__ic"><Icon name={REST_ICON[act.mode] || 'moon'} size={18} /></span>
        <span className="rest__txt">
          <span className="rest__top">
            <span className="rest__title">{act.title}</span>
            {act.mandatory && <span className="rest__tag">{t('mandatory', lang)}</span>}
          </span>
          <span className="rest__loc">{act.time} · {act.location}</span>
          <span className={'rest__note' + (open ? ' open' : '')}>{act.note}</span>
        </span>
        <span className="rest__chev"><Icon name="chevronDown" size={15} /></span>
      </button>
    </article>
  );
}

/* ---- full stop: outing or meal ---- */
function FullCard({ act, cur, openLightbox, animate, lang = 'en' }) {
  const [open, setOpen] = useS(false);
  const cat = CATEGORY[act.category] || { icon: 'pin' };
  const ref = useR(null);
  const [seen, setSeen] = useS(!animate);
  const m = act.meal;

  useE(() => {
    if (!animate || !ref.current) { setSeen(true); return; }
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); setSeen(true); io.unobserve(el); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  const d = act.details || {};
  const hasGallery = act.gallery && act.gallery.length;
  const imgs = hasGallery ? act.gallery : [act.image];
  const pid = 'panel-' + act.title.replace(/[^a-z0-9]+/gi, '-');

  return (
    <article className={'tl-item' + (seen ? ' tl-item--seen' : '')} data-time={act.time}>
      <div className="tl-item__node" />
      <div className="tl-item__time" aria-hidden="true">{act.time}</div>
      <div className={'card' + (animate ? '' : ' in')} ref={ref}>
        <div className="card__media">
          <span className="card__cat"><Icon name={cat.icon} size={13} /> {t('cat_' + act.category, lang)}</span>
          <span className={'card__cost' + (act.cost === 0 ? ' card__cost--free' : '')}>{fmtMoney(cur, act.cost)}</span>
          <Gallery images={imgs} height={188} onOpen={(i) => openLightbox(imgs, i, act.title)} />
        </div>

        <div className="card__body">
          <div className="card__time">
            <span>{act.time}</span><span className="dot" />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon name="duration" size={12} /> {fmtDuration(act.durationMin)}
            </span>
            {act.distance && <><span className="dot" /><span>{act.distance}</span></>}
          </div>
          <h3 className="card__title">{act.title}</h3>
          <div className="card__loc"><Icon name="pin" size={13} /> {act.location}</div>

          {(m || act.babyRating) && (
            <div className="metastrip">
              {m && m.rating && <span className="meta"><Icon name="star" size={13} style={{ fill: 'currentColor' }} /> {m.rating} <span className="faint">({m.reviews.toLocaleString('pt-BR')})</span></span>}
              {m && m.price && <span className="meta"><Icon name="wallet" size={13} /> {m.price}</span>}
              {act.babyRating && <span className="meta meta--baby"><Icon name="baby" size={13} /> <Stars n={act.babyRating} /></span>}
            </div>
          )}

          <p className="card__desc">{act.description}</p>
        </div>

        {act.mapsUrl && <MapChip mapsUrl={act.mapsUrl} mapsPreview={act.mapsPreview} title={act.location} />}

        {act.logistics && (
          <div className="logi"><span className="logi__ic"><Icon name="clock" size={14} /></span><span>{act.logistics}</span></div>
        )}

        <BadgeRow items={act.badges} />

        <div className="card__foot">
          <button className="expandbtn" aria-expanded={open} onClick={() => setOpen(o => !o)} aria-controls={pid}>
            {open ? t('hideDetails', lang) : t('viewDetails', lang)} <Icon name="chevronDown" size={16} />
          </button>
          <button className="iconbtn" aria-label={`Open map for ${act.location}`}
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${act.coords.lat},${act.coords.lng}`, '_blank', 'noopener')}>
            <Icon name="navigation" size={18} />
          </button>
        </div>

        <div className={'panel' + (open ? ' open' : '')} id={pid}>
          <div className="panel__inner">
            <div className="panel__pad">
              {act.whyHere && (
                <div className="why">
                  <span className="why__k"><Icon name="info" size={13} /> {t('whyItFits', lang)}</span>
                  <p className="why__b">{act.whyHere}</p>
                </div>
              )}

              {act.whatToOrder && act.whatToOrder.length > 0 && (
                <>
                  <div className="section-label"><Icon name="utensils" size={13} /> {t('whatToOrder', lang)}</div>
                  <div className="bring">{act.whatToOrder.map(x => <span key={x}>{x}</span>)}</div>
                </>
              )}

              <div className="section-label"><Icon name="info" size={13} /> {t('practicalInfo', lang)}</div>
              <DetailGrid d={d} lang={lang} />

              {d.bestTime && (
                <>
                  <div className="section-label"><Icon name="clock" size={13} /> {t('bestTime', lang)}</div>
                  <p className="card__desc" style={{ paddingLeft: 0 }}>{d.bestTime}</p>
                </>
              )}

              {d.bring && d.bring.length > 0 && (
                <>
                  <div className="section-label"><Icon name="shield" size={13} /> {t('whatToBring', lang)}</div>
                  <div className="bring">{d.bring.map(x => <span key={x}>{x}</span>)}</div>
                </>
              )}

              {d.tips && d.tips.length > 0 && (
                <>
                  <div className="section-label"><Icon name="star" size={13} /> {t('notesLabel', lang)}</div>
                  <ul className="tips-list">{d.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
                </>
              )}

              <div className="section-label"><Icon name="map" size={13} /> {t('locationLabel', lang)}</div>
              <MiniMap coords={act.coords} title={act.location} expanded />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function TimelineItem(props) {
  return props.act.kind === 'rest' ? <RestRow act={props.act} lang={props.lang} /> : <FullCard {...props} />;
}

function DaySection({ day, cur, layout, openLightbox, animate, registerRef, lang = 'en' }) {
  const progRef = useR(null);
  const wrapRef = useR(null);

  useE(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const update = () => {
      const items = [...wrap.querySelectorAll('.tl-item')];
      let maxY = 0;
      items.forEach(it => {
        if (it.classList.contains('tl-item--seen')) {
          const node = it.querySelector('.tl-item__node');
          maxY = Math.max(maxY, node.offsetTop + node.offsetHeight / 2);
        }
      });
      if (progRef.current) progRef.current.style.height = maxY + 'px';
    };
    update();
    const t = setInterval(update, 350);
    return () => clearInterval(t);
  }, [layout]);

  return (
    <section className="day" ref={(el) => registerRef(day.day, el)} data-day={day.day} data-screen-label={`Day ${day.day}`}>
      <header className="day__head">
        <span className="day__num">{t('day', lang)} {day.day}</span>
        <h2 className="day__title">{day.label}</h2>
        <span className="day__date">{t('stops', lang, day.activities.filter(a => a.kind === 'full').length)}</span>
      </header>
      <div className="timeline" data-layout={layout} ref={wrapRef}>
        <div className="timeline__spine">
          <div className="timeline__progress" ref={progRef} style={{ height: 0 }} />
        </div>
        {day.activities.map((act, i) => (
          <TimelineItem key={i} act={act} cur={cur} openLightbox={openLightbox} animate={animate} lang={lang} />
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { TimelineItem, FullCard, RestRow, DaySection, Stars, DetailGrid });
