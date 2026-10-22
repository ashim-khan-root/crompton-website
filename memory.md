# Project Memory

Chronological decisions and findings for the Crompton website. Cross-session context lives in
`/home/vtsq/dev-tools/.agent/` (memory_snapshot, daily.md); this file carries what the project
itself must remember even if the brain is elsewhere.

## 2026-08/09 — Demo round (pre-git)

- Bilingual demo site built with Astro 5 + React 19 + Tailwind to show the client scope:
  12 EN pages + AR homepage, data-driven content, WhatsApp conversion path.
- **Fabricated client names removed.** `clients.json` was emptied deliberately after audit;
  the homepage "Trusted by" block and `/en/clients` render conditionally on a non-empty list.
  Do not re-add placeholder companies.
- **Arabic sub-pages fall back to `/en/` instead of 404ing** — only the Arabic homepage is
  translated. Navbar, Footer and `ar/index.astro` patched accordingly.
- ERPNext work was explicitly out of scope for this folder: the user corrected an earlier
  session for also auditing the running ERPNext stack at crompton.venturetechqatar.com from
  here; that work was fully reverted. Website project ≠ ERPNext project.

## 2026-10-17 — Git repair + docs

- Found `.git/` was an empty shell (`config/HEAD/hooks/info` only; no `objects/`, no `refs/`).
  `git status` → "not a git repository". **No history existed to recover** — verified before
  touching anything.
- Recovery: moved the shell to `.git.broken-backup/` (preserved, gitignored), `git init -b main`,
  repo-local identity Ashim <starfoxsecurity@gmail.com> (global identity is unset; matches the
  TEW repo), wrote `.gitignore` **before** staging (node_modules/256MB, dist, .astro),
  committed `7630f30` "Import existing Crompton International website" — 37 files, tree clean.
- Build re-verified post-repair: 13 pages, 5.9s. Repo is local-only — no remote yet.
- **Content audit findings (fix routed into phases.md):**
  - `ContactForm.tsx` has no backend: builds a `wa.me` deep link and `window.open`s it. The
    "message sent successfully" confirmation shows even when WhatsApp is cancelled. Lead path
    is real revenue risk — Phase 2.
  - `src/i18n/en.json` + `ar.json` are imported nowhere (dead code), and contain machine-translation
    artifacts: Chinese `其他` and French `maintenant` inside Arabic strings. Also in
    `data/services.json` `descriptionAr`.
  - 4 unused deps: `gsap`, `react-hook-form`, `zod`, `@hookform/resolvers` (zero references).
  - `public/` holds only a favicon — zero photography sitewide.
  - No hreflang alternates despite bilingual routing.
  - `DEPLOY.md` still points at `/home/aiworker/ai-worker/crompton-website/` (stale host path).
- Wrote prd/architecture/rules/phases/design docs (dev-lifecycle convention, six-doc set is
  now complete except memory.md — written here, this file).
- Design decision recorded in design.md: the `primary` Tailwind scale is intentionally
  non-monotonic (400 is light tint, 500-900 are the navy ramp) — derive colors from the ramp.

## 2026-10-17 — Design audit + homepage redesign (reference build)

- Ran a full design audit against the Hallmark anti-slop rules and rendered the site in a real
  browser (Firefox headless) rather than reading source alone. Verdict: **9 critical · 11 major
  · 6 minor** tells — a textbook AI template (full-viewport hero, equal card grids, emoji icons,
  eyebrows on every section, duplicated service panels, invented stats, AI nav + footer).
  Two rendering facts source-reading alone missed: the hero becomes a ~5200px navy void at a
  tall viewport (`min-h-screen`), and **the brand name is invisible on mobile** (`hidden sm:block`).
- **User decision: redesign the homepage first as the site-wide reference**, then propagate.
  Imagery decision: **client shoot list** (not stock, not empty slots).
