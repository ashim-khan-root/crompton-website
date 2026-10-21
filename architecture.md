# Architecture

## Tech Stack

- Framework: Astro 5.18, static output (`output` defaults to `'static'`; no adapter)
- Islands: React 19 via `@astrojs/react`, hydration with `client:load` on interactive components
- Styling: Tailwind 3.4 via `@astrojs/tailwind`, design tokens in `tailwind.config.js`
- Forms: none server-side. `ContactForm.tsx` composes a WhatsApp deep link client-side
- Build/deploy: static `dist/`, servable by nginx/Caddy/python http.server. No server build step
- Fonts: Google Fonts CDN (Inter, Plus Jakarta Sans, Noto Sans Arabic)

## Directory Structure

```
crompton-website/
├── src/
│   ├── components/        React islands: Navbar, Footer, ContactForm, ClientCarousel,
│   │                      StatsCounter, WhatsAppButton
│   ├── data/*.json        content as data: services, industries, workforce, jobs, clients
│   ├── i18n/              en.json, ar.json — DEAD CODE, imported nowhere; fix or delete
│   ├── layouts/BaseLayout.astro  head/meta/OG per page
│   ├── pages/
│   │   ├── en/*.astro     12 EN pages
│   │   ├── ar/index.astro only the AR homepage exists
│   │   └── index.astro    / → redirects to /en/
│   └── styles/global.css  tokens, fonts, component classes
├── dist/                  build output (gitignored, servable as-is)
├── public/                static assets — favicon.svg only today
├── DEPLOY.md              demo deployment instructions (stale ai-worker path inside)
├── prd.md, architecture.md, rules.md, phases.md, design.md, memory.md
└── astro.config.mjs       site=cromtongroup.com, i18n en+ar prefixDefaultLocale
```

## Data Flow

Build-time only. `.astro` pages import `src/data/*.json` and render static HTML. The React
islands hydrate for interaction (navbar, carousel, stats, form) but all content the buyer reads
is in the initial HTML.

Fallback routing: Arabic sub-pages do not exist, so navbar/footer links from `/ar/` point to
`/en/` equivalents (patched in the 2026-09 session; see memory). This is why the site is
navigable without 404s despite 12 of 13 Arabic pages missing.

The form's "submission" is `window.open('https://wa.me/97455019646?text=…')` — there is no data
flow to any server. Treat the lead as unconfirmed until a real endpoint exists.

## API Design

None. When form delivery is added, target shape is a hosted form service (Web3Forms-style):
static site POSTs JSON/FormData, service emails the inbox. Access key is public by design;
 Allowed Domains config is the perimeter once the account exists.

## Security Model

- No auth, no storage, no PII leaves the user's device unless they complete WhatsApp handoff
- Form: no honeypot, no spam protection yet — required before go-live, since a public static
  form gets scraped. Honeypot field + service-side filtering, per the TEW rules as precedent
- claimed certs (ISO 9001/14001/45001) are text-only until documents arrive; do not add images
  or badge embeds before documents verify
- `OPENCODE`-style secrets: none. The site should never need one

## Environment & Operations (DevOps layer)

- Runtime: Node 26.x + npm, dev on the vtsq workstation (AlmaLinux 9.8). No containers for the
  site itself. Python 3 stdlib http.server is the demo fallback server (`DEPLOY.md` Option C)
- Env vars & secrets: none required
- Data storage & backup: none server-side (static). The git repo is the artifact. Remote backup
  does not exist yet — repo is local-only (`7630f30` is the only commit)
- CI/CD: none. Manual: `npx astro build`. There is no `check`/`test` script in package.json —
  add `astro check` + a smoke test before treating anything as verified (TEW has a `verify`
  chain this should mirror)
- Deploy & rollback: copy `dist/` to any static host. Rollback = re-deploy previous `dist/`.
  For a real domain, put nginx/Caddy/Cloudflare in front
- Monitoring: none. For a static marketing site, uptime monitoring on the host is enough

## Known rendering rules

- Astro i18n routing is `prefixDefaultLocale: true` — EN lives under `/en/*`, not `/`
- Google Fonts is a render-blocking external; if LCP regresses when real images land, move to
  `@fontsource` self-hosting
- `vite.ssr.noExternal: ['lucide-react']` is required by the React islands — don't remove it
