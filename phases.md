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

## Phase 1.5: Roll the reference design across the other 12 pages [Status: DONE — 2026-10-17]

The homepage is the agreed visual reference; the interior pages carried the old template.

- [x] Applied the system to all 12: `about`, `services`, `industries`, `workforce`, `clients`,
      `careers`, `contact`, `hse`, `gallery`, `certificates`, `news`, `ar/index`
- [x] Two new shared components so the pages read as one site: `PageHeader.astro` (navy + grid
      texture, breadcrumb, title, lead, right-aligned context line) and `CtaBand.astro` (closing
      CTA). Every old `pt-32 pb-16` gradient hero band is gone.
- [x] Card grids replaced with ledger/index layouts: 12-column hairline rows used for services,
      industries, workforce categories, values, HSE commitments, news and vacancies
- [x] Per-page tells removed: the duplicated navy service panel (services ×2 → one), the invented
      stat bands on clients and hse, "Coming Soon" gallery tiles, cert-claim icon cards
      (now document slots), per-section emoji/numbered labels
- [x] Certificates page: icon tiles → document slots, with a visible "number & expiry on file"
      line per certificate rather than an unverified badge
- [x] **Design bug found by rendering, not by reading:** the interior CTA band and the navy footer
      both carried a gold button, so pages ended with two identical "Request Manpower" buttons
      stacked. The CTA band is now light-ground with navy buttons. Rule adopted: gold on dark
      grounds (hero, footer), navy on light grounds.
- [x] Contact form honesty bug fixed: `ContactForm.tsx` claimed "message sent successfully" even
      when the visitor cancelled the WhatsApp popup. Now it only reports success if a window
      actually opened, and the copy says WhatsApp was opened rather than that a message was sent.
- [x] Careers page: the fake drag-and-drop CV uploader was removed. It never uploaded anything.
      Replaced with accurate copy ("attach your CV in the WhatsApp chat") and the dead control is
      gone.
- [x] HSE page: the mid-page "Request the HSE pack" button duplicated the CTA band immediately
      below it; the section was folded into the CTA band.
- [x] News page: unverified claims removed from the three sample entries (the "800+ professionals"
      headline and the "ISO 45001 certification achieved" headline). Sample entries now assert
      nothing. Verified in the built HTML: zero occurrences of "800+".
- [x] **Arabic content repair.** A contamination audit of `src/data/*.json` found machine-
      translation damage in strings that render on the Arabic homepage: a CJK run inside
      `services.json[0].descriptionAr`, French "maintenant" in `[…].descriptionAr` (also in
      `workforce.json` user-facing strings), a broken UTF-8 escape that had destroyed
      "Quantity Surveyors" into `م UTF-8 قيمون`, raw English tokens ("engineers", "personnel",
      "orporate"), misspellings ("الكادرة" → "الكوادر", "يمكين" → "يمكّن", "الهيكليه"), and
      nonsense words ("ربّاطجيون", "السبك" for MEP). All repaired. `i18n/ar.json` is still dead
      code but is no longer a contaminated landmine.
- [x] Arabic typography rule added to `global.css`: Arabic script must never be letter-spaced, so
      every tracking utility is neutralised under `[dir="rtl"]` — tracking on Arabic breaks the
      cursive joins between letters.
- Verified by rendering every page in headless Firefox (1440px) and reading the screenshots:
      build 13 pages / 6.6s; 371 internal links, 0 broken; no "Coming Soon", Lorem, placeholder
      service, dead `href="#"`, gradient-text or emoji left anywhere in `dist/`.
- Not done (deferred, deliberately): `astro check` needs `@astrojs/check` + `typescript` installed
      and there is no network-independent way to add them here — it is recorded as a Phase 2 gate.
- Dependencies: none (homepage reference approved)
- Gate: all pages share one system, no interior page still opens with the old gradient band —
  **passed 2026-10-17**

## Phase 1.6: Head, crawl surface and fonts [Status: DONE — 2026-10-22]

None of this was client-blocked, and all of it was invisible from the page itself: the site
looked finished while every shared link rendered as a bare URL and the crawler had no
canonical to work from.

- [x] **Canonical on every page** — absolute and self-referential, derived from the built
      path in `BaseLayout.astro`. The 404 deliberately carries none, because it is served
      for arbitrary paths.
- [x] **Share card** — `og:image` (generated 1200×630, `scripts/make-og-image.py`), `og:url`,
      `og:image:alt`, `twitter:card`. WhatsApp is where every enquiry starts, so a link with
      no card was the most expensive missing tag on the site.
- [x] **`hreflang`** for the `/en/` ↔ `/ar/` homepage pair, with `x-default`. Interior pages
      carry none on purpose — there is no Arabic version of them to point at.
- [x] **`robots.txt`** naming `sitemap-index.xml`; **sitemap filtered** so the `/` redirect
      and the 404 are no longer advertised as content.
- [x] **`404.html`** (needs `error_page 404 /404.html;` in the nginx template — documented in
      `DEPLOY.md`, not yet applied).
- [x] **Fonts self-hosted** — three families, seven woff2 files, 387 KiB on disk, fetched and
      their `@font-face` rules generated by `scripts/vendor-fonts.mjs` (unicode-ranges copied
      from Google, not hand-written). The render-blocking `@import` from fonts.googleapis.com
      is gone; each page preloads only the two faces it paints with, and Arabic pages preload
      Noto instead.
- [x] **Organization JSON-LD** — one node with `@id`, `email`, `image`, and an Arabic
      description on Arabic pages. Previously a second, English-only organisation was
      repeated on all 13 pages.
