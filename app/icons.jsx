/* icons.jsx — minimal line-icon set for UI chrome only. */
/* eslint-disable */
const { createElement: h } = React;

const ICON_PATHS = {
  clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>,
  pin: <><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/></>,
  users: <><circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3.2 3.2 0 0 1 0 6.1M16.5 15.4A5.5 5.5 0 0 1 20.5 19"/></>,
  wallet: <><rect x="3.5" y="6" width="17" height="13" rx="2.5"/><path d="M3.5 10h17"/><circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none"/></>,
  duration: <><path d="M7 3.5h10M7 20.5h10"/><path d="M8 3.5c0 4 8 5 8 8.5s-8 4.5-8 8.5"/><path d="M16 3.5c0 4-8 5-8 8.5s8 4.5 8 8.5"/></>,
  route: <><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5"/></>,
  chevronDown: <path d="M6 9.5l6 6 6-6"/>,
  chevronRight: <path d="M9 6l6 6-6 6"/>,
  chevronLeft: <path d="M15 6l-6 6 6 6"/>,
  arrowRight: <><path d="M4 12h16"/><path d="M14 6l6 6-6 6"/></>,
  arrowUpRight: <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
  close: <path d="M6 6l12 12M18 6 6 18"/>,
  map: <><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z"/><path d="M9 4v14M15 6v14"/></>,
  navigation: <path d="M3.5 11 20.5 4l-7 16.5-2.5-7-7-2.5Z"/>,
  camera: <><rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13.5" r="3.2"/></>,
  expand: <><path d="M4 9V5a1 1 0 0 1 1-1h4M20 9V5a1 1 0 0 0-1-1h-4M4 15v4a1 1 0 0 0 1 1h4M20 15v4a1 1 0 0 1-1 1h-4"/></>,
  baby: <><circle cx="12" cy="6.5" r="2.6"/><path d="M7 14c1.5 1.5 3.2 2.2 5 2.2s3.5-.7 5-2.2"/><path d="M9.5 10.5c-1.5 1-2 3-1 5l1 2M14.5 10.5c1.5 1 2 3 1 5l-1 2"/></>,
  parking: <><rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M10 16V8h2.8a2.4 2.4 0 0 1 0 4.8H10"/></>,
  restroom: <><path d="M7 21v-5H5l1.6-5.2A2 2 0 0 1 8.5 9.4h.4"/><circle cx="8" cy="5.5" r="1.8"/><path d="M17 21v-4M15 21v-4M16 13l1.6-3.4a1.6 1.6 0 0 0-3.2 0L16 13"/><circle cx="16" cy="5.5" r="1.8"/><path d="M12 3.5v17" strokeDasharray="2 2"/></>,
  highchair: <><path d="M8 4h5l-.6 6H8.6L8 4Z"/><path d="M7.5 7h6"/><path d="M8.6 10l-1.6 10M12.4 10l1.6 10M7.6 16h4.8"/></>,
  wifi: <><path d="M4.5 9.5a11 11 0 0 1 15 0M7.5 13a6.5 6.5 0 0 1 9 0"/><path d="M10.5 16.3a2.2 2.2 0 0 1 3 0"/><circle cx="12" cy="19.2" r="0.6" fill="currentColor" stroke="none"/></>,
  accessible: <><circle cx="12" cy="4.5" r="1.8"/><path d="M9 8h5l.5 4H17l1.5 7"/><path d="M14 12a5 5 0 1 1-5 1"/></>,
  stroller: <><path d="M4 5h2.5l2 8h8a4 4 0 0 0 0-8H9"/><circle cx="9.5" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/></>,
  strollerNo: <><path d="M4 5h2.5l2 8h8a4 4 0 0 0 0-8H9"/><circle cx="9.5" cy="18" r="1.8"/><circle cx="16.5" cy="18" r="1.8"/><path d="M3 3l18 18" stroke="currentColor"/></>,
  easy: <><circle cx="12" cy="12" r="8.5"/><path d="M8 12.5l2.5 2.5 5-5.5"/></>,
  cold: <><path d="M12 3v18M5 7.5l14 9M19 7.5l-14 9"/><path d="M12 3l-2.2 2.2M12 3l2.2 2.2M12 21l-2.2-2.2M12 21l2.2-2.2"/></>,
  snow: <><path d="M12 3v18M5 7.5l14 9M19 7.5l-14 9"/><path d="M12 3l-2.2 2.2M12 3l2.2 2.2M12 21l-2.2-2.2M12 21l2.2-2.2"/></>,
  car: <><path d="M4 16v-3.2L6 8h12l2 4.8V16"/><path d="M3.5 16h17"/><path d="M5 16v2M19 16v2"/><circle cx="8" cy="13.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="16" cy="13.5" r="1.1" fill="currentColor" stroke="none"/></>,
  shield: <><path d="M12 3.5l7 2.5v5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-2.5Z"/><path d="M9 12l2 2 4-4.5"/></>,
  sunCloud: <><circle cx="9" cy="9" r="3.2"/><path d="M9 2.5v1.5M3.4 4.4l1 1M14.6 4.4l-1 1M2.5 9H4"/><path d="M8 19h9a3.2 3.2 0 0 0 .3-6.4 4.4 4.4 0 0 0-8.4-.6A3.4 3.4 0 0 0 8 19Z"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/></>,
  info: <><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none"/></>,
  utensils: <><path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10"/><path d="M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4 2.5-1 2.5-4-1-5-2.5-5ZM16 16v5"/></>,
  coffee: <><path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"/><path d="M16 9.5h2a2 2 0 0 1 0 4h-2"/><path d="M8 3.5v2M11 3.5v2"/></>,
  leaf: <><path d="M5 19c0-7 5-13 14-14 0 9-5 14-12 14a6 6 0 0 1-2 0Z"/><path d="M5 19c3-5 6-7 11-9"/></>,
  bed: <><path d="M3.5 18v-7M3.5 14h17v4M20.5 18v-3"/><path d="M3.5 11h6a2.5 2.5 0 0 1 2.5 2.5V14"/><circle cx="7" cy="9" r="1.6"/></>,
  mountain: <><path d="M3 19h18L14 6l-3.5 6L8 9l-5 10Z"/><path d="M12.5 10.5 14 6"/></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>,
  moon: <path d="M20 13.5A8 8 0 0 1 9.5 4 7.5 7.5 0 1 0 20 13.5Z"/>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16Z"/><path d="M10 21h4"/></>,
  coffeeCup: <><path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z"/><path d="M16 9.5h2a2 2 0 0 1 0 4h-2"/><path d="M8 3.5v2M11 3.5v2"/></>,
};

