// The Fixmet "refined F": two leaf-shaped strokes with one clean cut where
// they meet. The cut is a mask, so it works on any background colour.

const TOP =
  'M20 80V26C20 16 27 10 38 10H84C86 10 87.2 12 86.2 14C82 26 74 32 62 32H42C37 32 34 35 34 40V80Z';
const LOWER =
  'M20 84V66C20 52 30 44 44 44H80C82 44 83.2 46 82.2 48C78 60 70 66 58 66H40C36.5 66 34 68.5 34 72V84C34 88 31 91 27 91S20 88 20 84Z';

let n = 0;

/**
 * The mark as inline SVG.
 * variant: 'colour' (teal + dark teal) or 'white' (for dark backgrounds).
 * The gap gets wider at small sizes so the cut never disappears.
 */
export function markSvg({ size = 40, variant = 'colour', title = 'Fixmet' } = {}) {
  const id = `fm${++n}`;
  const gap = size <= 24 ? 9 : size <= 48 ? 7 : 5;
  const top = variant === 'white' ? '#fff' : '#0E7C7B';
  const lower = variant === 'white' ? '#fff' : '#0B4F55';
  return `<svg class="fm-mark" width="${size}" height="${size}" viewBox="8 4 84 92" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg"><defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><path d="${LOWER}" fill="#000" stroke="#000" stroke-width="${gap}" stroke-linejoin="round"/></mask></defs><path d="${TOP}" fill="${top}" mask="url(#${id})"/><path d="${LOWER}" fill="${lower}"/></svg>`;
}

/** Mark + "Fixmet" wordmark (Sora Bold, "Fix" dark, "met" teal). */
export function lockup({ size = 34, variant = 'colour' } = {}) {
  return `<span class="fm-lockup fm-lockup--${variant}">${markSvg({ size, variant, title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}<span class="fm-word"><span class="fm-fix">Fix</span><span class="fm-met">met</span></span></span>`;
}

/** Standalone files: logo mark, white mark, and app-icon style favicon. */
export function logoFiles() {
  return {
    'assets/fixmet-mark.svg': markSvg({ size: 512 }),
    'assets/fixmet-mark-white.svg': markSvg({ size: 512, variant: 'white' }),
    'assets/favicon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#0E7C7B"/><svg x="10" y="9" width="44" height="46" viewBox="8 4 84 92"><defs><mask id="c"><rect width="100" height="100" fill="#fff"/><path d="${LOWER}" fill="#000" stroke="#000" stroke-width="9" stroke-linejoin="round"/></mask></defs><path d="${TOP}" fill="#fff" mask="url(#c)"/><path d="${LOWER}" fill="#fff"/></svg></svg>`,
  };
}
