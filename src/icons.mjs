// Line icons (24px grid, stroke = currentColor). Decorative: aria-hidden.

const svg = (body, size = 24) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const paths = {
  // UI
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  cross: '<path d="M7 7l10 10M17 7 7 17"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4M15 10h3M15 13h3"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 18.5h3"/>',
  // Trades
  plumber: '<path d="M12 3s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
  electrician: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  cleaner: '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5.5 15.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L3.5 17.5 5 17z"/>',
  handyman: '<path d="M14.5 6.5a4 4 0 0 0 5 5l-9 9a2.1 2.1 0 0 1-3-3z"/><path d="m14.5 6.5 3-3 3 3-3 3"/>',
  'painter-decorator': '<rect x="3" y="3" width="15" height="6" rx="1.5"/><path d="M18 6h2.5v5H11v3"/><rect x="9" y="14" width="4" height="7" rx="1"/>',
  carpenter: '<path d="M3 17 17 3l4 4L7 21H3z"/><path d="m13 7 4 4M10 10l1.5 1.5M7 13l1.5 1.5"/>',
  gardener: '<path d="M12 21v-9"/><path d="M12 12C12 7 8 4 4 4c0 5 3.5 8 8 8zM12 14c0-4 3-7 8-7 0 4.5-3.5 7-8 7z"/>',
  'window-cleaner': '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/><path d="M7 7.5 9 6M15 16.5l2-1.5"/>',
  'gutter-cleaning': '<path d="M3 11 12 4l9 7"/><path d="M2 11h20v2.5H2z"/><path d="M19 13.5V20"/><path d="M6 13.5V20h9v-6.5"/>',
  removals: '<path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8"/><circle cx="6" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  roofer: '<path d="M2 12 12 4l10 8"/><path d="M5 10v10h14V10"/><path d="M8 13h8M8 16.5h8"/>',
  builder: '<path d="M4 15a8 8 0 0 1 16 0"/><path d="M2 15h20v3H2z"/><path d="M10 7.3V5h4v2.3"/>',
};

export const icon = (name, size) => svg(paths[name] ?? paths.tag, size);

/** Simplified store glyphs for the download buttons. */
export const storeGlyph = {
  apple:
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z"/></svg>',
  play:
    '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#34A853" d="M3.6 2.2 13.4 12l-9.8 9.8c-.4-.2-.6-.7-.6-1.2V3.4c0-.5.2-1 .6-1.2z"/><path fill="#FBBC04" d="m17 8.4-3.6 3.6L17 15.6l4-2.3c1.1-.6 1.1-2.2 0-2.8z"/><path fill="#4285F4" d="M3.6 21.8 13.4 12l3.6 3.6-11.5 6.6c-.7.4-1.4.2-1.9-.4z"/><path fill="#EA4335" d="M3.6 2.2c.5-.6 1.2-.8 1.9-.4L17 8.4 13.4 12z"/></svg>',
};
