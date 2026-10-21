# Architecture

## Tech Stack

- Framework: Astro 5.18, static output (`output` defaults to `'static'`; no adapter)
- Islands: React 19 via `@astrojs/react`, hydration with `client:load` on interactive components
- Styling: Tailwind 3.4 via `@astrojs/tailwind`, design tokens in `tailwind.config.js`
- Forms: none server-side. `ContactForm.tsx` composes a WhatsApp deep link client-side
- Build/deploy: static `dist/`, served by nginx on the VPS behind a Cloudflare Tunnel. No server build step; see `DEPLOY.md`
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
├── DEPLOY.md              production deploy path, rollback and verification
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

- Runtime: Node 24.x + npm 11 (verified v24.21.0 / 11.19.0 on the VPS, 2026-10-21). No
  containers for the site itself. Python 3 stdlib `http.server` is a local-preview fallback only
- Env vars & secrets: none required
- Data storage & backup: none server-side (static). The git repo is the artifact. Remote is
  `github.com/ashim-khan-root/crompton-website` (public); production is a rebuild of a commit
  on that remote, not a hand-copied folder
- CI/CD: none. Manual loop: push on the workstation → `git pull --ff-only` + `npm run build` on
  the VPS → owner runs the deploy script. There is no `check`/`test` script in `package.json`;
  `astro check` needs `@astrojs/check` + `typescript`, which are not installed. Add that before
  treating "build passes" as "content is verified"
- Deploy & rollback: `deploy/scripts/deploy-static-site.sh` (lives in the `dev-agency` repo)
  replaces `/var/www/cromtongroup.com/html`, rewrites the nginx site file and reloads nginx.
  Rollback = re-deploy the previous `dist/` or restore a backup; see `DEPLOY.md`
- Monitoring: none. For a static marketing site, uptime monitoring on the host is enough

## Known rendering rules

- Astro i18n routing is `prefixDefaultLocale: true` — EN lives under `/en/*`, not `/`
- Google Fonts is a render-blocking external; if LCP regresses when real images land, move to
  `@fontsource` self-hosting
- `vite.ssr.noExternal: ['lucide-react']` is required by the React islands — don't remove it
