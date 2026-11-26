// Builds the static Fixmet service pages into ./dist:
//   /services/                 every trade
//   /areas/                    every town
//   /{trade}/                  one trade, every town
//   /{trade}/{town}/           one trade in one town (the pages people find on Google)
//   /areas/{town}/             every trade in one town
//   sitemap-services.xml       for Google Search Console
// No dependencies: `node build.mjs`.

import { mkdirSync, rmSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, trades, towns } from './src/data.mjs';
import { lockup, logoFiles, markSvg } from './src/logo.mjs';
import { icon, storeGlyph } from './src/icons.mjs';
import { LEGAL_UPDATED, privacy, terms, cookies } from './src/legal.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const MONTH = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
// Bump when the CSS or JS changes so browsers fetch the new files.
const V = Date.now().toString(36);

// ---------- prices (same formula as the app) ----------

const round = (n) => Math.round(n);
// London and Cardiff have their own prices for each trade (from the price
// guides). Other towns use the national figures times their estimated
// price level (see towns in data.mjs) until we check them.
const cityOf = (town) => (town?.london ? 'london' : town?.slug === 'cardiff' ? 'cardiff' : null);
const area = (town, trade) => {
  const city = cityOf(town);
  if (city) return trade.guideData.cityPercent[city] / 100;
  if (town?.londonShare) {
    const london = trade.guideData.cityPercent.london / 100;
    return 1 + (london - 1) * town.londonShare;
  }
  return (town?.priceLevel ?? 100) / 100;
};
// Towns where Fixmet doesn't take bookings yet: their pages stay up for
// search, with a "Coming soon" badge and expected prices.
const isSoon = (town) => Boolean(town) && !town.live;
const soonBadge = '<span class="badge badge--amber">Coming soon</span>';
const liveTowns = () => towns.filter((t) => t.live);
const fromPrice = (trade, town) => round((trade.callout + trade.minHours * trade.rate) * area(town, trade));
// A full working day (8 hours on site) at Fixmet's rate card, plus the call-out.
const DAY_HOURS = 8;
const dayPrice = (trade, town) => round((trade.callout + DAY_HOURS * trade.rate) * area(town, trade));

// Price guides: the same ranges the app's pricing model keeps quotes inside.
const priceGuides = JSON.parse(readFileSync(join(root, 'src/price-guides.json'), 'utf8'));
for (const trade of trades) {
  trade.guideData = priceGuides.guides.find((g) => g.categoryIds.includes(trade.guide));
  if (!trade.guideData) throw new Error(`No price guide for ${trade.slug} (${trade.guide})`);
  // Jobs priced per job (not per m² or per hour) feed the cards and schema.
  trade.jobs = trade.guideData.jobs.filter((j) => !j.unit);
}
// Small prices (per m²) keep their pence; job prices round to whole pounds.
const money = (v) => (v < 20 ? Math.round(v * 100) / 100 : round(v));
// A job's range for the town: its own London or Cardiff range when it has
// one, otherwise the national range times the trade's city percent (the
// same rule the app's pricing model uses).
const jobRange = (trade, job, town) => {
  const own = job.cities?.[cityOf(town)];
  const f = own ? 1 : area(town, trade);
  const from = own ?? job;
  return { low: money(from.low * f), typical: money(from.typical * f), high: money(from.high * f) };
};
const jobPrice = (trade, job, town) => jobRange(trade, job, town).typical;
// How a town's prices compare with the rest of the UK for this trade.
const cityNote = (trade, town) => {
  const city = cityOf(town);
  if (!city) {
    if (!isSoon(town)) return '';
    const level = Math.round(area(town, trade) * 100) - 100;
    const vs = Math.abs(level) < 3 ? 'about the same as the UK average' : `about ${Math.abs(level)}% ${level > 0 ? 'above' : 'below'} the UK average`;
    return ` These are expected ${town.name} prices, ${vs}. We check them against local firms before we open in ${town.name}.`;
  }
  const pct = trade.guideData.cityPercent[city] - 100;
  const name = city === 'london' ? 'London' : 'Cardiff';
  if (Math.abs(pct) < 3) return ` ${name} prices are about the same as elsewhere in the UK.`;
  return ` ${name} ${trade.service} prices are about ${Math.abs(pct)}% ${pct > 0 ? 'higher' : 'lower'} than elsewhere in the UK, in line with local firms.`;
};
const gbp = (n) => `£${n.toLocaleString('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })}`;
const GUIDES_MONTH = new Date(`${priceGuides.updated}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const hours = (h) => (h === 1 ? '1 hour' : `${h} hours`);
const instantExtra = site.instantPercent - 100;

// ---------- helpers ----------

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const url = (path) => `${site.baseUrl}${path}`;
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const who = (trade) => trade.person ?? lower(trade.name);
const an = (word) => (/^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`);
const townBySlug = Object.fromEntries(towns.map((t) => [t.slug, t]));
const reveal = (i = 0) => ` data-reveal${i ? ` style="--i:${i}"` : ''}`;

function write(path, html) {
  const file = join(out, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, path.endsWith('.html') ? hideEmails(html) : html);
}

/**
 * Keeps our email address out of the page source so address-collecting bots
 * can't read it. Links point to the contact page and text reads
 * "info [at] fixmet.co.uk"; the page script (src/client.js, "Email links")
 * turns them back into normal mailto links for people.
 */
function hideEmails(html) {
  const email = site.supportEmail;
  const reversed = email.split('').reverse().join('');
  const shown = email.replace('@', ' [at] ');
  const quoted = email.replace(/\./g, '\\.');
  const linkPattern = new RegExp('href="mailto:' + quoted + '(?:\\?subject=([^"]*))?"', 'g');
  const textPattern = new RegExp(quoted, 'g');
  // Structured data (JSON-LD) is JSON, not HTML: a <span> with quotes would
  // break it for Google, so there the address is only written as plain text.
  const jsonLd = /(<script[^>]*application\/ld\+json[^>]*>)([\s\S]*?)(<\/script>)/g;
  const result = html
    .replace(linkPattern, (_, subject) =>
      'href="/contact/" data-e="' + reversed + '"' + (subject ? ' data-s="' + subject + '"' : ''),
    )
    .split(jsonLd)
    .map((part, i) =>
      // split() with 3 groups gives [html, open, json, close, html, ...].
      i % 4 === 2
        ? part.replace(textPattern, shown)
        : i % 4 === 0
          ? part.replace(
              textPattern,
              '<span class="js-email" data-e="' + reversed + '">' + shown + '</span>',
            )
          : part,
    )
    .join('');
  if (result.includes(email)) throw new Error('hideEmails: email still in page');
  return result;
}

// ---------- shared pieces ----------

const organization = {
  '@type': 'Organization',
  '@id': `${site.baseUrl}/#organization`,
  name: 'Fixmet',
  url: site.baseUrl,
  logo: { '@type': 'ImageObject', url: url('/assets/fixmet-logo.png'), width: 512, height: 512 },
  legalName: site.company.legalName,
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.company.street,
    addressLocality: site.company.city,
    postalCode: site.company.postcode,
    addressCountry: 'GB',
  },
  sameAs: [site.appStoreUrl, site.playStoreUrl],
};
const website = {
  '@type': 'WebSite',
  '@id': `${site.baseUrl}/#website`,
  name: 'Fixmet',
  url: site.baseUrl,
  inLanguage: 'en-GB',
  publisher: { '@id': organization['@id'] },
};

function storeButtons({ light = false } = {}) {
  const cls = light ? 'store store--light' : 'store';
  return `<a class="${cls}" href="${site.appStoreUrl}" rel="noopener">${storeGlyph.apple}<span><small>Download on the</small><b>App Store</b></span></a>
      <a class="${cls}" href="${site.playStoreUrl}" rel="noopener">${storeGlyph.play}<span><small>Get it on</small><b>Google Play</b></span></a>`;
}

const appButton = (label, cls = 'btn btn--primary') =>
  `<a class="${cls}" href="${site.appStoreUrl}" data-app-link rel="noopener">${esc(label)}${icon('arrow', 18).replace('<svg', '<svg class="i-arrow"')}</a>`;

function breadcrumbs(items) {
  const html = `<nav aria-label="Breadcrumb"><ol class="crumbs">${items
    .map((c, i) => (i === items.length - 1 ? `<li><span aria-current="page">${esc(c.name)}</span></li>` : `<li><a href="${c.path}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
  const ld = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: url(c.path) })),
  };
  return { html, ld };
}

function faqLd(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

function itemListLd(name, items) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: url(it.path) })),
  };
}

function webPageLd({ path, title, description, breadcrumb }) {
  return {
    '@type': 'WebPage',
    '@id': `${url(path)}#webpage`,
    url: url(path),
    name: title,
    description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': website['@id'] },
    dateModified: BUILD_DATE,
    breadcrumb,
    primaryImageOfPage: { '@type': 'ImageObject', url: url('/assets/fixmet-og.png'), width: 1200, height: 630 },
  };
}

// ---------- layout ----------

// A small "Coming soon" tag for town links in the menu, drawer and footer.
// (A function, not a const: towns' live flags are read at call time.)
function soonTag(town) {
  return town.live ? '' : ' <span class="soon-tag">Coming soon</span>';
}

