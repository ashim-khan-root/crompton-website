# Design System

Design tokens live in `tailwind.config.js` (source of truth for Tailwind classes) and
`src/styles/global.css` (CSS custom properties + fonts). This document records intent and
constraints; the config files are the implementation contract.

## Brand

Crompton International — manpower supply, Doha. The visual language is corporate-industrial. The
logo is the client's own artwork and keeps its own colours (a red globe stroke and an indigo
wordmark); the *site around it* is a navy ground with one warm accent, black text on white paper.
Keeping those two ideas separate is what lets the theme change without redrawing the logo.

The theme was red-and-indigo for a few hours on 2026-10-22 and read as alarm rather than
corporate. The owner asked for navy and "a little orangish". So the accent moved one step warm
and the ground moved from indigo to true navy:

| Token | Value | Use |
|---|---|---|
| `primary.500` | `#0c2340` navy | headings, nav, primary buttons (15.79:1 on white) |
| `ground` | `#0c2340` navy | every full-bleed dark section: utility strip, hero, page headers, footer |
| `primary.600-900` | `#0a1d36` → `#040e1a` | insets and depth *inside* a dark ground |
| `secondary.400` | `#e8621c` warm accent | marks, rules, big stat numerals, icons, the accent button fill. 3.39:1 on white, 3.09:1 on `paper-2` — graphics and large type only |
| `secondary.500` | `#b84916` | accent text where the 400 is too light; `5.25:1` on white, `4.78:1` on `paper-2` |
| `secondary.600/700` | `#a53f12` / `#93380f` | small accent text on light grounds (`6.33:1` / `7.46:1`) |
| `secondary.300` | `#ff8a4c` | small labels and icons on the navy ground (`6.76:1`) |
| `accent` | `#a53f12` | links |
| `paper` / `paper-2` | `#ffffff` / `#f4f4f8` | page / inset surface |
| `ink` / `ink-muted` / `ink-faint` | `#000000` / `#4b4b5a` / `#6b6b7a` | body / secondary / labels |
| `rule` | `#e2e2ea` | hairlines |

**Why the accent is one hue with four steps.** `#e8621c` is `3.39:1` on white: right for a rule,
a 40px numeral or an icon, and a WCAG AA failure for a 15px label. So `400` is the brand value and
never carries small text; `500` carries accent text on light grounds, `600/700` set the smaller
and denser text, and `300` is the tint for 11px uppercase labels on navy, where the warmer steps
fall below 4.5:1. `npm run check:build` imports this config and fails if any of those pairs drops
below 4.5:1, so a future tint cannot quietly break it.

**The accent button is navy on orange, not white on orange.** White on `secondary.400` is
`3.39:1` and would fail AA at button size; navy on it is `4.63:1` and passes, and it keeps the
button the colour of the accent instead of darkening it to brown. `.btn-accent` therefore sets
`bg-secondary-400` + `text-primary-500`, and hovers to `secondary.300`.

There is one deliberate scale quirk: `primary.50-300` are light navy *tints* for UI, while `500`
is the brand value and `600-900` run darker. It is not a monotonically lightening ramp — take new
colours from the existing values rather than inventing hexes.

Gold is gone. The old rule "gold on dark grounds, navy on light grounds" is now **warm accent on
dark grounds, navy on light grounds**: a light-ground page uses `.btn-primary` (navy) and the navy
footer below it uses `.btn-accent` (orange), so a page never ends with two identical buttons
stacked.

The logo assets are the exception to all of this: `public/brand/*` keeps the artwork's own
`#f40410` and `#0c0b61`. `scripts/prepare-brand.py` snaps pixels to *those* values, not to the
theme's navy, because cleaning the client's file must not recolour the client's brand. Only the
favicon tile behind the mark uses the site navy (`#0c2340`).

## Logo

- The header lockup is the **client's own artwork**, not a redraw: `assets/img/logo/logo.png`
  (350×60) from the legacy site's ZIP, with the globe alone available at 1193×839 in
  `assets/img/png-icon/logo-element.png`.
- `python3 scripts/prepare-brand.py --source <extracted legacy site>` regenerates everything in
  `public/brand/`: the white ground is turned into real alpha, every pixel is snapped to the
  four brand colours, the lockup is cut at 2× for retina, and the script aborts if the cleaned
  result drifts more than 12/255 from the source (it currently sits at 0.6/255).
