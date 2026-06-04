/* export.jsx — calendar & markdown export for the itinerary */
/* eslint-disable */

/* ---- helpers ---- */
function _pad(n) { return String(n).padStart(2, '0'); }

function _icsEscape(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function _icsDateTime(dateStr, timeStr) {
  // dateStr: "2026-06-04", timeStr: "9:30" or "09:30"
  const [y, m, d] = dateStr.split('-');
  const parts = (timeStr || '09:00').split(':').map(Number);
  return `${y}${m}${d}T${_pad(parts[0])}${_pad(parts[1] || 0)}00`;
}

function _icsDateTimeEnd(dateStr, timeStr, durationMin) {
  const [y, m, d] = dateStr.split('-');
  const parts = (timeStr || '09:00').split(':').map(Number);
  const totalMin = parts[0] * 60 + (parts[1] || 0) + (durationMin || 60);
  const eh = Math.floor(totalMin / 60) % 24;
  const em = totalMin % 60;
  return `${y}${m}${d}T${_pad(eh)}${_pad(em)}00`;
}

function _buildICS(trip) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//Urubici Itinerary//${trip.destination}//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${trip.destination} · ${trip.dates.label}`,
    'X-WR-TIMEZONE:America/Sao_Paulo',
  ];

  trip.days.forEach(day => {
    day.activities
      .filter(a => a.kind === 'full')
      .forEach(act => {
        const dtstart = _icsDateTime(day.date, act.time);
        const dtend   = _icsDateTimeEnd(day.date, act.time, act.durationMin);
        const desc = [act.description, act.logistics, act.whyHere]
          .filter(Boolean).join('\n\n');
        const uid = `${day.date}-${(act.time || '').replace(':', '')}-${act.title.replace(/[^a-z0-9]/gi, '').toLowerCase()}@urubici-itinerary`;

        lines.push('BEGIN:VEVENT');
        lines.push(`UID:${uid}`);
        lines.push(`DTSTART:${dtstart}`);
        lines.push(`DTEND:${dtend}`);
        lines.push(`SUMMARY:${_icsEscape(act.title)}`);
        lines.push(`LOCATION:${_icsEscape(act.location)}`);
        if (desc) lines.push(`DESCRIPTION:${_icsEscape(desc)}`);
        if (act.mapsUrl) lines.push(`URL:${act.mapsUrl}`);
        lines.push('END:VEVENT');
      });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function _buildMarkdown(trip) {
  const lines = [];
  const fmtDur = (min) => {
    if (!min) return '';
    const h = Math.floor(min / 60), m = min % 60;
    return h ? (m ? ` · ${h}h ${m}min` : ` · ${h}h`) : ` · ${m}min`;
  };

  lines.push(`# ${trip.destination} · ${trip.dates.label}`);
  lines.push('');
  lines.push(`> ${trip.tagline}`);
  lines.push('');
  lines.push(`**Travelers:** ${trip.travelers.label}  `);
  lines.push(`**Weather:** ${trip.weather.low}–${trip.weather.high}${trip.weather.unit}  `);
  lines.push(`**Budget est.:** ${trip.currency} ${trip.budget.estLow.toLocaleString('pt-BR')}–${trip.budget.estHigh.toLocaleString('pt-BR')}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  trip.days.forEach(day => {
    lines.push(`## Day ${day.day} — ${day.label}`);
    lines.push('');
    day.activities.forEach(act => {
      if (act.kind === 'rest') {
        lines.push(`- **${act.time}** — *${act.title}*`);
        if (act.note) lines.push(`  > ${act.note}`);
      } else {
        lines.push(`### ${act.time} · ${act.title}${fmtDur(act.durationMin)}`);
        lines.push('');
        lines.push(`📍 **${act.location}**${act.distance ? ' · ' + act.distance : ''}`);
        if (act.cost !== undefined) {
          const costLabel = act.cost === 0 ? 'Free' : `${trip.currency} ${act.cost}`;
          lines.push(`💰 ${costLabel}${act.costNote ? ' (' + act.costNote + ')' : ''}`);
        }
        lines.push('');
        if (act.description) lines.push(act.description);
        lines.push('');
        if (act.whatToOrder && act.whatToOrder.length) {
          lines.push('**What to order:** ' + act.whatToOrder.join(' · '));
          lines.push('');
        }
        if (act.details && act.details.bring && act.details.bring.length) {
          lines.push('**Bring:** ' + act.details.bring.join(', '));
          lines.push('');
        }
        if (act.mapsUrl) lines.push(`[📍 Open in maps](${act.mapsUrl})`);
        lines.push('');
      }
    });
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push('## Budget');
  lines.push('');
  lines.push('| Item | Notes | Amount |');
  lines.push('|------|-------|--------|');
  trip.budgetLines.forEach(b => {
    lines.push(`| ${b.label} | ${b.note || ''} | ${b.value || ''} |`);
  });
  lines.push('');
  lines.push(`**Total estimate: ${trip.currency} ${trip.budget.estLow.toLocaleString('pt-BR')}–${trip.budget.estHigh.toLocaleString('pt-BR')}**`);
  lines.push('');

  if (trip.skipped && trip.skipped.length) {
    lines.push('---');
    lines.push('');
    lines.push('## Not on this trip');
    lines.push('');
    trip.skipped.forEach(s => lines.push(`- ~~${s.name}~~ — ${s.reason}`));
    lines.push('');
  }

  return lines.join('\n');
}

function _download(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---- ExportSection component ---- */
function ExportSection({ trip, lang = 'en' }) {
  const [done, setDone] = React.useState(null);

  const exportGcal = () => {
    _download(_buildICS(trip), `${trip.destination.toLowerCase()}-itinerary.ics`, 'text/calendar;charset=utf-8');
    setDone('gcal');
    setTimeout(() => setDone(null), 3000);
  };

  const exportOutlook = () => {
    _download(_buildICS(trip), `${trip.destination.toLowerCase()}-itinerary.ics`, 'text/calendar;charset=utf-8');
    setDone('outlook');
    setTimeout(() => setDone(null), 3000);
  };

  const exportMd = () => {
    _download(_buildMarkdown(trip), `${trip.destination.toLowerCase()}-itinerary.md`, 'text/markdown;charset=utf-8');
    setDone('md');
    setTimeout(() => setDone(null), 3000);
  };

  const buttons = [
    {
      id: 'gcal',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M3 9h18" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M8 13.5h2.5l1 1.5-1 1.5H8v-3Z" fill="currentColor" stroke="none"/>
          <path d="M13 13.5h3v1.5h-2v1h2v1.5h-3v-4Z" fill="currentColor" stroke="none" opacity=".7"/>
        </svg>
      ),
      label: t('exportGcal', lang),
      sub: t('exportGcalSub', lang),
      action: exportGcal,
      hint: lang === 'pt'
        ? 'Após baixar, abra o Google Calendar → Configurações → Importar'
        : 'After download, open Google Calendar → Settings → Import',
    },
    {
      id: 'outlook',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="5" width="13" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M15 9l7-4v14l-7-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          <circle cx="8.5" cy="12" r="2.5" fill="currentColor" stroke="none"/>
        </svg>
      ),
      label: t('exportOutlook', lang),
      sub: t('exportIcsSub', lang),
      action: exportOutlook,
      hint: lang === 'pt'
        ? 'Clique duas vezes no arquivo baixado para importar no Outlook / Calendário'
        : 'Double-click the downloaded file to import into Outlook / Calendar',
    },
    {
      id: 'md',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M7 8v8M7 12l3-3 3 3M17 8v8M13 16v-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: t('exportMd', lang),
      sub: t('exportMdSub', lang),
      action: exportMd,
      hint: lang === 'pt'
        ? 'Abre em qualquer editor de texto ou app de notas'
        : 'Opens in any text editor or notes app',
    },
  ];

  return (
    <section className="block" data-screen-label="Export">
      <header className="block__head">
        <p className="eyebrow block__eyebrow">{t('exportLabel', lang)}</p>
        <h2 className="block__title">{t('exportTitle', lang)}</h2>
        <p className="block__sub">{t('exportSub', lang)}</p>
      </header>
      <div className="export-grid stack">
        {buttons.map(btn => (
          <div className="export-card" key={btn.id}>
            <button className={'export-btn' + (done === btn.id ? ' export-btn--done' : '')}
                    onClick={btn.action} aria-label={btn.label}>
              <span className="export-btn__ic">{btn.icon}</span>
              <span className="export-btn__text">
                <span className="export-btn__label">{btn.label}</span>
                <span className="export-btn__sub">{btn.sub}</span>
              </span>
              <span className="export-btn__action">
                {done === btn.id
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v13M5 10l7 7 7-7"/><path d="M3 20h18"/></svg>
                }
              </span>
            </button>
            {done === btn.id && (
              <p className="export-hint">{btn.hint}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { ExportSection });