function Icon({ name, size = 20, stroke = 1.75, style = {}, className }) {
  const p = ICON_PATHS[name];
  if (!p) return null;
  return h('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round',
    strokeLinejoin: 'round', style, className, 'aria-hidden': true,
  }, p);
}

// category → icon + label mapping
const CATEGORY = {
  Stay:      { icon: 'bed',      tone: 'sand' },
  Nature:    { icon: 'leaf',     tone: 'green' },
  Food:      { icon: 'utensils', tone: 'clay' },
  Café:      { icon: 'coffee',   tone: 'clay' },
  Viewpoint: { icon: 'mountain', tone: 'sky' },
  Leisure:   { icon: 'eye',      tone: 'green' },
};

// badge → icon + label
const BADGES = {
  baby:         { icon: 'baby',        label: 'Baby friendly' },
  parking:      { icon: 'parking',     label: 'Parking' },
  restroom:     { icon: 'restroom',    label: 'Restroom' },
  highchair:    { icon: 'highchair',   label: 'High chair' },
  wifi:         { icon: 'wifi',        label: 'Wi-Fi' },
  accessible:   { icon: 'accessible',  label: 'Accessible' },
  stroller:     { icon: 'stroller',    label: 'Stroller OK' },
  'stroller-no':{ icon: 'strollerNo',  label: 'No stroller' },
  easy:         { icon: 'easy',        label: 'Easy access' },
  cold:         { icon: 'cold',        label: 'Cold / windy' },
};

Object.assign(window, { Icon, CATEGORY, BADGES });