- `lockup-white.png` / `mark-white.png` are **derived** variants for dark grounds — all ink
  becomes white with the red swoosh kept, because the globe's navy half and the black wordmark
  disappear on navy. Using the colour asset on a dark ground is a bug, not a variant.
- Sizing: 40px tall on desktop, 32px on mobile, from a 680×118 asset. There is no vector
  source, so do not display it much above ~1.5× its natural size.
- **Settled 2026-10-22: the lockup's name is the company's name.** For a day the site carried
  "Cromton Group" (a misreading of the artwork, "no p") while the logo said *Crompton
  International — Trading & Contracting Company WLL*. The owner confirmed the artwork is
  correct, so the whole site now follows it: `Crompton International`, legal form
  `Crompton International Trading & Contracting Company W.L.L.`, Arabic
  `كرومبتون إنترناشونال للتجارة والمقاولات ش.م.م`. A "Cromton" in code is stale, not a style.


## Typography

| Role | Face | Notes |
|---|---|---|
| Headings | Plus Jakarta Sans (500–800) | `font-heading` |
| Body | Inter (300–700) | `font-body` |
| Arabic | Noto Sans Arabic (300–700) | applies via `[dir="rtl"]` selectors — Arabic pages and any RTL context get the Arabic face automatically for body and headings |

All three are **self-hosted** from `public/fonts/` with `display:swap`, declared in
`src/styles/fonts.css`. They are downloaded and the CSS generated by
`node scripts/vendor-fonts.mjs`; the unicode-ranges in that file come from Google's own
CSS rather than being written by hand. The site previously used a render-blocking
`@import` from fonts.googleapis.com — re-adding one is a regression, and
`npm run check:build` fails on it.

## Bilingual / RTL rules

- Arabic is not "the same site mirrored with different strings": body and heading fonts swap on
  `[dir="rtl"]`, and layout must be checked mirrored (nav order, form alignment, icon positions)
- Every English content string needs an `*Ar` sibling key in the same data file — half-filled
  bilingual content is what produced the dead `src/i18n/` files
- Arabic ships only once a native reviewer has signed off: no machine translation goes live
  unreviewed (the 2026-10-17 contamination audit found Chinese/French tokens embedded in
  Arabic strings)

## Components

- `Navbar.tsx` — sticky, `client:load`, lang-aware links (falls back `/ar/` → `/en/`)
- `Footer.tsx` — contact block, quick links, hardcoded phone/WhatsApp/address (PRD-verified)
- `ContactForm.tsx` — two variants via `type` prop: `contact` and `manpower` (adds job-category
  select + headcount). WhatsApp deep-link submit; styled via Tailwind utility classes
- `ClientCarousel.tsx` — renders only when `clients.json` is non-empty (deliberate)
- `StatsCounter.tsx` — animated counters; values must satisfy the content-truth rules
- `WhatsAppButton.tsx` — floating CTA, bottom corner
- Reusable classes in `global.css`: `.btn-primary` (navy), `.btn-accent` (warm accent), `.btn-ghost`,
  `.btn-outline`, `.container-custom`, `.rule`, `.slot` / `.slot-dark` (labelled placeholders)
- Dark sections are flat `bg-ground` with a faint grid texture, not a gradient — depth comes
  from `primary-800/900` insets and hairlines, never from a second accent colour

## Imagery

- Real photography is required for: workforce, accommodation, transportation, projects,
  training, office (gallery categories double as the shot list)
- Certificates may be shown as scans only after client documents verify the claims
- No stock photography (rules.md). Placeholder tiles carry fixed aspect ratio + "Coming Soon"
  label so they're obvious in review
- Alt text required on every image, describing the actual subject

## Motion

- Tailwind keyframes: `fade-in`, `slide-up`, `slide-in-left/right`, `counter` (stats)
- Motion is ambient, not blocking: nothing may gate reading or interaction. `gsap` was installed
  for richer animation and never used — current animation set is sufficient, do not reach for it
- `html { scroll-behavior: smooth }` is global; anchors scroll, nothing else animates position
