# www.fixmet.co.uk

The Fixmet website: homepage, how it works, pricing, contractors, about, help,
contact, legal pages, and a page for every trade and town (e.g. `/plumber/manchester/`).
Plain HTML and CSS built by `build.mjs`, with no dependencies.

## Build and preview

```bash
node build.mjs                                   # writes dist/
python3 -m http.server 4321 --directory dist     # http://localhost:4321
```

## Hosting

Vercel builds this repo on every push (`vercel.json`): pushes to `main` go live,
other branches get a preview link.

## What to edit

| File | What it holds |
| --- | --- |
| `src/data.mjs` | Store links, company details, trades with prices, towns |
| `src/legal.mjs` | Privacy policy, terms and cookie policy text |
| `build.mjs` | The page layouts (homepage, help, contractors, etc.) |
| `src/styles.css` | The design |
| `src/client.js` | Search, menus, price toggle and scroll motion |

Prices copy the rate card on the admin Prices page. If you change a rate there,
change it in `src/data.mjs` too.