function header() {
  const tradeLinks = trades
    .map((t) => `<a href="/${t.slug}/"><span class="ico">${icon(t.slug, 20)}</span><span>${esc(t.name)}<small>From ${gbp(fromPrice(t, null))}</small></span></a>`)
    .join('');
  const townLinks = towns.map((t) => `<a href="/areas/${t.slug}/">${esc(t.name)}${soonTag(t)}</a>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="header">
  <div class="wrap">
    <a href="/" class="brand-link" aria-label="Fixmet home">${lockup({ size: 32 })}</a>
    <nav class="nav" aria-label="Main">
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-services">Services ${icon('down', 16)}</button>
        <div class="mega" id="mega-services">${tradeLinks}<a class="mega-all" href="/services/">See all services</a></div>
      </div>
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false" aria-controls="mega-areas">Areas ${icon('down', 16)}</button>
        <div class="mega mega--areas" id="mega-areas">${townLinks}<a class="mega-all" href="/areas/">See all areas</a></div>
      </div>
      <a href="/how-it-works/">How it works</a>
      <a href="/pricing/">Pricing</a>
      <a href="/contractors/">For contractors</a>
    </nav>
    <div class="header-actions">
      <button class="search-btn" type="button" data-search aria-label="Search services and areas">${icon('search', 18)}<span>Search services or towns</span><kbd>/</kbd></button>
      ${appButton('Get a price', 'btn btn--primary btn--sm')}
      <button class="icon-btn" type="button" data-menu aria-expanded="false" aria-controls="menu" aria-label="Menu">${icon('menu', 22)}</button>
    </div>
  </div>
</header>
<div class="drawer" id="menu">
  ${appButton('Get a fixed price', 'btn btn--primary btn--block')}
  <h2>Services</h2>
  <div class="drawer-grid">${trades.map((t) => `<a href="/${t.slug}/"><span class="ico">${icon(t.slug, 18)}</span>${esc(t.name)}</a>`).join('')}</div>
  <h2>Areas</h2>
  <div class="drawer-grid">${towns.map((t) => `<a href="/areas/${t.slug}/"><span class="ico">${icon('pin', 18)}</span><span>${esc(t.name)}${soonTag(t)}</span></a>`).join('')}</div>
  <h2>Fixmet</h2>
  <div class="drawer-grid"><a href="/how-it-works/">How it works</a><a href="/pricing/">Pricing</a><a href="/contractors/">For contractors</a><a href="/help/">Help &amp; FAQs</a><a href="/about/">About us</a><a href="/contact/">Contact us</a></div>
</div>`;
}

function footer() {
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-about">
        ${lockup({ size: 32, variant: 'white' })}
        <p>Fixed prices for home jobs in about a minute. Vetted local tradespeople, and you're only charged when the job is done.</p>
        <div class="cta-row">${storeButtons({ light: true })}</div>
      </div>
      <div>
        <h2>Services</h2>
        <ul>${trades.map((t) => `<li><a href="/${t.slug}/">${esc(t.name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2>Areas</h2>
        <ul>${towns.map((t) => `<li><a href="/areas/${t.slug}/">${esc(t.name)}${soonTag(t)}</a></li>`).join('')}<li><a href="/areas/">All areas</a></li></ul>
      </div>
      <div>
        <h2>Fixmet</h2>
        <ul>
          <li><a href="/how-it-works/">How it works</a></li>
          <li><a href="/pricing/">Pricing</a></li>
          <li><a href="/contractors/">Join as a contractor</a></li>
          <li><a href="/about/">About us</a></li>
          <li><a href="/help/">Help &amp; FAQs</a></li>
          <li><a href="/contact/">Contact us</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-base">
      <span>© ${new Date().getFullYear()} ${site.company.legalName}, trading as Fixmet. Registered in England &amp; Wales No. ${site.company.number}. ${esc(site.company.address)}.</span>
      <nav aria-label="Legal"><a href="/terms/">Terms</a><a href="/privacy/">Privacy</a><a href="/cookies/">Cookies</a><a href="/delete-account/">Delete your account</a><a href="/sitemap.xml">Sitemap</a></nav>
    </div>
  </div>
</footer>`;
}

function palette() {
  return `<dialog class="palette" id="search" aria-label="Search">
  <div class="palette-top">${icon('search', 20)}<input type="search" placeholder="Search a trade, job or town, e.g. plumber Leeds" aria-label="Search" autocomplete="off" enterkeyhint="go"><button type="button" data-close>Esc</button></div>
  <ul class="palette-list" role="listbox" aria-label="Results"></ul>
</dialog>`;
}

function layout({ title, description, path, body, graph = [], mobileCta, cta, noindex = false }) {
  const ld = { '@context': 'https://schema.org', '@graph': [organization, website, ...graph] };
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url(path)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<meta name="google-site-verification" content="${site.googleVerification}">
<meta name="theme-color" content="#ffffff">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Fixmet">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url(path)}">
<meta property="og:image" content="${url('/assets/fixmet-og.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Fixmet: fixed prices for home jobs">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${url('/assets/fixmet-og.png')}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/fixmet-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap">
<link rel="stylesheet" href="/assets/fixmet-pages.css?v=${V}">
<script>document.documentElement.classList.add('js')</script>
<script src="/assets/fixmet-pages.js?v=${V}" defer></script>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body>
${header()}
<main id="main">
${body}
${cta ?? finalCta()}
</main>
${footer()}
<div class="mobile-cta">${mobileCta ?? ''}${appButton('Get a fixed price')}</div>
${palette()}
</body>
</html>
`;
}

// ---------- sections ----------

function finder({ trade, town, heading = 'Find a tradesperson' } = {}) {
  const popular = trades.slice(0, 5);
  return `<form class="finder" data-finder${trade ? ` data-trade="${trade.slug}"` : ''}${town ? ` data-town="${town.slug}"` : ''} role="search" aria-label="${esc(heading)}" action="/services/">
          <div class="finder-field">
            <label for="f-service">What do you need?</label>
            <input id="f-service" name="service" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="f-service-list" autocomplete="off" placeholder="e.g. plumber, leaking tap" value="${trade ? esc(trade.name) : ''}">
            <ul class="finder-list" id="f-service-list" role="listbox" aria-label="Services" hidden></ul>
          </div>
          <div class="finder-field">
            <label for="f-town">Where?</label>
            <input id="f-town" name="town" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="f-town-list" autocomplete="off" placeholder="Town or postcode" value="${town ? esc(town.name) : ''}">
            <ul class="finder-list" id="f-town-list" role="listbox" aria-label="Towns" hidden></ul>
          </div>
          <button class="btn btn--primary" type="submit">${icon('search', 20)}<span>Search</span></button>
        </form>
        <p class="finder-hint"><span>Popular:</span>${popular
          .map((t) => `<a href="/${t.slug}/${town ? `${town.slug}/` : ''}">${esc(t.name)}</a>`)
          .join('')}</p>`;
}

function mockCard(trade, town) {
  const job = trade.jobs[0];
  return `<div class="mock" aria-hidden="true">
        <div class="mock-card">
          <div class="mock-head">${markSvg({ size: 36, title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}<span><b>Your Fixmet price</b><small>From 3 photos</small></span><span class="badge">${trade.guidePrice ? 'Guide price' : 'Fixed price'}</span></div>
          <div class="mock-photos"><span>${icon('camera', 22)}</span><span>${icon(trade.slug, 22)}</span><span>${icon('chat', 22)}</span></div>
          <div class="mock-progress"><i></i></div>
          <div class="mock-price"><div><span>${esc(job.name)}</span><strong>${gbp(jobPrice(trade, job, town))}</strong></div></div>
          <div class="mock-meta">
            <div><span>Area</span><b>${esc(town ? town.name : 'Near you')}</b></div>
            <div><span>Contractor</span><b>${isSoon(town) ? 'Coming soon' : 'Today or a time you pick'}</b></div>
            <div><span>Charged</span><b>When the job is done</b></div>
          </div>
        </div>
        <div class="mock-toast"><span class="ico">${icon('shield', 18)}</span><span><b>Checks shown first</b><small>ID, insurance and reviews</small></span></div>
      </div>`;
}

function trustBar() {
  const items = [
    ['id', 'ID-checked contractors', 'See checks and reviews first'],
    ['tag', 'A fixed price upfront', 'Changes need your approval'],
    ['card', 'Pay when it’s done', 'Your card is only held'],
    ['shield', '7-day guarantee', 'We’ll put it right'],
  ];
  return `<section class="trustbar" aria-label="Why Fixmet">
  <div class="wrap"><ul>${items
    .map(([i, b, s], n) => `<li${reveal(n)}><span class="ico">${icon(i, 20)}</span><span><b>${b}</b>${s}</span></li>`)
    .join('')}</ul></div>
</section>`;
}

function howItWorks(trade) {
  const steps = [
    ['camera', 'Show us the job', 'Take a few photos and add a voice note or a line of text. No forms, and no waiting for call-backs.'],
    ['tag', 'Get a fixed price', `In about a minute you see a price based on typical UK ${trade ? trade.service : 'trade'} rates. Book for today or pick a time.`],
    ['route', 'Track and pay after', `Follow the ${trade ? who(trade) : 'contractor'} on the way. Your card is only held, and it's charged when the work is finished.`],
  ];
  return `<section class="section section--tint" id="how-it-works" aria-labelledby="how-h">
  <div class="wrap">
    <div class="section-head section-head--center"${reveal()}>
      <span class="eyebrow">How it works</span>
      <h2 id="how-h">A fixed price before anyone comes round</h2>
      <p class="lead">Three steps, all in the app. Most people have a price in about a minute.</p>
    </div>
    <ol class="grid-3 steps" style="list-style:none;padding:0">${steps
      .map(([i, h, p], n) => `<li class="card step"${reveal(n)}><div class="step-n">${n + 1}</div><h3>${h}</h3><p>${esc(p)}</p></li>`)
      .join('')}</ol>
  </div>
</section>`;
}

function whySection(trade) {
  const person = trade ? who(trade) : 'tradesperson';
  return `<section class="section" id="why" aria-labelledby="why-h">
  <div class="wrap">
    <div class="section-head"${reveal()}>
      <span class="eyebrow">Why Fixmet</span>
      <h2 id="why-h">Checked people, clear prices, no surprises</h2>
    </div>
    <div class="compare">
      <div class="card card--old"${reveal()}>
        <h3>Finding ${an(person)} the usual way</h3>
        <ul>
          <li>${icon('cross', 20)}Ring round and wait days for call-backs</li>
          <li>${icon('cross', 20)}Someone comes out just to give a quote</li>
          <li>${icon('cross', 20)}The price changes once the work starts</li>
          <li>${icon('cross', 20)}Pay upfront or chase an invoice</li>
        </ul>
      </div>
      <div class="card card--us"${reveal(1)}>
        <h3>With Fixmet</h3>
        <ul>
          <li>${icon('check', 20)}A fixed price from your photos in about a minute</li>
          <li>${icon('check', 20)}A local ${esc(person)} today or at a time you pick</li>
          <li>${icon('check', 20)}Any change on the day needs your approval</li>
          <li>${icon('check', 20)}Charged only when the job is done</li>
        </ul>
      </div>
    </div>
    <div class="grid-3" style="margin-top:20px">
      <div class="card"${reveal()}><span class="ico ico--lg">${icon('id', 24)}</span><h3>Vetted contractors</h3><p>Every contractor's ID is checked before they can take jobs. You see their checks, insurance, rating and reviews before they arrive.</p></div>
      <div class="card"${reveal(1)}><span class="ico ico--lg">${icon('tag', 24)}</span><h3>The price is fixed</h3><p>If the job turns out different on the day, the contractor has to ask you first. You only pay a new price if you approve it.</p></div>
      <div class="card"${reveal(2)}><span class="ico ico--lg">${icon('card', 24)}</span><h3>Pay after the work</h3><p>Nothing is charged until the job is done. Cancel for free in the first few minutes after a contractor accepts.</p></div>
    </div>
    <div class="band" style="margin-top:20px"${reveal()}>
      <span class="ico ico--lg">${icon('shield', 26)}</span>
      <div><h3 style="font-size:1.4rem;margin-bottom:8px">The Fixmet guarantee</h3><p>${esc(site.guarantee)}</p></div>
      ${appButton('Get a price', 'btn btn--light')}
      <div class="band-mark">${markSvg({ size: 260, variant: 'white', title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}</div>
    </div>
  </div>
</section>`;
}

function faqSection(faqs, heading) {
  return `<section class="section section--tint" id="faqs" aria-labelledby="faq-h">
  <div class="wrap faq-layout">
    <div class="section-head"${reveal()}>
      <span class="eyebrow">Questions</span>
      <h2 id="faq-h">${esc(heading)}</h2>
      <p class="lead">Can't find your answer? Email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a>.</p>
    </div>
    <div class="faq">${faqs
      .map(([q, a], i) => `<details${i === 0 ? ' open' : ''}${reveal(Math.min(i, 4))}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`)
      .join('')}</div>
  </div>
</section>`;
}

function finalCta() {
  return `<section class="section section--tight" id="get-app" aria-labelledby="cta-h">
  <div class="wrap">
    <div class="band cta-final"${reveal()}>
      <span class="mark-badge">${markSvg({ size: 44, title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}</span>
      <h2 id="cta-h">Get a fixed price in about a minute</h2>
      <p>Download Fixmet, take a few photos of the job and see your price straight away. No call-backs and no obligation.</p>
      <div class="cta-row" style="justify-content:center">${storeButtons({ light: true })}</div>
      <div class="band-mark">${markSvg({ size: 320, variant: 'white', title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}</div>
    </div>
  </div>
</section>`;
}

function priceTable(trade, town, id) {
  return `<div class="panel"${reveal()}>
        <div class="panel-head">
          <h3>Common ${esc(trade.service)} jobs</h3>
          <div class="toggle" data-price-toggle data-instant="${site.instantPercent}" data-target="${id}" role="group" aria-label="Booking type" hidden>
            <span class="thumb"></span>
            <button type="button" data-mode="scheduled" aria-pressed="true">Book a time</button>
            <button type="button" data-mode="instant" aria-pressed="false">${icon('bolt', 14)}Instant +${instantExtra}%</button>
          </div>
        </div>
        <table class="prices" id="${id}">
          <caption class="sr-only">${esc(trade.name)} prices${town ? ` in ${esc(town.name)}` : ''}</caption>
          <thead><tr><th scope="col">Job</th><th scope="col">Price range</th><th scope="col">Typical</th></tr></thead>
          <tbody aria-live="polite">${trade.guideData.jobs
            .map((job) => {
              const { low: lo, high: hi, typical: typ } = jobRange(trade, job, town);
              const unit = job.unit ? ` <small class="unit">${esc(job.unit)}</small>` : '';
              const range = lo === hi
                ? `<span class="price-val" data-base="${lo}">${gbp(lo)}</span>`
                : `<span class="price-val" data-base="${lo}">${gbp(lo)}</span>–<span class="price-val" data-base="${hi}">${gbp(hi)}</span>`;
              return `<tr><td>${esc(job.name)}</td><td class="range">${range}${unit}</td><td><span class="price-val" data-base="${typ}">${gbp(typ)}</span>${unit}</td></tr>`;
            })
            .join('')}</tbody>
        </table>
      </div>`;
}

function breakdown(trade, town) {
  const rate = round(trade.rate * area(town, trade));
  const callout = round(trade.callout * area(town, trade));
  return `<div class="panel breakdown"${reveal(1)}>
        <h3>How the price is worked out</h3>
        <dl>
          <div><dt>Hourly rate</dt><dd>${gbp(rate)}</dd></div>
          <div><dt>Call-out fee</dt><dd>${trade.callout ? gbp(callout) : 'None'}</dd></div>
          <div><dt>Minimum time</dt><dd>${hours(trade.minHours)}</dd></div>
          <div><dt>Full day (${DAY_HOURS} hours)</dt><dd>${gbp(dayPrice(trade, town))}</dd></div>
          <div><dt>Typical day rate${cityOf(town) ? ` in ${town.name}` : ''}</dt><dd>${gbp(round(trade.guideData.dayRate.low * area(town, trade)))}–${gbp(round(trade.guideData.dayRate.high * area(town, trade)))}</dd></div>
          <div><dt>Instant jobs</dt><dd>+${instantExtra}%</dd></div>
        </dl>
        <p class="formula">${trade.callout ? `${gbp(callout)} call-out + ` : ''}${hours(trade.minHours)} × ${gbp(rate)} = <strong>${gbp(fromPrice(trade, town))}</strong> minimum, plus any parts.</p>
      </div>`;
}

// When a job costs more because of the time it starts (UK time). The
// percentages and each trade's group come from the backend's price data.
function outOfHoursNote(g) {
  const t = priceGuides.timePricing;
  const more = (p) => `${p - 100}% more`;
  if (g.timePricingGroup === 'emergency') {
    return `Ranges are for weekdays and Saturdays, 08:00 to 18:00. Evenings (18:00 to 22:00) cost ${more(t.evening)}, Sundays ${more(t.sunday)}, and nights (22:00 to 08:00) and bank holidays ${more(t.night)}. The app shows the price for the time you pick before you book.`;
  }
  if (g.timePricingGroup === 'removals') {
    return `Moves on a Saturday or Sunday cost ${more(t.removalsWeekend)}, and nights (22:00 to 08:00) and bank holidays ${more(t.plannedNight)}. Weekday evenings are the normal price. The app shows the price for the time you pick before you book.`;
  }
  return `Evenings and weekends are the normal price. Nights (22:00 to 08:00) and bank holidays cost ${more(t.plannedNight)}. The app shows the price for the time you pick before you book.`;
}

function guideDetails(trade) {
  const g = trade.guideData;
  return `<div class="guide-grid">
      <div class="card"${reveal()}><h3>${icon('check', 20)} What's included</h3><p>${esc(g.included)}</p></div>
      <div class="card"${reveal(1)}><h3>Not included</h3><p>${esc(g.notIncluded)}</p></div>
      <div class="card"${reveal(2)}><h3>What can raise the price</h3><ul class="raisers">${[{ label: priceGuides.urgentRaiser.label }, ...g.raisers].map((r) => `<li>${esc(r.label)}</li>`).join('')}</ul></div>
    </div>
    <p class="note">${esc(outOfHoursNote(g))}</p>
    <p class="note">${esc(g.rates)} Ranges are checked against what local firms charge, and there's no VAT on top (checked ${GUIDES_MONTH}). Your price in the app always sits inside the range for your area, unless your photos show one of the reasons above; then you're told why. If the contractor finds more work on the day, they can suggest a new price, and you only pay it if you approve it in the app.</p>`;
}

function commonFaqs(trade, town) {
  const where = town ? ` in ${town.name}` : '';
  const from = fromPrice(trade, town);
  const soon = isSoon(town);
  return [
    ...(soon
      ? [[
          `Can I book ${an(who(trade))} in ${town.name} with Fixmet?`,
          `Not yet. Fixmet is live in ${liveTowns().map((t) => t.name).join(', ').replace(/, ([^,]*)$/, ' and $1')} and is coming to ${town.name} soon. The prices on this page are what we expect jobs to cost here.`,
        ]]
      : []),
    [
      `How much does ${an(who(trade))} cost${where}?`,
      `${soon ? 'Jobs are expected to start' : 'Jobs start'} from ${gbp(from)}${town?.london ? ' at London prices' : ''}. The price is worked out from ${gbp(round(trade.rate * area(town, trade)))} an hour${trade.callout ? `, a ${gbp(round(trade.callout * area(town, trade)))} call-out fee` : ''} and a minimum of ${hours(trade.minHours)}, plus parts. You see the exact fixed price in the app before you book.`,
    ],
    [
      'Is the price really fixed?',
      trade.guidePrice
        ? `${trade.name} jobs are hard to judge from photos, so the price is a guide until the contractor sees the job. If it needs to change, you're asked to approve the new price first, and you're never charged more than you agreed.`
        : `Yes. The price you book is the price you pay. If the job turns out to be different on the day, the contractor has to send you a new price to approve. If you decline, the agreed price stays.`,
    ],
    ['When do I pay?', `Your card is held when you book and only charged when the work is finished. Instant jobs cost ${instantExtra}% more than booking a time.`],
    [
      `Are your ${trade.plural} checked?`,
      `Every contractor's ID is checked before they can take jobs, and you can see their checks, insurance, rating and reviews in the app.`,
    ],
    ...trade.faqs,
  ];
}

const tradeTile = (t, town) =>
  `<a class="tile" href="/${t.slug}/${town ? `${town.slug}/` : ''}"><span class="ico">${icon(t.slug, 22)}</span><span><b>${esc(t.name)}</b><small>From <strong>${gbp(fromPrice(t, town))}</strong></small></span><span class="tile-go">${icon('chevron', 20)}</span></a>`;
const townTile = (t, trade) =>
  `<a class="tile" href="${trade ? `/${trade.slug}/${t.slug}/` : `/areas/${t.slug}/`}"><span class="ico">${icon('pin', 22)}</span><span><b>${esc(trade ? `${trade.name} in ${t.name}` : t.name)}${isSoon(t) ? ` ${soonBadge}` : ''}</b><small>${trade ? `${isSoon(t) ? 'Expected from' : 'From'} <strong>${gbp(fromPrice(trade, t))}</strong>` : esc(t.region)}</small></span><span class="tile-go">${icon('chevron', 20)}</span></a>`;

function simpleHero({ crumbs, eyebrow, h1, lead, extra = '' }) {
  return `<section class="hero">
  <div class="wrap">
    ${crumbs.html}
    <div class="hero-copy hero-copy--narrow">
      <span class="pill"><span class="dot">${icon('check', 14)}</span>${eyebrow}</span>
      <h1>${h1}</h1>
      <p class="lead">${lead}</p>
      ${extra}
    </div>
  </div>
</section>`;
}

// ---------- pages ----------

// What a coming-soon page offers instead of "book now": the live cities,
// and a way to ask for Fixmet here (which tells us where demand is).
function soonCta(trade, town) {
  const live = liveTowns();
  return `<div class="soon-cta">
          <p>Live now in ${live.map((t) => `<a href="/${trade ? `${trade.slug}/` : 'areas/'}${t.slug}/">${esc(t.name)}</a>`).join(', ').replace(/, ([^,]*)$/, ' and $1')}. <a href="/contact/">Ask us to open in ${esc(town.name)}</a>.</p>
        </div>`;
}

function tradeTownPage(trade, town) {
  const path = `/${trade.slug}/${town.slug}/`;
  const from = fromPrice(trade, town);
  const crumbs = breadcrumbs([
    { name: 'Home', path: '/' },
    { name: trade.name, path: `/${trade.slug}/` },
    { name: town.name, path },
  ]);
  const faqs = commonFaqs(trade, town);
  const soon = isSoon(town);
  const title = soon
    ? `${trade.name} in ${town.name}: prices from ${gbp(from)} (coming soon) | Fixmet`
    : `${trade.name} in ${town.name} from ${gbp(from)} | Fixmet`;
  const description = soon
    ? `Fixmet is coming to ${town.name}. See what ${an(who(trade))} is expected to cost, from ${gbp(from)}, with fixed prices from your photos and payment only when the job is done.`
    : `Book ${an(who(trade))} in ${town.name} at a fixed price from ${gbp(from)}. Send photos, get a price in about a minute and pay only when the job is done.`;
  const otherTrades = trades.filter((t) => t.slug !== trade.slug);
  const nearby = (town.near ?? []).map((s) => townBySlug[s]).filter(Boolean);

  const service = {
    '@type': 'Service',
    '@id': `${url(path)}#service`,
    name: `${trade.name} in ${town.name}`,
    serviceType: cap(trade.service),
    description,
    url: url(path),
    provider: { '@id': organization['@id'] },
    areaServed: {
      '@type': 'City',
      name: town.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: town.region },
    },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'GBP', lowPrice: Math.min(from, ...trade.jobs.map((j) => jobRange(trade, j, town).low)), highPrice: Math.max(...trade.jobs.map((j) => jobRange(trade, j, town).high)), offerCount: trade.jobs.length },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${trade.name} prices in ${town.name}`,
      itemListElement: trade.jobs.map((job) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: job.name },
        price: jobPrice(trade, job, town),
        priceCurrency: 'GBP',
      })),
    },
  };

  const body = `
<section class="hero">
  <div class="wrap">
    ${crumbs.html}
    <div class="hero-grid">
      <div class="hero-copy">
        ${soon ? `<span class="pill"><span class="dot">${icon('clock', 14)}</span>Coming soon to ${esc(town.name)}</span>` : `<span class="pill"><span class="dot">${icon('pin', 14)}</span>${esc(cap(trade.plural))} across ${esc(town.name)}</span>`}
        <h1>${esc(trade.name)} in <span class="accent">${esc(town.name)}</span> at a fixed price</h1>
        <p class="lead">${soon ? `${esc(trade.intro)} Fixmet isn't taking bookings in ${esc(town.name)} yet. Here's what jobs are expected to cost when we open, so you can compare.` : `${esc(trade.intro)} Send a few photos and get a fixed price in about a minute, then a vetted local ${esc(who(trade))} can come today or when it suits you.`}</p>
        <p class="from">${soon ? 'Expected from' : 'From'} <strong>${gbp(from)}</strong>${trade.guidePrice ? '<small>guide price, confirmed on site</small>' : `<small>${town.london ? 'London price, ' : ''}plus parts</small>`}</p>
        <div class="cta-row" data-hero-cta>${soon ? soonCta(trade, town) : storeButtons()}</div>
        <ul class="ticks"><li>${icon('check', 18)}ID-checked, reviews shown</li><li>${icon('check', 18)}Pay when the job is done</li><li>${icon('check', 18)}${esc(town.districts.slice(0, 3).join(', '))} and more</li></ul>
      </div>
      ${mockCard(trade, town)}
    </div>
  </div>
</section>

${trustBar()}

<nav class="subnav" aria-label="On this page">
  <div class="wrap">
    <ul>
      <li><a href="#prices">Prices</a></li>
      <li><a href="#how-it-works">How it works</a></li>
      <li><a href="#why">Why Fixmet</a></li>
      <li><a href="#faqs">Questions</a></li>
      <li><a href="#areas">Areas covered</a></li>
    </ul>
    ${appButton(`From ${gbp(from)} · Get a price`, 'btn btn--primary btn--sm')}
  </div>
</nav>

<section class="section" id="prices" aria-labelledby="prices-h">
  <div class="wrap">
    <div class="section-head section-head--row"${reveal()}>
      <div style="display:grid;gap:14px">
        <span class="eyebrow">${soon ? `Expected prices · ${MONTH}` : `Prices · checked ${MONTH}`}</span>
        <h2 id="prices-h">${esc(trade.name)} prices in ${esc(town.name)}</h2>
        <p class="lead">${soon ? `What common jobs are expected to cost in ${esc(town.name)}, estimated from UK trade rates. When we open here, your exact price depends on the photos you send and is fixed before you book.` : `What most people pay for common jobs${town.london ? ', at London rates' : ''}. Your exact price depends on the photos you send, sits inside these ranges and is fixed before you book.`}</p>
      </div>
    </div>
    <div class="price-layout">
      ${priceTable(trade, town, 'price-table')}
      ${breakdown(trade, town)}
    </div>
    ${guideDetails(trade)}
    <p class="note">Parts and materials are added at UK trade prices.${cityNote(trade, town)} There's no booking fee.</p>
    ${trade.guidePrice ? `<p class="callout">${icon('clock', 20)}<span>${esc(trade.name)} jobs are hard to price from photos, so these are guide prices. The contractor confirms the price when they see the job, and any change needs your approval.</span></p>` : ''}
  </div>
</section>

${howItWorks(trade)}
${whySection(trade)}
${faqSection(faqs, `${trade.name} in ${town.name}: your questions`)}

<section class="section" id="areas" aria-labelledby="areas-h">
  <div class="wrap">
    <div class="section-head"${reveal()}>
      <span class="eyebrow">Areas covered</span>
      <h2 id="areas-h">${esc(cap(trade.plural))} across ${esc(town.name)}</h2>
    </div>
    <div class="links-grid">
      <div class="card"${reveal()}>
        <h3>Neighbourhoods and postcodes</h3>
        <ul class="chips">${town.areas.map((a) => `<li><span>${esc(a)}</span></li>`).join('')}${town.districts.map((d) => `<li><span>${esc(d)}</span></li>`).join('')}</ul>
      </div>
      <div class="card"${reveal(1)}>
        <h3>${esc(cap(trade.plural))} nearby</h3>
        <ul class="chips">${nearby.map((t) => `<li><a href="/${trade.slug}/${t.slug}/">${icon('pin', 15)}${esc(trade.name)} in ${esc(t.name)}${isSoon(t) ? ' (soon)' : ''}</a></li>`).join('')}<li><a href="/${trade.slug}/">${esc(trade.name)}: all areas</a></li></ul>
      </div>
    </div>
    <h3 style="margin:40px 0 16px"${reveal()}>Other services in ${esc(town.name)}</h3>
    <div class="tiles">${otherTrades.map((t) => tradeTile(t, town)).join('')}</div>
  </div>
</section>`;

  write(
    `${trade.slug}/${town.slug}/index.html`,
    layout({
      title,
      description,
      path,
      body,
      // A coming-soon town has no Service or Offer markup: we don't sell
      // there yet, and the prices are estimates.
      graph: soon
        ? [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), faqLd(faqs)]
        : [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), service, faqLd(faqs)],
      mobileCta: `<span class="mobile-cta-price">${soon ? 'Expected from' : 'From'}<b>${gbp(from)}</b></span>`,
    }),
  );
  return path;
}

function tradeHubPage(trade) {
  const path = `/${trade.slug}/`;
  const from = fromPrice(trade, null);
  const crumbs = breadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services/' },
    { name: trade.name, path },
  ]);
  const faqs = commonFaqs(trade, null);
  const longTitle = `${trade.name} near you from ${gbp(from)} | Fixed prices | Fixmet`;
  const title = longTitle.length <= 60 ? longTitle : `${trade.name} near you from ${gbp(from)} | Fixmet`;
  const description = `Book ${an(who(trade))} near you at a fixed price from ${gbp(from)}. Get a price from your photos in about a minute and pay only when the job is done.`;
  const body = `
<section class="hero">
  <div class="wrap">
    ${crumbs.html}
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="pill"><span class="dot">${icon(trade.slug, 14)}</span>${esc(trade.name)}</span>
        <h1>Book ${esc(an(who(trade)))} at a <span class="accent">fixed price</span></h1>
        <p class="lead">${esc(trade.intro)} Get a fixed price from your photos in about a minute.</p>
        <div data-hero-cta>${finder({ trade, heading: `Find ${an(who(trade))}` })}</div>
        <p class="from">From <strong>${gbp(from)}</strong><small>${trade.guidePrice ? 'guide price' : 'outside London, plus parts'}</small></p>
      </div>
      ${mockCard(trade, null)}
    </div>
  </div>
</section>
${trustBar()}
<section class="section" id="areas" aria-labelledby="towns-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Areas</span><h2 id="towns-h">${esc(cap(trade.plural))} by town</h2><p class="lead">Choose your town to see local prices and the areas covered.</p></div>
    <div class="tiles">${towns.map((t) => townTile(t, trade)).join('')}</div>
  </div>
</section>
<section class="section section--tint" id="prices" aria-labelledby="prices-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Prices · checked ${MONTH}</span><h2 id="prices-h">${esc(trade.name)} prices</h2><p class="lead">What most people pay outside London and Cardiff.${cityNote(trade, towns.find((t) => t.slug === 'london'))} Choose your town for local prices.</p></div>
    <div class="price-layout">${priceTable(trade, null, 'price-table')}${breakdown(trade, null)}</div>
    ${guideDetails(trade)}
  </div>
</section>
${howItWorks(trade)}
${whySection(trade)}
${faqSection(faqs, `${trade.name}: your questions`)}`;
  write(
    `${trade.slug}/index.html`,
    layout({
      title,
      description,
      path,
      body,
      graph: [
        webPageLd({ path, title, description, breadcrumb: crumbs.ld }),
        itemListLd(`${trade.name} by town`, towns.map((t) => ({ name: `${trade.name} in ${t.name}`, path: `/${trade.slug}/${t.slug}/` }))),
        faqLd(faqs),
      ],
      mobileCta: `<span class="mobile-cta-price">From<b>${gbp(from)}</b></span>`,
    }),
  );
  return path;
}

function townHubPage(town) {
  const path = `/areas/${town.slug}/`;
  const crumbs = breadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Areas', path: '/areas/' },
    { name: town.name, path },
  ]);
  const soon = isSoon(town);
  const title = soon
    ? `Tradespeople in ${town.name}: expected prices (coming soon) | Fixmet`
    : `Tradespeople in ${town.name} at fixed prices | Fixmet`;
  const description = soon
    ? `Fixmet is coming to ${town.name}. See expected prices for plumbers, electricians, cleaners, handymen and more, with fixed prices from your photos.`
    : `Plumbers, electricians, cleaners, handymen and more in ${town.name}. Get a fixed price from your photos in about a minute and pay when the job is done.`;
  const nearby = (town.near ?? []).map((s) => townBySlug[s]).filter(Boolean);
  const body = `
${simpleHero({
  crumbs,
  eyebrow: soon ? `${esc(town.region)} · coming soon` : esc(town.region),
  h1: `Home services in <span class="accent">${esc(town.name)}</span>`,
  lead: soon
    ? `Fixmet is coming to ${esc(town.areas.slice(0, 4).join(', '))} and the rest of ${esc(town.name)}. Until then, see what each service is expected to cost.`
    : `Vetted local tradespeople across ${esc(town.areas.slice(0, 4).join(', '))} and the rest of ${esc(town.name)}. A fixed price from your photos in about a minute.`,
  extra: soon
    ? soonCta(null, town)
    : `<div data-hero-cta>${finder({ town, heading: `Find a tradesperson in ${town.name}` })}</div>`,
})}
${trustBar()}
<section class="section" id="services" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Services in ${esc(town.name)}</span><h2 id="svc-h">What do you need done?</h2></div>
    <div class="tiles">${trades.map((t) => tradeTile(t, town)).join('')}</div>
    <div class="links-grid" style="margin-top:40px">
      <div class="card"${reveal()}><h3>Neighbourhoods and postcodes</h3><ul class="chips">${town.areas.map((a) => `<li><span>${esc(a)}</span></li>`).join('')}${town.districts.map((d) => `<li><span>${esc(d)}</span></li>`).join('')}</ul></div>
      <div class="card"${reveal(1)}><h3>Nearby areas</h3><ul class="chips">${nearby.map((t) => `<li><a href="/areas/${t.slug}/">${icon('pin', 15)}${esc(t.name)}${isSoon(t) ? ' (soon)' : ''}</a></li>`).join('')}<li><a href="/areas/">All areas</a></li></ul></div>
    </div>
  </div>
</section>
${howItWorks(null)}
${whySection(null)}`;
  write(
    `areas/${town.slug}/index.html`,
    layout({
      title,
      description,
      path,
      body,
      graph: [
        webPageLd({ path, title, description, breadcrumb: crumbs.ld }),
        itemListLd(`Services in ${town.name}`, trades.map((t) => ({ name: `${t.name} in ${town.name}`, path: `/${t.slug}/${town.slug}/` }))),
      ],
    }),
  );
  return path;
}

function areasPage() {
  const path = '/areas/';
  const crumbs = breadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Areas', path },
  ]);
  const title = 'Areas we cover | Tradespeople at fixed prices | Fixmet';
  const live = liveTowns();
  const soon = towns.filter(isSoon);
  const description = `Fixmet tradespeople in ${live.map((t) => t.name).join(', ')}, and coming soon to ${soon.slice(0, 3).map((t) => t.name).join(', ')} and more. Find your town and see local prices.`;
  const body = `
${simpleHero({
  crumbs,
  eyebrow: `Live in ${live.length}, coming to ${soon.length} more`,
  h1: `Tradespeople <span class="accent">near you</span>`,
  lead: 'Find your town to see local prices for every service, or search by postcode.',
  extra: `<div data-hero-cta>${finder({ heading: 'Find a tradesperson near you' })}</div>`,
})}
<section class="section" aria-labelledby="towns-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Book now</span><h2 id="towns-h">Live now</h2></div>
    <div class="tiles">${live.map((t) => townTile(t)).join('')}</div>
    <div class="section-head" style="margin-top:48px"${reveal()}><span class="eyebrow">Coming soon</span><h2>Coming soon</h2><p class="lead">See what jobs are expected to cost before we open. <a href="/contact/">Tell us where you'd like Fixmet next</a>.</p></div>
    <div class="tiles">${soon.map((t) => townTile(t)).join('')}</div>
  </div>
</section>
${howItWorks(null)}`;
  write(
    'areas/index.html',
    layout({
      title,
      description,
      path,
      body,
      graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), itemListLd('Areas', towns.map((t) => ({ name: t.name, path: `/areas/${t.slug}/` })))],
    }),
  );
  return path;
}

function servicesPage() {
  const path = '/services/';
  const crumbs = breadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Services', path },
  ]);
  const title = 'Home services at fixed prices | Plumbers, electricians | Fixmet';
  const description =
    'Fixed prices for plumbing, electrical work, cleaning, handyman jobs and more. Get a price from your photos in about a minute and pay when the job is done.';
  const body = `
${simpleHero({
  crumbs,
  eyebrow: `${trades.length} services, one app`,
  h1: `Every home job, <span class="accent">one fixed price</span>`,
  lead: 'Pick a service, send a few photos and get a fixed price in about a minute.',
  extra: `<div data-hero-cta>${finder({ heading: 'Find a service' })}</div>`,
})}
${trustBar()}
<section class="section" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Services</span><h2 id="svc-h">What do you need done?</h2></div>
    <div class="tiles">${trades.map((t) => tradeTile(t)).join('')}</div>
    <div class="section-head" style="margin-top:72px"${reveal()}><span class="eyebrow">Areas</span><h2>Towns and cities</h2></div>
    <div class="tiles">${towns.map((t) => townTile(t)).join('')}</div>
  </div>
</section>
${howItWorks(null)}
${whySection(null)}`;
  write(
    'services/index.html',
    layout({
      title,
      description,
      path,
      body,
      graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), itemListLd('Services', trades.map((t) => ({ name: t.name, path: `/${t.slug}/` })))],
    }),
  );
  return path;
}

// ---------- site pages (home, company, help, legal) ----------

function contractorStoreButtons({ light = false } = {}) {
  const cls = light ? 'store store--light' : 'store';
  return `<a class="${cls}" href="${site.contractorAppStoreUrl}" rel="noopener">${storeGlyph.apple}<span><small>Download on the</small><b>App Store</b></span></a>
      <a class="${cls}" href="${site.contractorPlayStoreUrl}" rel="noopener">${storeGlyph.play}<span><small>Get it on</small><b>Google Play</b></span></a>`;
}

const generalFaqs = [
  ['How does Fixmet work out the price?', `Each trade has a rate card: an hourly rate, a call-out fee and a minimum time. When you send photos and a description, our system estimates the hours and parts, and the rate card turns that into a fixed price. That price is then checked against a price guide of typical UK prices for the job, so it's never below or above the usual range unless your photos show a clear reason, which you're told. Instant jobs cost ${instantExtra}% more than booking a time. London and Cardiff prices follow what local firms charge for each trade.`],
  ['When am I charged?', 'Your card is held when you book and only charged the final price after the job is finished. If the contractor needs to change the price on the day, you have to approve it first.'],
  ['Are the tradespeople checked?', 'Yes. Every contractor\'s ID is checked before they can take jobs, and we ask for a DBS check and insurance. You can see their checks, rating and reviews in the app before they arrive.'],
  ['Can someone come today?', 'Choose "As soon as possible" and we offer your job to available tradespeople near you straight away. You can also pick a time that suits you.'],
  ['What if I need to cancel?', 'Cancelling is free until a contractor accepts and for 3 minutes after. After that a small fee applies, most of which goes to the contractor who set off.'],
  ['Do you do gas work?', 'No. By law, work on gas appliances and pipes must be done by a Gas Safe registered engineer, so Fixmet does not offer it.'],
];

function homePage() {
  const path = '/';
  const title = 'Fixmet | Fixed-price plumbers, electricians and more, near you';
  const description = 'Send a photo, get a fixed price in about a minute and book a vetted local tradesperson: plumbers, electricians, cleaners and more. Pay when it\'s done.';
  const plumber = trades.find((t) => t.slug === 'plumber') ?? trades[0];
  const examples = [
    ['plumber', 0], ['electrician', 0], ['handyman', 4], ['cleaner', 0],
  ].map(([slug, i]) => {
    const t = trades.find((x) => x.slug === slug);
    return t ? { t, job: t.jobs[i] ?? t.jobs[0] } : null;
  }).filter(Boolean);
  const body = `
<section class="hero hero--home">
  <div class="wrap">
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="pill"><span class="dot">${icon('check', 14)}</span>Vetted local tradespeople across the UK</span>
        <h1>Home jobs done, at a <span class="accent">fixed price</span></h1>
        <p class="lead">Snap a photo of the job and get a fixed price in about a minute. A checked, local tradesperson comes today or when it suits you, and you only pay when it's done.</p>
        <div data-hero-cta>${finder({ heading: 'Find a tradesperson' })}</div>
        <div class="cta-row">${storeButtons()}</div>
      </div>
      ${mockCard(plumber, null)}
    </div>
  </div>
</section>
${trustBar()}
<section class="section" id="services" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="section-head section-head--row"${reveal()}>
      <div style="display:grid;gap:14px"><span class="eyebrow">Services</span><h2 id="svc-h">What do you need done?</h2><p class="lead">${trades.length} trades, one app. Tap a service to see local prices.</p></div>
      <a class="btn btn--outline btn--sm" href="/services/">All services ${icon('arrow', 16).replace('<svg', '<svg class="i-arrow"')}</a>
    </div>
    <div class="tiles">${trades.map((t) => tradeTile(t)).join('')}</div>
  </div>
</section>
${howItWorks(null)}
<section class="section" id="prices" aria-labelledby="prices-h">
  <div class="wrap">
    <div class="section-head section-head--row"${reveal()}>
      <div style="display:grid;gap:14px"><span class="eyebrow">Clear prices</span><h2 id="prices-h">Know the price before anyone comes round</h2><p class="lead">Typical prices outside London, booked for a time that suits you. Your exact price is fixed before you book.</p></div>
      <a class="btn btn--outline btn--sm" href="/pricing/">How pricing works ${icon('arrow', 16).replace('<svg', '<svg class="i-arrow"')}</a>
    </div>
    <div class="grid-4">${examples.map(({ t, job }, i) => `<a class="card price-card" href="/${t.slug}/"${reveal(i)}><span class="ico ico--lg">${icon(t.slug, 24)}</span><span class="muted">${esc(t.name)}</span><h3>${esc(job.name)}</h3><p class="price-card-price">${gbp(jobPrice(t, job, null))}</p></a>`).join('')}</div>
  </div>
</section>
${whySection(null)}
<section class="section section--tint" id="areas" aria-labelledby="areas-h">
  <div class="wrap">
    <div class="section-head section-head--row"${reveal()}>
      <div style="display:grid;gap:14px"><span class="eyebrow">Areas</span><h2 id="areas-h">Tradespeople near you</h2></div>
      <a class="btn btn--outline btn--sm" href="/areas/">All areas ${icon('arrow', 16).replace('<svg', '<svg class="i-arrow"')}</a>
    </div>
    <div class="tiles">${towns.map((t) => townTile(t)).join('')}</div>
  </div>
</section>
<section class="section" id="contractors" aria-labelledby="pro-h">
  <div class="wrap">
    <div class="band band--split"${reveal()}>
      <div style="display:grid;gap:14px">
        <span class="eyebrow eyebrow--light">For tradespeople</span>
        <h2 id="pro-h">Get local jobs sent straight to your phone</h2>
        <p>Choose your trade, your area and your hours. Accept the jobs you want, see the pay before you go, and get paid to your bank after each job.</p>
        <div class="cta-row">${contractorStoreButtons({ light: true })}</div>
        <a class="btn btn--outline-light btn--sm" href="/contractors/" style="width:fit-content">How it works for contractors ${icon('arrow', 16).replace('<svg', '<svg class="i-arrow"')}</a>
      </div>
      <ul class="band-list">
        <li>${icon('pin', 20)}<span><b>Jobs near you</b>Offers within your chosen area</span></li>
        <li>${icon('tag', 20)}<span><b>Pay shown upfront</b>Know what you'll earn before you accept</span></li>
        <li>${icon('card', 20)}<span><b>Paid after every job</b>Straight to your bank through Stripe</span></li>
        <li>${icon('star', 20)}<span><b>Build your reputation</b>Ratings and reviews from real customers</span></li>
      </ul>
      <div class="band-mark">${markSvg({ size: 300, variant: 'white', title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}</div>
    </div>
  </div>
</section>
${faqSection(generalFaqs, 'Common questions')}`;
  write('index.html', layout({
    title, description, path, body,
    graph: [webPageLd({ path, title, description, breadcrumb: undefined }), faqLd(generalFaqs), itemListLd('Services', trades.map((t) => ({ name: t.name, path: `/${t.slug}/` })))],
  }));
  return path;
}

function pageHero({ crumbs, eyebrow, h1, lead, extra = '' }) {
  return simpleHero({ crumbs, eyebrow, h1, lead, extra });
}

function howItWorksPage() {
  const path = '/how-it-works/';
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'How it works', path }]);
  const title = 'How Fixmet works | Fixed prices for home jobs';
  const description = 'How Fixmet works: send a photo, get a fixed price in about a minute, book a vetted tradesperson, track them on the way and pay only when the job is done.';
  const steps = [
    ['camera', 'Show us the job', 'Choose a service, then add a few photos, a voice note or a line of text. Tell us where the job is and whether you need someone now or at a time you pick.'],
    ['tag', 'Get a fixed price', 'In about a minute you see a price worked out from typical UK rates for that trade. Some big jobs, like roofing, show a guide price that the contractor confirms on site.'],
    ['card', 'Book, and your card is held', 'Nothing is taken yet. Your card is only held. For instant jobs you agree that work can start straight away.'],
    ['id', 'A vetted local pro accepts', 'We offer your job to checked tradespeople nearby, closest and best-rated first. You see who is coming, with their checks, rating and reviews.'],
    ['route', 'Track them and chat', 'Follow them on the map as they travel to you, and message them in the app. If the job turns out different on the day, they must ask you to approve any new price.'],
    ['check', 'Pay when it\'s done', 'When the work is finished you confirm it and your card is charged the final price. Then rate your tradesperson. If something isn\'t right, our 7-day guarantee has you covered.'],
  ];
  const body = `
${pageHero({ crumbs, eyebrow: 'How it works', h1: 'From photo to <span class="accent">fixed</span> in six steps', lead: 'No ringing round, no waiting for quotes and no surprise bills. Here is exactly what happens when you book with Fixmet.', extra: `<div class="cta-row" data-hero-cta>${storeButtons()}</div>` })}
<section class="section" aria-label="Steps">
  <div class="wrap">
    <ol class="timeline">${steps.map(([i, h, p], n) => `<li${reveal(n % 3)}><span class="timeline-n">${n + 1}</span><div class="card"><span class="ico ico--lg">${icon(i, 24)}</span><h2 class="h3">${h}</h2><p>${esc(p)}</p></div></li>`).join('')}</ol>
  </div>
</section>
${whySection(null)}
${faqSection(generalFaqs, 'Questions about booking')}`;
  write('how-it-works/index.html', layout({ title, description, path, body, graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld, faqLd(generalFaqs), {
    '@type': 'HowTo', name: 'How to book a tradesperson with Fixmet', step: steps.map(([, h, p], n) => ({ '@type': 'HowToStep', position: n + 1, name: h, text: p })),
  }] }));
  return path;
}

function pricingPage() {
  const path = '/pricing/';
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Pricing', path }]);
  const title = 'Fixmet pricing | Hourly rates, call-out fees and how prices work';
  const description = 'See how Fixmet prices home jobs: hourly rates, call-out fees and minimum times for every trade, plus instant and London prices. No booking fees.';
  const body = `
${pageHero({ crumbs, eyebrow: 'Pricing', h1: 'Clear prices, <span class="accent">worked out the same way</span> every time', lead: 'Our system estimates the work from your photos. A fixed rate card turns that into your price, so the same job always costs the same.' })}
<section class="section" aria-labelledby="rates-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Rate card · checked ${MONTH}</span><h2 id="rates-h">Rates for every trade</h2><p class="lead">Outside London, booked for a time that suits you. Parts and materials are added at UK trade prices.</p></div>
    <div class="panel"${reveal()}>
      <table class="prices">
        <caption class="sr-only">Fixmet rate card</caption>
        <thead><tr><th scope="col">Trade</th><th scope="col">Per hour</th><th scope="col">Call-out</th><th scope="col">Minimum</th><th scope="col">Full day</th><th scope="col">From</th></tr></thead>
        <tbody>${trades.map((t) => `<tr><td><a href="/${t.slug}/">${esc(t.name)}</a>${t.guidePrice ? '<span class="tag">Guide price</span>' : ''}</td><td>${gbp(t.rate)}</td><td>${t.callout ? gbp(t.callout) : 'None'}</td><td>${hours(t.minHours)}</td><td>${gbp(dayPrice(t, null))}</td><td><span class="price-val">${gbp(fromPrice(t, null))}</span></td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>
<section class="section section--tint" aria-labelledby="calc-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">The formula</span><h2 id="calc-h">How your price is worked out</h2></div>
    <div class="grid-3">
      <div class="card"${reveal()}><span class="ico ico--lg">${icon('clock', 24)}</span><h3>Time × hourly rate</h3><p>We estimate the hours from your photos and description. You never pay for less than the trade's minimum time.</p></div>
      <div class="card"${reveal(1)}><span class="ico ico--lg">${icon('route', 24)}</span><h3>Plus call-out and parts</h3><p>Some trades add a call-out fee for travel and set-up. Parts are added at UK trade prices.</p></div>
      <div class="card"${reveal(2)}><span class="ico ico--lg">${icon('bolt', 24)}</span><h3>Instant and London</h3><p>Instant jobs cost ${instantExtra}% more than booking a time. London and Cardiff have their own prices for each trade, checked against local firms.</p></div>
    </div>
    <p class="formula" style="margin-top:20px"${reveal()}>${(() => { const t = trades.find((x) => x.guide === 'plumbing'); const london = towns.find((x) => x.slug === 'london'); const base = fromPrice(t, null); return `Example: a leak fixed outside London, booked for a time: ${gbp(t.callout)} call-out + ${hours(t.minHours)} × ${gbp(t.rate)} = <strong>${gbp(base)}</strong>. As an instant job: <strong>${gbp(round((base * site.instantPercent) / 100))}</strong>. In London, instant: <strong>${gbp(round((fromPrice(t, london) * site.instantPercent) / 100))}</strong>.`; })()}</p>
    <div class="card" style="margin-top:20px"${reveal()}><h3>${icon('shield', 20)} Checked against a price guide</h3><p>Every price is then checked against a price guide of what UK customers typically pay for that job (for example, fixing a leak: ${(() => { const t = trades.find((x) => x.guide === 'plumbing'); const j = t.guideData.jobs.find((x) => x.key === 'fix-leak'); const r = jobRange(t, j, null); return `${gbp(r.low)}–${gbp(r.high)}`; })()} outside London and Cardiff). Your price never goes below the range, and only goes above it when your photos show a clear reason, such as hidden pipework or an emergency call-out, which the app tells you. Each trade's page shows its full price guide, what's included and what can raise the price.</p></div>
  </div>
</section>
<section class="section" aria-labelledby="pay-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Paying</span><h2 id="pay-h">When and how you pay</h2></div>
    <div class="grid-3">
      <div class="card"${reveal()}><span class="ico ico--lg">${icon('card', 24)}</span><h3>Card held, not charged</h3><p>When you book, an amount a little above the price is held on your card, so an approved change on the day doesn't need your card again.</p></div>
      <div class="card"${reveal(1)}><span class="ico ico--lg">${icon('tag', 24)}</span><h3>Changes need your OK</h3><p>If the job is bigger than it looked, the contractor sends you a new price with a reason. Nothing changes unless you approve it.</p></div>
      <div class="card"${reveal(2)}><span class="ico ico--lg">${icon('check', 24)}</span><h3>Charged when it's done</h3><p>You're charged the final price after the job is finished. The rest of the hold is released. There's no booking fee.</p></div>
    </div>
  </div>
</section>
${faqSection([
    ['Why do some trades show a guide price?', 'Roofing and building jobs are hard to judge from photos, so the price is a guide until the contractor sees the job. Any change still needs your approval.'],
    ['Is there a booking fee?', 'No. The price you see includes everything except parts, which are added at UK trade prices and shown in your price.'],
    ['What does cancelling cost?', 'Free until a contractor accepts and for 3 minutes after. After that, 10% of the price (at least £5) until work starts.'],
    ['Do prices change?', 'We review our rates against UK market prices. The price you book is the price you pay, unless you approve a change on the day.'],
  ], 'Pricing questions')}`;
  write('pricing/index.html', layout({ title, description, path, body, graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld] }));
  return path;
}

function contractorsPage() {
  const path = '/contractors/';
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'For contractors', path }]);
  const title = 'Join Fixmet as a contractor | Local jobs sent to your phone';
  const description = 'Plumbers, electricians, cleaners, handymen and more: join Fixmet to get local jobs sent to your phone, see the pay upfront and get paid after every job.';
  const faqs = [
    ['What do I need to join?', 'Photo ID, a DBS check, public liability insurance and, for some trades, your trade certificates. We check these before you can take jobs.'],
    ['How do jobs reach me?', 'Switch online in the Fixmet Contractors app. When a job near you comes in, you get an offer with the details, photos and your pay. Accept it within the time shown, or let it pass to the next contractor.'],
    ['How much does Fixmet take?', 'Fixmet keeps a commission on each job, usually 15–20% depending on the trade. You see exactly what you\'ll earn before you accept.'],
    ['When do I get paid?', 'After the customer confirms the job is done, or 24 hours after you finish if they don\'t respond. Money goes to your bank through Stripe Connect.'],
    ['What if the job is bigger than expected?', 'Send the customer a new price with a reason from the app. If they decline, do the job at the agreed price or cancel without a penalty.'],
    ['Can I choose when I work?', 'Yes. Go online when you want instant jobs, and set your working hours and time off for scheduled jobs.'],
  ];
  const steps = [
    ['phone', 'Download the app', 'Get Fixmet Contractors and sign up with your trade, experience and area.'],
    ['id', 'Send your documents', 'ID, DBS check, insurance and any trade certificates. Our team checks them, usually within a few working days.'],
    ['pin', 'Choose your areas and hours', 'Pick where you work and when. Scheduled jobs are only offered in your hours.'],
    ['bolt', 'Go online and accept jobs', 'Offers arrive with photos, distance and pay. Do the work, finish in the app, get paid.'],
  ];
  const body = `
<section class="hero">
  <div class="wrap">
    ${crumbs.html}
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="pill"><span class="dot">${icon('star', 14)}</span>For tradespeople</span>
        <h1>More local jobs, <span class="accent">less chasing</span></h1>
        <p class="lead">Fixmet sends you jobs from homeowners near you, already priced and with photos. No quotes to write, no invoices to chase, and you're paid after every job.</p>
        <div class="cta-row" data-hero-cta>${contractorStoreButtons()}</div>
        <ul class="ticks"><li>${icon('check', 18)}Free to join</li><li>${icon('check', 18)}Choose your jobs</li><li>${icon('check', 18)}Paid to your bank</li></ul>
      </div>
      <div class="mock" aria-hidden="true">
        <div class="mock-card">
          <div class="mock-head">${markSvg({ size: 36, title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}<span><b>New job request</b><small>1.8 km away · Plumbing</small></span><span class="badge">40s</span></div>
          <div class="mock-photos"><span>${icon('camera', 22)}</span><span>${icon('plumber', 22)}</span><span>${icon('chat', 22)}</span></div>
          <div class="mock-price"><div><span>Fix a leaking kitchen tap</span><strong>${gbp(Math.round(87 * 0.8))}</strong></div></div>
          <div class="mock-meta"><div><span>Customer pays</span><b>£87</b></div><div><span>You earn</span><b>${gbp(Math.round(87 * 0.8))}</b></div><div><span>Paid</span><b>After the job</b></div></div>
        </div>
        <div class="mock-toast"><span class="ico">${icon('card', 18)}</span><span><b>Payout sent</b><small>Straight to your bank</small></span></div>
      </div>
    </div>
  </div>
</section>
<section class="section" aria-labelledby="join-h">
  <div class="wrap">
    <div class="section-head section-head--center"${reveal()}><span class="eyebrow">Getting started</span><h2 id="join-h">Start taking jobs in four steps</h2></div>
    <ol class="grid-4 steps" style="list-style:none;padding:0">${steps.map(([i, h, p], n) => `<li class="card step"${reveal(n)}><div class="step-n">${n + 1}</div><h3>${h}</h3><p>${esc(p)}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="section section--tint" aria-labelledby="trades-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Trades</span><h2 id="trades-h">Trades we need</h2><p class="lead">We're growing across ${towns.slice(0, 5).map((t) => t.name).join(', ')} and more.</p></div>
    <ul class="chips">${trades.map((t) => `<li><span>${esc(t.name)}</span></li>`).join('')}</ul>
  </div>
</section>
${faqSection(faqs, 'Questions from tradespeople')}`;
  const cta = `<section class="section section--tight" id="get-app" aria-labelledby="cta-h">
  <div class="wrap"><div class="band cta-final"${reveal()}>
    <span class="mark-badge">${markSvg({ size: 44, title: '' }).replace('role="img" aria-label=""', 'aria-hidden="true"')}</span>
    <h2 id="cta-h">Ready for more work?</h2>
    <p>Download Fixmet Contractors and sign up in a few minutes.</p>
    <div class="cta-row" style="justify-content:center">${contractorStoreButtons({ light: true })}</div>
  </div></div>
</section>`;
  write('contractors/index.html', layout({ title, description, path, body, cta, graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld, faqLd(faqs)],
    mobileCta: '' }).replace(appButton('Get a fixed price'), `<a class="btn btn--primary" href="${site.contractorAppStoreUrl}" rel="noopener">Join as a contractor</a>`));
  return path;
}

function aboutPage() {
  const path = '/about/';
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'About us', path }]);
  const title = 'About Fixmet | Fixed prices for home jobs';
  const description = 'Fixmet makes getting a job done at home simple: a fixed price from a photo, a checked local tradesperson, and payment only when the work is done.';
  const values = [
    ['tag', 'Honest prices', 'The same job costs the same, worked out from a public rate card. Any change on the day needs your approval.'],
    ['shield', 'Safety first', 'Contractors are ID-checked and asked for DBS checks and insurance before they can take jobs.'],
    ['star', 'Fair for tradespeople', 'Contractors see the pay before they accept, choose their own hours and are paid after every job.'],
  ];
  const body = `
${pageHero({ crumbs, eyebrow: 'About us', h1: 'Getting things fixed at home <span class="accent">shouldn\'t be hard</span>', lead: 'Ringing round, waiting for quotes and wondering what the final bill will be: we built Fixmet to end all of that.' })}
<section class="section" aria-labelledby="story-h">
  <div class="wrap prose-wrap">
    <h2 id="story-h"${reveal()}>Why we started Fixmet</h2>
    <div class="prose"${reveal()}>
      <p>Most people don't know what a fair price is for a leaking tap or a broken socket, and good tradespeople spend hours quoting for jobs they never get. Fixmet fixes both sides of that.</p>
      <p>You show us the job with a few photos. We work out a fixed price from UK trade rates, and offer the job to checked local tradespeople who can see the pay before they accept. You know who is coming and what it costs, and you only pay when the work is done.</p>
      <p>Fixmet is run by ${esc(site.company.legalName)}, a company registered in England &amp; Wales, based in Cardiff.</p>
    </div>
  </div>
</section>
<section class="section section--tint" aria-labelledby="values-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">What we believe</span><h2 id="values-h">Our promises</h2></div>
    <div class="grid-3">${values.map(([i, h, p], n) => `<div class="card"${reveal(n)}><span class="ico ico--lg">${icon(i, 24)}</span><h3>${h}</h3><p>${esc(p)}</p></div>`).join('')}</div>
  </div>
</section>
<section class="section" aria-labelledby="company-h">
  <div class="wrap">
    <div class="section-head"${reveal()}><span class="eyebrow">Company details</span><h2 id="company-h">Who we are</h2></div>
    <div class="card company-card"${reveal()}>
      <dl class="kv">
        <div><dt>Company</dt><dd>${esc(site.company.legalName)}, trading as Fixmet</dd></div>
        <div><dt>Registered in</dt><dd>England &amp; Wales</dd></div>
        <div><dt>Company number</dt><dd>${site.company.number}</dd></div>
        <div><dt>Registered office</dt><dd>${esc(site.company.address)}</dd></div>
        <div><dt>Email</dt><dd><a href="mailto:${site.supportEmail}">${site.supportEmail}</a></dd></div>
      </dl>
    </div>
  </div>
</section>`;
  write('about/index.html', layout({ title, description, path, body, graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld] }));
  return path;
}

function helpPage() {
  const path = '/help/';
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Help & FAQs', path }]);
  const title = 'Help & FAQs | Fixmet';
  const description = 'Answers about booking, prices, payments, cancellations, safety and your account on Fixmet. Can\'t find what you need? Email our team.';
  const groups = [
    ['Booking', [
      generalFaqs[3],
      ['What can I book?', `${trades.map((t) => t.name).join(', ')}.`],
      ['Can I book for someone else?', 'Yes. Set the job address to where the work is, and make sure someone can let the tradesperson in.'],
      ['Can I change the time of a scheduled job?', 'Yes, you can reschedule in the app. The contractor needs to confirm the new time.'],
    ]],
    ['Prices and payment', [generalFaqs[0], generalFaqs[1],
      ['Why is more than the price held on my card?', 'So that if the contractor finds more work and you approve a new price, it can be paid without asking for your card again. You are only charged the final agreed price, and the rest is released.'],
      ['How do I get a receipt?', 'We email a receipt when the job is complete, and your payments are listed in the app under Wallet.'],
    ]],
    ['Cancellations and problems', [generalFaqs[4],
      ['What if I\'m not home?', 'The tradesperson waits 10 minutes, then may report a no-show. A no-show fee of 20% of the price applies (at least £10).'],
      ['Something isn\'t right with the work', `Use Report a problem in the app, or email ${site.supportEmail}. Under the Fixmet guarantee, tell us within 7 days and we'll send someone back to fix it or refund you.`],
    ]],
    ['Safety and trust', [generalFaqs[2], generalFaqs[5],
      ['Is my address shared?', 'Only with the tradesperson who accepts your job, and only after they accept.'],
    ]],
    ['Your account', [
      ['How do I delete my account?', 'In the app, go to Profile, then Delete account. See our Delete your account page for details.'],
      ['I forgot my password', 'Tap Forgot password on the sign-in screen and we\'ll send you a code to set a new one.'],
    ]],
  ];
  const all = groups.flatMap(([, f]) => f);
  const body = `
${pageHero({ crumbs, eyebrow: 'Help', h1: 'How can we <span class="accent">help</span>?', lead: `Answers to common questions. Still stuck? Email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a> and we'll get back to you.` })}
<section class="section" aria-label="Questions">
  <div class="wrap faq-layout">
    <nav class="section-head toc" aria-label="Topics"><span class="eyebrow">Topics</span><ul>${groups.map(([g], i) => `<li><a href="#topic-${i}">${esc(g)}</a></li>`).join('')}</ul></nav>
    <div style="display:grid;gap:40px">${groups.map(([g, faqs], i) => `<div id="topic-${i}"><h2 class="h3" style="margin-bottom:14px">${esc(g)}</h2><div class="faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div>`).join('')}</div>
  </div>
</section>`;
  write('help/index.html', layout({ title, description, path, body, graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld, faqLd(all)] }));
  return path;
}

function contactPage() {
  const path = '/contact/';
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact us', path }]);
  const title = 'Contact Fixmet | Customer and contractor support';
  const description = `Get in touch with Fixmet. Email ${site.supportEmail} for help with a job, your account, joining as a contractor or anything else.`;
  const body = `
${pageHero({ crumbs, eyebrow: 'Contact', h1: 'Talk to <span class="accent">our team</span>', lead: 'The quickest way to get help with a job is in the app. For anything else, email us and we\'ll reply within 2 working days.' })}
<section class="section" aria-label="Ways to contact us">
  <div class="wrap">
    <div class="grid-3">
      <a class="card contact-card" href="mailto:${site.supportEmail}"${reveal()}><span class="ico ico--lg">${icon('chat', 24)}</span><h2 class="h3">Email us</h2><p>${site.supportEmail}</p><span class="link">Send an email ${icon('arrow', 16)}</span></a>
      <a class="card contact-card" href="mailto:${site.supportEmail}?subject=${encodeURIComponent('Problem with a job')}"${reveal(1)}><span class="ico ico--lg">${icon('shield', 24)}</span><h2 class="h3">Problem with a job</h2><p>Use Report a problem in the app, or email us with your booking details.</p><span class="link">Report by email ${icon('arrow', 16)}</span></a>
      <a class="card contact-card" href="/contractors/"${reveal(2)}><span class="ico ico--lg">${icon('star', 24)}</span><h2 class="h3">Join as a contractor</h2><p>Download Fixmet Contractors and sign up in a few minutes.</p><span class="link">Find out more ${icon('arrow', 16)}</span></a>
    </div>
    <div class="card company-card" style="margin-top:20px"${reveal()}>
      <dl class="kv">
        <div><dt>Write to us</dt><dd>${esc(site.company.legalName)}, ${esc(site.company.address)}</dd></div>
        <div><dt>Company number</dt><dd>${site.company.number} (England &amp; Wales)</dd></div>
      </dl>
    </div>
  </div>
</section>
${faqSection(generalFaqs.slice(0, 4), 'Before you get in touch')}`;
  write('contact/index.html', layout({ title, description, path, body, graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld, {
    '@type': 'ContactPage', url: url(path), mainEntity: { '@id': organization['@id'] },
  }] }));
  return path;
}

function legalPage({ slug, name, h1, lead, sections, description }) {
  const path = `/${slug}/`;
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name, path }]);
  const title = `${name} | Fixmet`;
  const para = (p) => (Array.isArray(p) ? `<ul>${p.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>` : `<p>${esc(p)}</p>`);
  const body = `
${pageHero({ crumbs, eyebrow: `Last updated ${LEGAL_UPDATED}`, h1, lead })}
<section class="section section--legal">
  <div class="wrap faq-layout">
    <nav class="section-head toc" aria-label="Contents"><span class="eyebrow">Contents</span><ol>${sections.map(([h], i) => `<li><a href="#s${i + 1}">${esc(h)}</a></li>`).join('')}</ol></nav>
    <div class="prose legal">${sections.map(([h, ps], i) => `<section id="s${i + 1}"><h2>${i + 1}. ${esc(h)}</h2>${ps.map(para).join('')}</section>`).join('')}</div>
  </div>
</section>`;
  write(`${slug}/index.html`, layout({ title, description, path, body, cta: '', graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld] }));
  return path;
}

function deleteAccountPage() {
  const path = '/delete-account/';
  const crumbs = breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Delete your account', path }]);
  const title = 'Delete your Fixmet account | Fixmet';
  const description = 'How to delete your Fixmet or Fixmet Contractors account in the app or by email, and exactly what happens to your personal data when you do.';
  const body = `
${pageHero({ crumbs, eyebrow: 'Your data', h1: 'Delete your <span class="accent">account</span>', lead: 'You can delete your Fixmet or Fixmet Contractors account at any time, in the app or by email.' })}
<section class="section section--legal">
  <div class="wrap prose-wrap">
    <div class="prose legal">
      <h2>In the app</h2>
      <ol>
        <li>Open the Fixmet or Fixmet Contractors app and sign in.</li>
        <li>Tap your profile picture, or go to Profile.</li>
        <li>Scroll down and tap <b>Delete account</b>.</li>
        <li>Confirm. Your account is deleted straight away and you are signed out.</li>
      </ol>
      <h2>By email</h2>
      <p>If you can't use the app, email <a href="mailto:${site.supportEmail}?subject=${encodeURIComponent('Delete my account')}">${site.supportEmail}</a> from the email address on your account and ask us to delete it. We'll confirm within 30 days.</p>
      <h2>What we delete and what we keep</h2>
      <ul>
        <li>We delete your profile, photo, saved addresses and sign-in details, and sign you out on every device.</li>
        <li>If you have past bookings, your name and contact details are removed and the bookings are kept without them, because we must keep payment records for 6 years for tax and accounting.</li>
        <li>Job photos and voice notes are deleted within 180 days of the job, and chat messages 365 days after the job ends.</li>
        <li>You can't delete your account while a job is in progress. Finish or cancel it first.</li>
      </ul>
      <p>See our <a href="/privacy/">Privacy policy</a> for more about how we handle your data.</p>
    </div>
  </div>
</section>`;
  write('delete-account/index.html', layout({ title, description, path, body, cta: '', graph: [webPageLd({ path, title, description, breadcrumb: crumbs.ld }), crumbs.ld] }));
  return path;
}

function notFoundPage() {
  const body = `
<section class="hero">
  <div class="wrap">
    <div class="hero-copy hero-copy--narrow" style="padding-top:40px">
      <span class="pill"><span class="dot">${icon('search', 14)}</span>Page not found</span>
      <h1>This page has <span class="accent">gone missing</span></h1>
      <p class="lead">The link may be old or mistyped. Try searching for a service or a town.</p>
      ${finder({ heading: 'Find a service' })}
      <div class="cta-row"><a class="btn btn--primary" href="/">Go to the homepage</a><a class="btn btn--outline" href="/services/">All services</a></div>
    </div>
  </div>
</section>`;
  write('404.html', layout({ title: 'Page not found | Fixmet', description: 'This page could not be found.', path: '/404/', body, cta: '', noindex: true }));
}

// ---------- build ----------

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });
copyFileSync(join(root, 'src/styles.css'), join(out, 'assets/fixmet-pages.css'));
copyFileSync(join(root, 'assets/fixmet-og.png'), join(out, 'assets/fixmet-og.png'));
copyFileSync(join(root, 'assets/fixmet-logo.png'), join(out, 'assets/fixmet-logo.png'));
for (const [file, svg] of Object.entries(logoFiles())) write(file, svg);

const index = {
  trades: trades.map((t) => [t.slug, t.name, t.plural, fromPrice(t, null), `${t.service} ${t.person ?? ''} ${t.jobs.map((j) => j.name).join(' ')}`]),
  towns: towns.map((t) => [t.slug, t.name, t.region, t.districts, t.areas, Boolean(t.live)]),
  icons: Object.fromEntries([...trades.map((t) => [t.slug, icon(t.slug, 18)]), ['pin', icon('pin', 18)], ['arrow', icon('arrow', 16)], ['menu', icon('menu', 22)], ['close', icon('close', 22)]]),
  play: site.playStoreUrl,
};
write('assets/fixmet-pages.js', readFileSync(join(root, 'src/client.js'), 'utf8').replace('__INDEX__', JSON.stringify(index)));

const paths = [
  homePage(), howItWorksPage(), pricingPage(), contractorsPage(), aboutPage(), helpPage(), contactPage(),
  legalPage({ slug: 'privacy', name: 'Privacy policy', h1: 'Privacy <span class="accent">policy</span>', lead: 'What personal data Fixmet collects, why, who we share it with and your rights.', description: 'How Fixmet Solutions Ltd collects, uses and protects personal data in the Fixmet apps and website, and your rights under UK data protection law.', sections: privacy(site) }),
  legalPage({ slug: 'terms', name: 'Terms of service', h1: 'Terms of <span class="accent">service</span>', lead: 'The rules for using Fixmet, including prices, payment, cancellations and the Fixmet guarantee.', description: 'Terms of service for the Fixmet apps and website: bookings, prices, payment, cancellations, the Fixmet guarantee and your rights.', sections: terms(site) }),
  legalPage({ slug: 'cookies', name: 'Cookie policy', h1: 'Cookie <span class="accent">policy</span>', lead: 'Short version: this website doesn\'t use advertising or analytics cookies.', description: 'Fixmet\'s cookie policy: this website does not use advertising or analytics cookies. How our apps store data on your phone.', sections: cookies(site) }),
  deleteAccountPage(),
  servicesPage(), areasPage(),
];
for (const trade of trades) {
  paths.push(tradeHubPage(trade));
  for (const town of towns) paths.push(tradeTownPage(trade, town));
}
for (const town of towns) paths.push(townHubPage(town));
notFoundPage();

const priority = (p) => (p === '/' ? '1.0' : p.split('/').filter(Boolean).length === 1 ? '0.8' : '0.6');
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${url(p)}</loc><lastmod>${BUILD_DATE}</lastmod><priority>${priority(p)}</priority></url>`).join('\n')}
</urlset>
`,
);
// Older links to the separate services sitemap keep working.
write('sitemap-services.xml', readFileSync(join(out, 'sitemap.xml'), 'utf8'));
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url('/sitemap.xml')}\n`);
copyFileSync(join(root, 'assets/favicon.ico'), join(out, 'favicon.ico'));

console.log(`Built ${paths.length} pages into dist/`);
