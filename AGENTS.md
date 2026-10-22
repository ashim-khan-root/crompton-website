# Cromton Group website

Marketing site for **Cromton Group Trading & Contracting & Services W.L.L.**, a manpower
supply and contracting company in Doha, Qatar. Bilingual: English (default) and Arabic.

Live at **`cromtongroup.com`** (and `www`) behind a Cloudflare Tunnel on a single AlmaLinux VPS.

This file is the entry point. Read it before touching anything; the other `.md` files here
are deeper references, and two of them are older than the current brand.

---

## Ground rules

1. **The brand is `Cromton Group`** — no "p". The full string used on the site is
   `Cromton Group Trading & Contracting & Services W.L.L.`; Arabic is `كرومتون جروب`.
   The legal entity name and its licence/ISO particulars are **not yet confirmed by the
   client** — don't restate them in contracts or formal documents until they are.
   The repo directory, `package.json` name and git history still say `crompton-website`.
   That is historical, not a bug. Do not mass-rename it without the owner's decision.
2. **Domain trap.** `cromtongroup.com` is production. `cromptongroup.com` is a parked
   lookalike owned by someone else, and `crompton-intl.com` was never registered. Never
   point DNS, nginx or a deploy at either of them.
3. **Never invent numbers or credentials.** No headcount, project count, ISO number or
   certification goes on the page unless the client supplied it. This has already bitten:
   invented stat bands and unverifiable cert claims were deliberately removed. See `rules.md`.
4. **`dist/` is generated.** It is gitignored. Never commit it, never edit it, never treat it
   as source.
5. **Do not deploy from a workstation**, and do not deploy from this repo by copying into
   `/var/www`. Production deploys are a separate, owner-run step (see *How this ships*).

---

## Commands

Verified on the VPS, 2026-10-21: **Node v24.21.0, npm 11.19.0, lockfileVersion 3.**

```bash
npm ci                 # install from package-lock.json (use this, not `npm install`)
npm run build          # → dist/  (14 pages + 404, ~7s)
npm run check:build    # asserts the output: canonical, og, hreflang, fonts, robots, sitemap
npm run dev            # local dev server
npm run preview        # serve the built dist/
node scripts/vendor-fonts.mjs   # re-download self-hosted fonts + regenerate fonts.css
python3 scripts/make-og-image.py  # regenerate the 1200x630 share card (needs network)
```

Node 24.x is what production builds with. On another machine, match that major version and
commit any resulting `package-lock.json` change — a lock produced by a different major is a
different dependency tree.

**There is no typecheck.** `astro check` needs `@astrojs/check` and `typescript`, which are
not installed. So "the build passes" means *it compiled*, not that types are correct.
`npm run check:build` covers the output instead: it reads `dist/` and fails on a missing
canonical, a share card pointing nowhere, hreflang on a page with no translation, a
Google Fonts reference, a missing font file, or a sitemap entry for the redirect. Every
check in it was proven by injecting the fault and watching it fail.

---

## Layout

```
src/
  pages/en/*.astro      12 English pages (default locale lives under /en/)
  pages/ar/index.astro  Arabic homepage only
  pages/index.astro     / → redirect to /en/
  components/           React 19 islands: Navbar, Footer, ContactForm, Logo,
                        ClientCarousel, StatsCounter, WhatsAppButton
  data/*.json           services, industries, workforce, jobs, clients — real content
  i18n/{en,ar}.json     ⚠ DEAD CODE — imported nowhere. Do not add strings here.
  layouts/BaseLayout.astro   head/meta/canonical/og/hreflang + Organization JSON-LD
  styles/global.css     tokens + component classes
  styles/fonts.css      GENERATED @font-face rules — see scripts/vendor-fonts.mjs
  pages/404.astro       → dist/404.html (needs `error_page 404 /404.html;` in nginx)
public/                 favicon.svg, robots.txt, fonts/*.woff2, images/ (hero, clients,
                        gallery, og card), images/manifest.json
scripts/                vendor-fonts.mjs, make-og-image.py, check-build.mjs,
                        import-legacy-assets.py, deploy helpers
astro.config.mjs        site=cromtongroup.com, i18n en+ar, prefixDefaultLocale,
                        sitemap filtered to drop the `/` redirect and the 404
tailwind.config.js      design tokens
```