- Rebuilt the homepage to an industrial-corporate system:
  - Navbar → masthead: dark utility strip (phone/email/language) + light main bar. Fixes the
    logo/first-link collision and shows the wordmark at every width.
  - Hero → asymmetric, content-height (no `min-h-screen`), solid navy + engineered grid + grain.
    Right column is a real "What we supply" panel (role counts from `services.json`), not filler.
  - Capabilities → a ledger (hairline rows, left/right split) instead of the 4-card grid.
  - New "Behind every deployment" operations section (accommodation / transport / training / HSE)
    — the buyer's diligence set, and where the shoot-list photos land.
  - Sectors → dense hairline index. Closing CTA → distinct from the interior pages' band.
  - Footer → statement-led close; removed the dead `href="#"` social row.
  - Removed: emoji feature icons, section eyebrows (except one hero kicker), gradient surfaces,
    duplicate service panels, and the **invented stat band** — per our own rules.md, unverified
    numbers no longer ship. Tokens added: warm `paper`/`ink`/`rule`; `.slot` image placeholders.
- Wrote `SHOOT-LIST.md` — client photography + brand-asset brief with delivery spec, full shot
  list by section, an asset→page map, and a claims-confirmation checklist (§5).
- Verified: build 13 pages / 6.6s; rendered desktop, tablet and 320px — no overflow, no console
  errors; brand name visible on mobile. Preview served locally on :8899 during review (stopped).

## 2026-10-17 — Phase 1.5: rolled the reference design across all 12 remaining pages

- Built two shared components so eleven hand-written pages read as one site instead of eleven
  variations: `PageHeader.astro` (navy + grid texture, breadcrumb, title, lead, context line) and
  `CtaBand.astro` (closing CTA). Every old `pt-32 pb-16` gradient hero band is gone.
- Card grids → ledger/index layouts: hairline rows on services, industries, workforce, values, HSE
  commitments, news and vacancies. Density went up and the "equal rounded cards" tell went away.
- Per-page tells removed: the duplicated navy service panel on `services.astro`, the invented stat
  bands on `clients.astro` and `hse.astro`, "Coming Soon" gallery tiles, and the cert-claim icon
  cards (now document slots with a "number & expiry on file" line).
- **Two honesty bugs fixed, both found by reading the code rather than the render:**
  - `ContactForm.tsx` reported "message sent successfully" even when the visitor cancelled the
    WhatsApp popup — nothing was sent. It now checks whether a window actually opened and the copy
    says WhatsApp was *opened*, not that a message was sent.
  - `careers.astro` had a drag-and-drop CV uploader that uploaded nothing (WhatsApp deep links
    cannot carry files). Removed the control, kept accurate copy: attach the CV in the chat.
- **Design bug only visible when rendered:** interior CTA band and navy footer each carried a gold
  button, so pages ended with two identical "Request Manpower" buttons stacked ~180px apart. Fixed
  by making the interior CTA band light-ground with navy buttons. Rule adopted: **gold on dark
  grounds (hero, footer), navy on light grounds.** Also folded a duplicated HSE CTA section into
  the band.
- **Arabic content repair (contamination audit of `src/data/*.json`).** Found machine-translation
  damage that actually renders on the Arabic homepage — not just in the known-dead `i18n/` files:
  a CJK run (`其他`) inside `services.json` `descriptionAr`, French `maintenant` inside another,
  raw English tokens ("engineers", "personnel", "orporate") in `industries.json`, nonsense words
  ("السبك" used for MEP, "ربّاطجيون"), misspellings ("الكادرة" → "الكوادر", "يمكين" → "يمكّن",
  "الهيكليه"), and a corrupted UTF-8 escape in `workforce.json` that had turned "Quantity
  Surveyors" into `م UTF-8 قيمون`. All repaired.
  - Editing method worth remembering: **Arabic strings that mix scripts could not be matched by
    literal text** — typed Arabic+CJK/Latin literals came back reordered, so `str.replace` silently
    missed. Fix: escape the non-Arabic characters (`\u53ca\u5176\u4ed6`) and match on pure-Arabic
    anchors, with an assertion that each replacement actually landed.
  - Arabic typography rule added to `global.css`: Arabic must never be letter-spaced, so all
    tracking utilities are neutralised under `[dir="rtl"]` (tracking breaks cursive joins).
