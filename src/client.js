/* Fixmet service pages: progressive enhancements only. Every page is complete
   and crawlable without this script. */
(() => {
  const INDEX = __INDEX__;
  const doc = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const norm = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

  /* ---------- "Get a price" opens the right store ---------- */
  if (/android/i.test(navigator.userAgent)) $$('[data-app-link]').forEach((a) => { a.href = INDEX.play; });

  /* ---------- Header shadow, mobile CTA, subnav CTA ---------- */
  const header = $('.header');
  const mobileCta = $('.mobile-cta');
  const subnav = $('.subnav');
  const heroCta = $('[data-hero-cta]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      const past = !e.isIntersecting && e.boundingClientRect.top < 0;
      mobileCta && mobileCta.classList.toggle('is-shown', past);
      subnav && subnav.classList.toggle('has-cta', past);
    }).observe(heroCta);
  } else if (mobileCta) mobileCta.classList.add('is-shown');

  /* ---------- Reveal on scroll ---------- */
  const reveal = $$('[data-reveal]');
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveal.forEach((el) => io.observe(el));
  } else reveal.forEach((el) => el.classList.add('is-in'));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-menu]');
  const drawer = $('#menu');
  if (menuBtn && drawer) {
    const set = (open) => {
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.innerHTML = open ? INDEX.icons.close : INDEX.icons.menu;
      drawer.inert = !open;
    };
    drawer.inert = true;
    menuBtn.addEventListener('click', () => set(!drawer.classList.contains('is-open')));
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => e.key === 'Escape' && drawer.classList.contains('is-open') && set(false));
    matchMedia('(min-width: 921px)').addEventListener('change', (m) => m.matches && set(false));
  }

  /* ---------- Desktop mega menus: click/keyboard support ---------- */
  $$('.nav-item').forEach((item) => {
    const btn = $('.nav-trigger', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      $$('.nav-item.is-open').forEach((o) => { o.classList.remove('is-open'); $('.nav-trigger', o).setAttribute('aria-expanded', 'false'); });
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('keydown', (e) => { if (e.key === 'Escape') { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
    item.addEventListener('mouseleave', () => { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) $$('.nav-item.is-open').forEach((o) => { o.classList.remove('is-open'); $('.nav-trigger', o).setAttribute('aria-expanded', 'false'); });
  });

  /* ---------- Matching ---------- */
  const trades = INDEX.trades.map(([slug, name, plural, from, words]) => ({ slug, name, plural, from, text: norm(`${name} ${plural} ${words}`), nameN: norm(name) }));
  const towns = INDEX.towns.map(([slug, name, region, districts, areas]) => ({ slug, name, region, districts, areas, text: norm(`${name} ${region} ${areas.join(' ')}`), nameN: norm(name) }));
  const scoreText = (q, item) => {
    if (!q) return 1;
    if (item.nameN === q) return 100;
    if (item.nameN.startsWith(q)) return 80;
    if (item.text.split(' ').some((w) => w.startsWith(q))) return 50;
    const parts = q.split(' ').filter((p) => p.length > 1);
    const hits = parts.filter((p) => item.text.includes(p)).length;
    return hits ? (hits / parts.length) * 40 : 0;
  };
  // Postcode: "M20 2AB" -> M20. Matches a listed district, else the same area letters.
  const postcodeTown = (raw) => {
    const m = String(raw).toUpperCase().replace(/\s+/g, ' ').trim().match(/^([A-Z]{1,2})(\d[A-Z\d]?)?(?:\s*\d[A-Z]{0,2})?$/);
    if (!m) return null;
    const outward = m[1] + (m[2] ?? '');
    return towns.find((t) => t.districts.includes(outward))
      ?? (m[2] ? towns.find((t) => t.districts.some((d) => d.match(/^[A-Z]+/)[0] === m[1])) : null);
  };
  const findTrades = (q) => trades.map((t) => [scoreText(norm(q), t), t]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).map(([, t]) => t);
  const findTowns = (q) => {
    const pc = postcodeTown(q);
    const list = towns.map((t) => [scoreText(norm(q), t), t]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).map(([, t]) => t);
    return pc ? [pc, ...list.filter((t) => t !== pc)] : list;
  };
  const gbp = (n) => `£${Number(n).toLocaleString('en-GB')}`;

  /* ---------- Combobox (finder fields) ---------- */
  function combobox(input, source, render) {
    const list = document.getElementById(input.getAttribute('aria-controls'));
    let items = [];
    let active = -1;
    input.selected = null;
    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
    const highlight = (i) => {
      active = i;
      $$('li', list).forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
      const li = list.children[i];
      if (li) { input.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' }); }
    };
    const choose = (i) => { const item = items[i]; if (!item) return; input.value = item.name; input.selected = item; close(); input.dispatchEvent(new CustomEvent('chosen')); };
    const open = () => {
      items = source(input.value).slice(0, 8);
      if (!items.length) { list.innerHTML = '<li role="option" aria-disabled="true" class="muted">No match. Try another word.</li>'; items = []; }
      else list.innerHTML = items.map((it, i) => `<li role="option" id="${list.id}-${i}" aria-selected="false">${render(it)}</li>`).join('');
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      if (items.length && input.value.trim()) highlight(0);
    };
    input.addEventListener('input', () => { input.selected = null; open(); });
    input.addEventListener('focus', open);
    input.addEventListener('blur', () => setTimeout(close, 120));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) open(); highlight(Math.min(active + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(Math.max(active - 1, 0)); }
      else if (e.key === 'Enter' && !list.hidden && active >= 0) { e.preventDefault(); choose(active); }
      else if (e.key === 'Escape') close();
    });
    list.addEventListener('mousedown', (e) => {
      const li = e.target.closest('li[id]');
      if (li) { e.preventDefault(); choose([...list.children].indexOf(li)); }
    });
    return { best: () => input.selected ?? (input.value.trim() ? source(input.value)[0] ?? null : null) };
  }

  const finder = $('[data-finder]');
  if (finder) {
    const tradeInput = $('[name=service]', finder);
    const townInput = $('[name=town]', finder);
    const tradeBox = combobox(tradeInput, findTrades, (t) => `<span class="ico">${INDEX.icons[t.slug]}</span><span>${esc(t.name)}<small>From ${gbp(t.from)}</small></span>`);
    const townBox = combobox(townInput, findTowns, (t) => `<span class="ico">${INDEX.icons.pin}</span><span>${esc(t.name)}<small>${esc(t.region)}</small></span>`);
    tradeInput.addEventListener('chosen', () => { if (!townInput.value) townInput.focus(); });
    if (finder.dataset.town) townInput.selected = towns.find((t) => t.slug === finder.dataset.town) ?? null;
    if (finder.dataset.trade) tradeInput.selected = trades.find((t) => t.slug === finder.dataset.trade) ?? null;
    finder.addEventListener('submit', (e) => {
      e.preventDefault();
      const trade = tradeBox.best();
      const town = townBox.best();
      if (trade && town) location.href = `/${trade.slug}/${town.slug}/`;
      else if (trade && !townInput.value.trim()) location.href = `/${trade.slug}/`;
      else if (town && !tradeInput.value.trim()) location.href = `/areas/${town.slug}/`;
      else if (!trade) { tradeInput.focus(); tradeInput.dispatchEvent(new Event('input')); }
      else { townInput.focus(); townInput.dispatchEvent(new Event('input')); }
    });
  }

  /* ---------- Search palette (Ctrl/Cmd+K or "/") ---------- */
  const palette = $('#search');
  if (palette && typeof palette.showModal === 'function') {
    const input = $('input', palette);
    const list = $('.palette-list', palette);
    let links = [];
    let active = 0;
    const row = (href, icon, title, sub) => `<li><a href="${href}" role="option" aria-selected="false"><span class="ico">${icon}</span><span>${esc(title)}<small>${esc(sub)}</small></span><span class="tile-go">${INDEX.icons.arrow}</span></a></li>`;
    const render = () => {
      const q = input.value.trim();
      const out = [];
      if (!q) {
        out.push('<li class="group">Popular services</li>', ...trades.slice(0, 6).map((t) => row(`/${t.slug}/`, INDEX.icons[t.slug], t.name, `From ${gbp(t.from)}`)));
        out.push('<li class="group">Areas</li>', ...towns.slice(0, 5).map((t) => row(`/areas/${t.slug}/`, INDEX.icons.pin, t.name, t.region)));
      } else {
        // "plumber manchester", "electrician in M20", "leak leeds"
        const words = norm(q).split(' ');
        let combo = null;
        for (let i = 1; i < words.length && !combo; i++) {
          const a = words.slice(0, i).join(' ').replace(/ in$/, '');
          const b = words.slice(i).join(' ').replace(/^in /, '');
          const t = findTrades(a)[0];
          const w = findTowns(b)[0] ?? postcodeTown(b);
          if (t && w) combo = [t, w];
        }
        if (combo) out.push('<li class="group">Best match</li>', row(`/${combo[0].slug}/${combo[1].slug}/`, INDEX.icons[combo[0].slug], `${combo[0].name} in ${combo[1].name}`, 'Prices, areas covered and how it works'));
        const ts = findTrades(q).slice(0, 6);
        const ws = findTowns(q).slice(0, 5);
        if (ts.length) out.push('<li class="group">Services</li>', ...ts.map((t) => row(`/${t.slug}/`, INDEX.icons[t.slug], t.name, `From ${gbp(t.from)}`)));
        if (ws.length) out.push('<li class="group">Areas</li>', ...ws.map((t) => row(`/areas/${t.slug}/`, INDEX.icons.pin, t.name, t.region)));
      }
      list.innerHTML = out.length ? out.join('') : `<li class="palette-empty">Nothing found for “${esc(q)}”. Try a trade like “plumber” or a town.</li>`;
      links = $$('a', list);
      select(0);
    };
    const select = (i) => {
      active = Math.max(0, Math.min(i, links.length - 1));
      links.forEach((a, j) => a.setAttribute('aria-selected', String(j === active)));
      links[active]?.scrollIntoView({ block: 'nearest' });
    };
    const open = () => { if (palette.open) return; input.value = ''; render(); palette.showModal(); input.focus(); };
    $$('[data-search]').forEach((b) => b.addEventListener('click', open));
    addEventListener('keydown', (e) => {
      const typing = /input|textarea|select/i.test(document.activeElement?.tagName ?? '');
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
    });
    input.addEventListener('input', render);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); select(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); select(active - 1); }
      else if (e.key === 'Enter' && links[active]) { e.preventDefault(); location.href = links[active].href; }
    });
    $('[data-close]', palette).addEventListener('click', () => palette.close());
    palette.addEventListener('click', (e) => { if (e.target === palette) palette.close(); });
  }

  /* ---------- Instant / scheduled price toggle ---------- */
  $$('[data-price-toggle]').forEach((toggle) => {
    const pct = Number(toggle.dataset.instant) / 100;
    const buttons = $$('button', toggle);
    const thumb = $('.thumb', toggle);
    const table = document.getElementById(toggle.dataset.target);
    const place = (btn) => { thumb.style.width = `${btn.offsetWidth}px`; thumb.style.transform = `translateX(${btn.offsetLeft - 4}px)`; };
    const set = (btn) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      place(btn);
      const instant = btn.dataset.mode === 'instant';
      $$('.price-val', table).forEach((el) => {
        const base = Number(el.dataset.base);
        el.textContent = gbp(Math.round(instant ? base * pct : base));
        if (!reduced) { el.classList.remove('is-changing'); void el.offsetWidth; el.classList.add('is-changing'); }
      });
    };
    buttons.forEach((b) => b.addEventListener('click', () => set(b)));
    toggle.hidden = false;
    requestAnimationFrame(() => place(buttons[0]));
    addEventListener('resize', () => place(buttons.find((b) => b.getAttribute('aria-pressed') === 'true')));
  });

  /* ---------- Section nav: highlight the section in view ---------- */
  if (subnav && 'IntersectionObserver' in window) {
    const links = $$('a[href^="#"]', subnav);
    const map = new Map(links.map((a) => [document.getElementById(a.hash.slice(1)), a]));
    const spy = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.classList.remove('is-active'));
        const a = map.get(e.target);
        if (a) { a.classList.add('is-active'); a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
      }
    }, { rootMargin: '-35% 0px -60% 0px' });
    map.forEach((_, section) => section && spy.observe(section));
  }
})();