Astro is static output — no adapter, no server runtime. There is no backend, no database and
no form endpoint. `ContactForm.tsx` composes a `wa.me` WhatsApp deep link client-side, so a
"submitted" enquiry is only as good as the visitor actually sending it.

Routing: `prefixDefaultLocale: true` means English lives at `/en/*`, never at `/about`.
Arabic sub-pages do not exist — links from `/ar/` intentionally fall back to `/en/`.

---

## How this ships

Editing and shipping are split across two machines, by design:

1. **Workstation.** Edit `src/`, commit, `git push`. Repo:
   `https://github.com/ashim-khan-root/crompton-website` (public).
2. **VPS.** `git pull --ff-only` → `npm ci` if `package.json`/lock changed → `npm run build`.
3. **Owner runs the deploy** (needs root; agents on the VPS have no passwordless sudo):
   `sudo ./deploy-static-site.sh cromtongroup.com <path>/dist` from the separate
   `dev-agency` repo, which also holds the nginx site template.
4. Verify live: `curl -I -H 'Host: cromtongroup.com' http://localhost` and a public `curl`.

The deploy script **wipes and replaces** `/var/www/cromtongroup.com/html` and regenerates
`/etc/nginx/conf.d/cromtongroup.com.conf`. It has no backup step. If you add nginx directives
(gzip, cache headers, redirects), update the template in `dev-agency/deploy/nginx/` first,
or the next deploy silently drops them.

`python3 -m http.server` inside `dist/` is fine for a local look. It is not a deploy.

---

## Known traps

- **Astro builds are not byte-reproducible.** Hydrated islands get random `uid="..."`.
  Compare builds modulo `uid="..."`, never by raw checksum.
- **`src/i18n/*.json` is dead code** that still contains real strings. Editing it changes
  nothing. Either delete it deliberately or wire it up — don't half-do it.
- **Placeholder slots are intentional**: photo frames, certificate frames and client-logo
  frames hold space for assets the client has not delivered. Don't fill them with stock.
- **Arabic needs a native reviewer.** Machine translation damage (stray CJK, French words,
  broken UTF-8) was repaired once already. `SHOOT-LIST.md` §5 tracks the pending review.
- **Fonts are self-hosted now.** `src/styles/fonts.css` is generated by
  `scripts/vendor-fonts.mjs`; do not hand-edit it and do not reintroduce a
  fonts.googleapis.com `@import`. `check:build` fails on the latter.
- **`dist/404.html` is only served if nginx says so.** The site file needs
  `error_page 404 /404.html;` — it lives in the `dev-agency` nginx template, not here.
- **`hreflang` covers the homepage pair only**, because only the homepage has an Arabic
  version. If Arabic sub-pages land (Phase 4), extend the `alternates` block in
  `BaseLayout.astro` at the same time, or the AR pages will be orphans.

---

## Current open work

Client-blocked (see `CLIENT-INPUT.md`): photos, certificate scans, client logos, licence/ISO
particulars, real careers and news copy, Arabic review.

Done 2026-10-22, needs a redeploy to go live: canonical, og:image + og:url + twitter card,
`robots.txt`, `404.html`, self-hosted fonts, sitemap filtered, Organization `@id`.

Still not blocked: gzip + cache headers, `www` → apex redirect, `error_page 404` in nginx,
analytics, uptime monitoring. The first three are nginx-template changes in `dev-agency`.

---

## Read next, by question

| Question | File |
|---|---|
| What is this product, for whom? | `prd.md` |
| How is it built, how does data flow? | `architecture.md` |
| Visual language and anti-slop rules | `design.md`, `rules.md` |
| Project history and why decisions were made | `memory.md`, `phases.md` |
| What the client still owes us | `CLIENT-INPUT.md` |
| Photography and asset brief | `SHOOT-LIST.md` |
| How deployment actually works | `DEPLOY.md` |
