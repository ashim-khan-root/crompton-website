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

## Open items (see phases.md for the ordered list)

1. Client decision: where leads land (inbox vs WhatsApp-only) — blocks Phase 2, highest value
2. memory.md sync — this file plus `.agent` cross-check is the Phase 1 gate
3. Client assets (photos, certificates, client names) — blocks Phase 3
4. Arabic build-or-hide decision — blocks Phase 4