- [x] **`npm run check:build`** — reads `dist/` and fails on a missing/incorrect canonical, a
      share card pointing nowhere, hreflang on a page with no translation, a reintroduced
      Google Fonts reference, a font file referenced but absent, an og image at the wrong
      size, or a sitemap entry for the redirect. **Every check was proven by injecting the
      fault** (deleted robots.txt, retargeted canonical, re-added Google Fonts, resized the
      card) and watching it fail, then restoring.
- [x] Verified in a real browser: fonts report `loaded`, both families pass
      `document.fonts.check`, every woff2 returns 200, zero console errors on EN, AR and 404.
- Not done here, and still open: the four unused deps and the dead `src/i18n/` files below.

## Phase 1.7: The client's own logo, and the palette it carries [Status: DONE — 2026-10-22]

The site had been wearing a mark nobody drew for the client: a geometric arc and a gold
keystone. The real logo existed the whole time, in the ZIP of the old PHP site.

- [x] **Found the real artwork.** `assets/img/logo/logo.png` (350×60) is the header lockup from
      the old site's `navbar.php`; `assets/img/png-icon/logo-element.png` (1193×839) is the globe
      alone with a real alpha channel. No vector exists anywhere, so the raster is the source of
      truth — not a redraw, not a trace.
- [x] **Palette sampled, not guessed.** The logo is four colours: indigo `#0c0b61`, red
      `#f40410`, black, white. The owner's hexes were checked against the pixels (the artwork
      actually holds `#f40814` / `#0b0a60`; the owner's values are used as tokens, a 1–2 unit
      difference nobody can see).
- [x] **`scripts/prepare-brand.py`** builds `public/brand/`: white ground → real alpha, every
      pixel snapped to the four colours, 2× lockup for retina, white variants for dark grounds,
      favicon + apple-touch-icon. It aborts if the cleaned asset drifts from the source
      (0.6/255 measured), which is the only honest check that cleaning did not redraw the logo.
- [x] **Header/footer/OG/favicon** all carry the real lockup. The footer uses the derived white
      variant because the navy globe and black wordmark vanish on the navy ground.
- [x] **Full palette swap.** Indigo `#0c0b61` for headings and every dark ground (`bg-ground`),
      brand red for accents, white paper, black ink; gold removed everywhere. The old rule
      "gold on dark, navy on light" became "red on dark, indigo on light".
- [x] **Three reds, for a measured reason.** Brand red is 4.31:1 on white and 3.94:1 on navy —
      fine for marks and 40px numerals, an AA failure for a button label or an 11px eyebrow.
      Buttons use `#d4030f` (5.50:1), small red text on light uses `#b80210`, small labels on
      navy use the `#ff4b52` tint (5.15:1).
- [x] **`check:build` grew two gates:** brand assets exist at their exact pixel sizes and every
      page renders the lockup; and 15 text/background pairs imported live from
      `tailwind.config.js` are held to AA. Both were proven by injecting the fault (deleted
      `lockup.png`; lightened `ink-muted` to `#9a9aa8`) and watching them fail.
- [x] Verified in a browser at 1440, 1024, 390 and in RTL: lockup loads at its natural 680×118,
      no 4xx resources, fonts `loaded`, no console errors on EN, AR or 404.
- **The lockup's name won.** With the real logo in the header, "Cromton Group" in the copy
  became an obvious mismatch rather than a subtle one. The owner confirmed the artwork is
  correct, so the whole site was renamed to **Crompton International** the same day — see the
  correction entry in `memory.md`.

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
- [x] ~~smoke test in a `verify` script~~ — `npm run check:build` asserts canonical, social
      card, hreflang, fonts, robots and sitemap on the built output (2026-10-22)
- [ ] `astro check` — still needs `@astrojs/check` + `typescript` installed; typecheck is not
      covered by `check:build`
- [ ] Client accepts handover
- Dependencies: Phases 2-4
- Gate: user confirms go-live

## Current Phase

**Phase: 2**
**Next Task: the client decision on lead delivery — which inbox or number receives enquiries. That
single answer unblocks the highest-value functional gap on the site.**

Three threads now run in parallel:
- **Revenue** — the WhatsApp-only form is the highest-value functional gap. Phase 2 needs a client
  answer (which inbox/number). Code work can start before that answer lands: hosted form service,
  honeypot, spam filtering. The `verify` half of that is done — `npm run check:build` now asserts
  the built output (Phase 1.6).
- **Assets** — `SHOOT-LIST.md` went to the client 2026-10-17; Phase 3 is blocked on it. Every image
  slot on every page is still waiting on the same shoot.
- **Design** — Phase 1.5 and 1.7 done. The system is consistent site-wide and now wears the
  client's own logo and colours, so further design work is refinement rather than rollout. The
  open design question is not ours: whether the header should keep the legacy wordmark
  ("Crompton International") or switch to a lockup typeset with the current name. The owner
  chose the legacy lockup on 2026-10-22; it stays until the client says otherwise.

Outstanding from the design round, for whoever picks it up next:
- The Arabic site is still homepage-only (`/ar/` has one page); navbar and footer links from the
  Arabic page fall back to `/en/`. Either build the 12 Arabic pages (Phase 4) or hide the
  language switcher. `hreflang` currently covers only the homepage pair for the same reason.
- Photography is the binding constraint on "does this look like a real company". The code is
  ready; the slots are labelled and sized. No amount of further CSS work substitutes for the
  shoot.
- `gsap`, `react-hook-form`, `zod`, `@hookform/resolvers` are still installed and unused, and
  `src/i18n/` is still dead code. Phase 2 cleanup.
- **This round is built, not deployed.** Production still serves the pre-2026-10-22 build; the
  owner-run nginx deploy has to happen for canonical, the share card, fonts and the 404 to be
  live. That deploy also needs `error_page 404 /404.html;` in the nginx template.
