/* App.jsx — assembles the JSON-driven itinerary */
/* eslint-disable */
const { useState: uS, useRef: uR, useEffect: uE, useMemo: uM, useCallback: uC } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "timelineLayout": "edge",
  "accent": "#2f5d50",
  "dark": false,
  "animate": true
}/*EDITMODE-END*/;

const ACCENTS = ['#2f5d50', '#b2603a', '#3a4f8a', '#6b4e7d', '#1c1c1c'];

/* ---------------- Language picker ---------------- */
const LANGS = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
];

function LangPicker({ lang, onChange }) {
  const [open, setOpen] = uS(false);
  const ref = uR(null);
  const cur = LANGS.find(l => l.code === lang) || LANGS[0];

  uE(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="langpicker" ref={ref}>
      <button className="hero__chip langpicker__btn"
              aria-haspopup="listbox" aria-expanded={open}
              onClick={() => setOpen(o => !o)}>
        <span aria-hidden="true">{cur.flag}</span>
        <span>{cur.code.toUpperCase()}</span>
        <Icon name="chevronDown" size={12} style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <ul className="langpicker__drop" role="listbox" aria-label="Language">
          {LANGS.map(l => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button className={'langpicker__opt' + (l.code === lang ? ' langpicker__opt--active' : '')}
                      onClick={() => { onChange(l.code); setOpen(false); }}>
                <span aria-hidden="true">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ trip, scrollRef, lang, onLangChange }) {
  const mediaRef = uR(null);
  uE(() => {
    const sc = scrollRef.current; if (!sc) return;
    const onScroll = () => {
      const y = sc.scrollTop;
      if (mediaRef.current && y < 700) {
        mediaRef.current.style.transform = `translateY(${y * 0.35}px) scale(${1 + y * 0.0004})`;
      }
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    return () => sc.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className="hero">
      <div className="hero__media" ref={mediaRef} style={{ height: 620, top: -20 }}>
        {trip.hero.src
          ? <img src={trip.hero.src} alt={trip.hero.alt || trip.hero.label}
                 style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <Placeholder label={trip.hero.label} height={620} icon="mountain" showLabel={false} />}
      </div>
      <div className="hero__scrim" />
      <div className="hero__top">
        <span className="hero__chip"><Icon name="calendar" size={14} /> {trip.dates.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="hero__chip"><Icon name="sunCloud" size={15} /> {trip.weather.low}–{trip.weather.high}{trip.weather.unit}</span>
          <LangPicker lang={lang} onChange={onLangChange} />
        </div>
      </div>
      <div className="hero__body">
        <p className="hero__region">{trip.region}</p>
        <h1 className="hero__title">{trip.destination}</h1>
        <p className="hero__tagline">{trip.tagline}</p>
      </div>
    </header>
  );
}

/* ---------------- Summary card ---------------- */
function Summary({ trip, lang = 'en' }) {
  const cur = trip.currency;
  return (
    <div className="summary">
      <div className="summary__grid">
        <div className="summary__cell">
          <span className="summary__k"><Icon name="calendar" size={13} /> {t('duration', lang)}</span>
          <span className="summary__v"><span className="num">{trip.durationDays}</span> {lang === 'pt' ? 'dias · 2 noites' : 'days · 2 nights'}</span>
        </div>
        <div className="summary__cell">
          <span className="summary__k"><Icon name="users" size={13} /> {t('travelers', lang)}</span>
          <span className="summary__v">{trip.travelers.label}</span>
        </div>
        <div className="summary__cell">
          <span className="summary__k"><Icon name="bed" size={13} /> {t('hotelPaid', lang)}</span>
          <span className="summary__v"><span className="num">{cur} {trip.budget.hotelPaid.toLocaleString('pt-BR')}</span></span>
        </div>
        <div className="summary__cell">
          <span className="summary__k"><Icon name="wallet" size={13} /> {t('estSpend', lang)}</span>
          <span className="summary__v" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 18 }}>{cur} {trip.budget.estLow.toLocaleString('pt-BR')}–{trip.budget.estHigh.toLocaleString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Sticky day nav ---------------- */
function DayNav({ days, active, onPick, stuck, lang = 'en' }) {
  const trackRef = uR(null);
  uE(() => {
    const el = trackRef.current?.querySelector('.daypill--active');
    if (el) el.scrollIntoView ? null : null; // avoid scrollIntoView; rely on layout
  }, [active]);
  return (
    <nav className={'daynav' + (stuck ? ' daynav--stuck' : '')} aria-label="Day navigation">
      <div className="daynav__track" ref={trackRef}>
        {days.map(d => (
          <button key={d.day} className={'daypill' + (active === d.day ? ' daypill--active' : '')}
                  onClick={() => onPick(d.day)} aria-current={active === d.day}>
            <span className="daypill__k">{t('day', lang)} {d.day}</span>
            <span className="daypill__v">{d.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ---------------- Baby's rhythm reference ---------------- */
function BabyRhythm({ trip, lang = 'en' }) {
  const [open, setOpen] = uS(false);
  const r = trip.babyRoutine;
  return (
    <div className="rhythm">
      <div className="rhythm__card">
        <button className="rhythm__head" aria-expanded={open} onClick={() => setOpen(o => !o)} aria-controls="rhythm-body">
          <span className="rhythm__ic"><Icon name="baby" size={20} /></span>
          <span className="rhythm__t">
            <span className="rhythm__title">{t('babyRhythm', lang)}</span>
            <span className="rhythm__sub">{t('babyRhythmSub', lang)}</span>
          </span>
          <span className="rhythm__chev"><Icon name="chevronDown" size={18} /></span>
        </button>
        <div className={'panel' + (open ? ' open' : '')} id="rhythm-body">
          <div className="panel__inner">
            <div className="rhythm__list">
              {r.blocks.map((b, i) => (
                <div className={'rblock rblock--' + b.mode} key={i}>
                  <span className="rblock__time">{b.time}</span>
                  <span className="rblock__dot" />
                  <span className="rblock__b">
                    <span className="rblock__label">{b.label}</span>
                    {b.note && <span className="rblock__note">{b.note}</span>}
                  </span>
                </div>
              ))}
            </div>
            <div className="rhythm__rule"><Icon name="info" size={15} /><span>{r.rule}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Budget summary (itemised ranges) ---------------- */
function Budget({ trip, lang = 'en' }) {
  const cur = trip.currency;
  return (
    <section className="block" data-screen-label="Budget">
      <header className="block__head">
        <p className="eyebrow block__eyebrow">{t('money', lang)}</p>
        <h2 className="block__title">{t('tripBudget', lang)}</h2>
        <p className="block__sub">{t('budgetSub', lang)}</p>
      </header>
      <div className="budget">
        <div className="budget__card">
          {trip.budgetLines.map((b, i) => (
            <div className="bline" key={i}>
              <span className="bline__label">{b.label}</span>
              {b.note && <span className="bline__note">{b.note}</span>}
              {b.paid && <span className="bline__paid">{t('paid', lang)}</span>}
              <span className="bline__val">{b.value}</span>
            </div>
          ))}
          <div className="budget__total">
            <span className="lbl">{t('totalEstimate', lang)}</span>
            <span className="val">{cur} {trip.budget.estLow.toLocaleString('pt-BR')}–{trip.budget.estHigh.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        <p className="budget__note">{t('budgetNote', lang, cur, trip.budget.hotelPaid.toLocaleString('pt-BR'))}</p>
      </div>
    </section>
  );
}

/* ---------------- Travel tips (from alerts) ---------------- */
function Tips({ trip, lang = 'en' }) {
  return (
    <section className="block" data-screen-label="Travel tips">
      <header className="block__head">
        <p className="eyebrow block__eyebrow">{t('beforeYouGo', lang)}</p>
        <h2 className="block__title">{t('knowBeforeYouGo', lang)}</h2>
        <p className="block__sub">{t('tipsSub', lang)}</p>
      </header>
      <div className="stack">
        {trip.alerts.map((al, i) => (
          <div className="tipcard" key={i}>
            <span className="tipcard__ic"><Icon name={al.icon} size={20} /></span>
            <div>
              <p className="tipcard__t">{al.title}</p>
              <p className="tipcard__b">{al.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Considered & cut ---------------- */
function Skipped({ trip, lang = 'en' }) {
  const [open, setOpen] = uS(false);
  return (
    <section className="block" data-screen-label="Not this trip">
      <header className="block__head">
        <p className="eyebrow block__eyebrow">{t('honestCuts', lang)}</p>
        <h2 className="block__title">{t('notOnThisTrip', lang)}</h2>
        <p className="block__sub">{t('skippedSub', lang)}</p>
      </header>
      <div className="stack">
        <div className="skipped">
          {(open ? trip.skipped : trip.skipped.slice(0, 3)).map((s, i) => (
            <div className="skip" key={i}>
              <span className="skip__x"><Icon name="close" size={12} /></span>
              <span>
                <span className="skip__name">{s.name}</span>
                <span className="skip__reason">{s.reason}</span>
              </span>
            </div>
          ))}
        </div>
        {trip.skipped.length > 3 && (
          <button className="expandbtn" style={{ flex: 'none' }} aria-expanded={open} onClick={() => setOpen(o => !o)}>
            {open ? t('showFewer', lang) : t('showAll', lang, trip.skipped.length)} <Icon name="chevronDown" size={16} />
          </button>
        )}
      </div>
    </section>
  );
}

/* ---------------- App ---------------- */
function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // lang: own state backed by localStorage, defaults to browser language
  const [lang, setLang] = uS(() => {
    try { return localStorage.getItem('urubici_lang') || DEFAULT_LANG; } catch(e) { return DEFAULT_LANG; }
  });
  uE(() => { try { localStorage.setItem('urubici_lang', lang); } catch(e) {} }, [lang]);
  const trip = uM(() => localizeTrip(window.TRIP, lang), [lang]);
  const scrollRef = uR(null);
  const dayRefs = uR({});
  const [active, setActive] = uS(1);
  const [stuck, setStuck] = uS(false);
  const [lb, setLb] = uS(null);

  const registerRef = uC((day, el) => { if (el) dayRefs.current[day] = el; }, []);
  const openLightbox = uC((images, start, title) => setLb({ images, start, title }), []);

  // scroll spy + stuck nav
  uE(() => {
    const sc = scrollRef.current; if (!sc) return;
    const onScroll = () => {
      setStuck(sc.scrollTop > 360);
      const probe = sc.scrollTop + 140;
      let cur = 1;
      trip.days.forEach(d => {
        const el = dayRefs.current[d.day];
        if (el && el.offsetTop <= probe) cur = d.day;
      });
      setActive(cur);
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => sc.removeEventListener('scroll', onScroll);
  }, []);

  const pickDay = uC((day) => {
    const el = dayRefs.current[day];
    const sc = scrollRef.current;
    if (el && sc) sc.scrollTo({ top: el.offsetTop - 56, behavior: 'smooth' });
  }, []);

  // accent → derived vars (theme-aware via color-mix on --surface)
  const accentVars = uM(() => {
    const a = tw.accent;
    return {
      '--accent': a,
      '--accent-ink': tw.dark ? `color-mix(in srgb, ${a} 55%, white)` : `color-mix(in srgb, ${a} 80%, black)`,
      '--accent-soft': `color-mix(in srgb, ${a} 14%, var(--surface))`,
      '--accent-tint': `color-mix(in srgb, ${a} 8%, var(--surface))`,
    };
  }, [tw.accent, tw.dark]);

  return (
    <div className="app" data-theme={tw.dark ? 'dark' : 'light'} style={accentVars}>
      <div className="scroll" ref={scrollRef}>
        <Hero trip={trip} scrollRef={scrollRef} lang={lang} onLangChange={setLang} />
        <Summary trip={trip} lang={lang} />
        <div style={{ height: 18 }} />
        <DayNav days={trip.days} active={active} onPick={pickDay} stuck={stuck} lang={lang} />
        {trip.days.map(d => (
          <DaySection key={d.day} day={d} cur={trip.currency} layout={tw.timelineLayout}
                      openLightbox={openLightbox} animate={tw.animate} registerRef={registerRef} lang={lang} />
        ))}
        <BabyRhythm trip={trip} lang={lang} />
        <Budget trip={trip} lang={lang} />
        <Tips trip={trip} lang={lang} />
        <Skipped trip={trip} lang={lang} />
        <footer className="footer">
          <p className="footer__mark">{trip.destination}</p>
          <p className="footer__sub">{trip.region} · {trip.dates.label}<br />{t('haveWonderful', lang)}</p>
        </footer>
        <div style={{ height: 24 }} />
      </div>

      {lb && <Lightbox images={lb.images} start={lb.start} title={lb.title} onClose={() => setLb(null)} />}

      <TweaksPanel>
        <TweakSection label={t('tlLayout', lang)} />
        <TweakRadio label={t('styleLabel', lang)} value={tw.timelineLayout}
                    options={[{ value: 'edge', label: 'Edge' }, { value: 'right', label: 'Spine' }, { value: 'center', label: 'Center' }]}
                    onChange={(v) => setTweak('timelineLayout', v)} />
        <TweakSection label={t('themeLabel', lang)} />
        <TweakColor label={t('accentLabel', lang)} value={tw.accent} options={ACCENTS} onChange={(v) => setTweak('accent', v)} />
        <TweakToggle label={t('darkMode', lang)} value={tw.dark} onChange={(v) => setTweak('dark', v)} />
        <TweakToggle label={t('entranceAnim', lang)} value={tw.animate} onChange={(v) => setTweak('animate', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
