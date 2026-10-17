# Development Phases

Status as of 2026-10-17: demo round complete, real-launch round not started. Git repaired this
date (prior .git was an empty shell; history starts at `7630f30`).

Standing observation from the earlier audit, still true: the demo was built fast and works, but
several load-bearing claims (800+ workers, three ISO certs) are unverified and several pages
show placeholders. The gap between "usable demo" and "site the company can send to a buyer" is
assets and form delivery, not code.

## Phase 0: Pre-flight [Status: DONE]

- [x] Client supplied source material (contact details, service scope, WhatsApp number)
- [x] Scope agreed: bilingual marketing site, no backend beyond the contact form
- [x] Deployment decided: static `dist/`, servable from any web server
- Gate: user confirms "we're building this" — **passed (demo round, 2026-08/09)**

## Phase 1: Foundation [Status: PARTIAL]

- [x] Site builds and is navigable: 13 static pages, 5.9s build
- [x] Data-driven content (`src/data/*.json`) with bilingual keys
- [x] Git repo repaired and real import committed 2026-10-17
- [x] **Homepage redesigned as the site-wide design reference** (2026-10-17). Industrial-corporate
      system replacing the AI-template layout: masthead nav (utility strip + main bar, fixes the
      logo/link collision and the missing mobile brand name), asymmetric content-height hero,
      capability ledger instead of a card grid, operations section with image slots, sectors index,
      statement-led footer. Emoji icons, section eyebrows, gradient surfaces, duplicate panels and
      the invented stat band are gone. Tokens added for warm paper/ink/rule; image slots
      (`.slot`) hold the exact space approved photography will occupy.
- [x] prd.md, architecture.md, rules.md, phases.md, design.md written this date
- [x] memory.md written
- [x] SHOOT-LIST.md written — client photography + brand asset brief, incl. the claims checklist
- Gate: 6 docs complete — **passed 2026-10-17**

## Phase 1.5: Roll the reference design across the other 12 pages [Status: PENDING — next up]

The homepage is the agreed visual reference; the interior pages still carry the old template.

- [ ] Apply the system to `about`, `services`, `industries`, `workforce`, `clients`, `careers`,
      `contact`, `hse`, `gallery`, `certificates`, `news`, `ar/index`
- [ ] Remove the remaining per-page tells: the identical `pt-32 pb-16` gradient hero band (×11),
      emoji/numbered section labels, centred section heads, duplicated service panels
- [ ] Replace card grids with ledger/index layouts where density allows
- [ ] Swap icon placeholders for document scans on Certificates once assets land
- Dependencies: none (homepage reference approved)
- Gate: all pages share one system, no interior page still opens with the old gradient band

## Phase 2: Fix the lead path [Status: PENDING — next up]

The one phase that changes the site's business value. Everything else is polish by comparison.

- [ ] Client decision: which inbox/number receives leads (WhatsApp stays as secondary path)
- [ ] Form posts to a hosted form service (Web3Forms-style), honeypot + spam filtering on
- [ ] Success message reflects reality (sent vs "opens WhatsApp" vs validation failure)
- [ ] Verified by hand: a real submission reaches the inbox; a bot submission is filtered
- [ ] Remove the four unused deps (`gsap`, `react-hook-form`, `zod`, `@hookform/resolvers`)
      or use them, per `rules.md`
- [ ] Delete or fix the dead `src/i18n/` files (imported nowhere, Arabic strings contaminated)
- Dependencies: Phase 1
- Gate: `astro check` green, one real test submission reaches the company, evidence recorded

## Phase 3: Client assets and claims [Status: BLOCKED — on the client]

Because the demo used placeholders, assets are the critical path for go-live.

- [ ] Real client names into `clients.json` (carousel + homepage trust block re-appear)
- [ ] Photography: workforce, accommodation, transport, projects, training, office (gallery
      placeholder tiles say what's needed)
- [ ] Certificate scans and verification of ISO 9001/14001/45001 claims (certificates page
      stays text-only until documents exist — rules.md forbids badge embeds on unverified claims)
- [ ] Fact-check pass on every page's numbers ("800+", client counts) against company reality
- [ ] Arabic speaker reviews all current Arabic strings (the 2026-10-17 contamination audit is
      evidence that nobody has)
- Dependencies: Phase 2 for the truth rules, none for asset collection itself
- Gate: every placeholder eliminated or explicitly scheduled with the client's sign-off

## Phase 4: Arabic subpages [Status: PENDING]

- [ ] Decision: build the 12 `/ar/` pages, or hide the switcher until they exist
- [ ] If building: 12 pages × EN/AR content, RTL layouts verified, real Arabic copy
      (not machine translation without review)
- [ ] hreflang alternates emitted in `<head>` (missing today, required for AR SEO in Qatar)
- Dependencies: Phase 3 (translation needs verified copy to translate)
- Gate: every nav link resolves to real Arabic content under `/ar/`

## Phase 5: Launch [Status: PENDING]

- [ ] Domain + DNS + host chosen (Cloudflare Pages or client hosting; no server needed either way)
- [ ] Uptime monitoring on the domain
- [ ] Form delivery reVerified end-to-end from the production domain
- [ ] Web3Forms-style Allowed Domains configured (if that service is used) so the form can't
      be abused from other sites
- [ ] `astro check` + smoke test in a `verify` script, mirroring TEW
- [ ] Client accepts handover
- Dependencies: Phases 2-4
- Gate: user confirms go-live

## Current Phase

**Phase: 1.5 → 2**
**Next Task: roll the approved homepage design across the other 12 pages, in parallel with the
client decision on lead delivery (Phase 2).**

Two threads now run in parallel:
- **Design** — the homepage is the agreed reference; Phase 1.5 propagates it.
- **Revenue** — the WhatsApp-only form is still the highest-value functional gap (Phase 2).
- **Assets** — `SHOOT-LIST.md` went to the client 2026-10-17; Phase 3 is blocked on it.