- Verified by rendering every page in headless Firefox at 1440px and reading the screenshots — not
  by reading source. 13 pages / 6.6s build; **371 internal links, 0 broken**; zero "Coming Soon",
  Lorem, placeholder-service, dead `href="#"`, gradient-text or emoji left in `dist/`. Removed the
  last unverified claim the audit caught: the news page's "800+ professionals" headline (the page
  already carried a sample-content warning, but the number still shipped in the HTML).
- Not verified: `astro check`. It needs `@astrojs/check` + `typescript` installed via npm and there
  was no network-independent way to add them in this environment. Recorded as a Phase 2 gate rather
  than claimed as passing.

## 2026-10-22 — Head, crawl surface and fonts (Phase 1.6)

Everything here was invisible on the page: the site looked finished while every shared link
rendered as a bare URL. No client input was needed, so none of it waited on the client.

- **Canonical** on every page, absolute and self-referential, derived from `Astro.url.pathname`
  in `BaseLayout.astro` and normalised to a trailing slash because every route is a directory
  index. The **404 carries none** — it is served for arbitrary paths, so a canonical would
  claim one URL for all of them.
- **Share card**: `og:image` (1200×630, generated by `scripts/make-og-image.py`), `og:url`,
  `og:image:alt`, `twitter:card`. The card is rendered from the real logo geometry (the arc and
  keystone from `Logo.tsx`, through `rsvg-convert`) plus type in the two self-hosted families.
  It carries no number, no photo and no certificate — nothing that could become a claim.
- **`hreflang`** only for the `/en/` ↔ `/ar/` homepage pair, plus `x-default`. Interior pages
  carry none deliberately: a hreflang pointing at a page that does not exist is worse than none.
- **`robots.txt`** + **sitemap filtered** so the `/` redirect and the 404 are not advertised.
- **`404.html`** built and styled to the system. It is **not served yet** — nginx needs
  `error_page 404 /404.html;`, which lives in the `dev-agency` template, not this repo.
- **Fonts self-hosted.** The render-blocking `@import` from fonts.googleapis.com is gone:
  `scripts/vendor-fonts.mjs` downloads the same files (7 woff2, 387 KiB on disk) and generates
  `src/styles/fonts.css` with Google's own unicode-ranges. Pages preload only the two faces they
  paint with; Arabic pages preload Noto Sans Arabic instead of the Latin pair.
- **Organization JSON-LD** reduced to one node with an `@id`, `email` and `image`, and an Arabic
  description on Arabic pages. Previously a second English-only organisation repeated 13 times.
- **`npm run check:build`** (`scripts/check-build.mjs`) is the new gate. It reads `dist/` and
  asserts canonical correctness, the share card, hreflang placement, no Google Fonts reference,
  every referenced font file present, the og image's real pixel dimensions (parsed from the JPEG
  header, no image dependency) and sitemap contents.
  - **Each check was proven by injecting its fault** — deleted `robots.txt`, retargeted a
    canonical, re-added a Google Fonts link, downscaled the card — confirming exit 1, then
    restoring and confirming green. A check that has never failed has not been tested.
- **Verified in a browser, not just the HTML**: Chromium via `agent-browser`. `document.fonts`
  reports `loaded`; `document.fonts.check` passes for Inter, Plus Jakarta Sans and Noto Sans
  Arabic; every woff2 request returns 200; zero console errors on `/en/`, `/ar/` and `/404.html`.
- **Built, not deployed.** Production still serves the earlier build until the owner runs the
  nginx deploy.

## Open items (see phases.md for the ordered list)

1. Client decision: where leads land (inbox vs WhatsApp-only) — blocks Phase 2, highest value
2. `astro check` cannot run until `@astrojs/check` + `typescript` are installed — Phase 2 gate
3. `gsap`, `react-hook-form`, `zod`, `@hookform/resolvers` still installed and unused; `src/i18n/`
   still dead code — Phase 2 cleanup
4. Arabic site is homepage-only; navbar/footer links from `/ar/` fall back to `/en/` — build the
   Arabic pages (Phase 4) or hide the switcher
5. Client assets (photos, certificates, client names) — blocks Phase 3. This is now the binding
   constraint on the site looking like a real company: the code is ready and every slot is labelled
   and sized, but no further CSS substitutes for the shoot.
