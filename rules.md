# Development Rules

## Code Style

- Framework conventions win: `.astro` pages, `.tsx` islands, `.json` data files
- Naming: kebab-case for pages and data files, PascalCase for React components, camelCase   
  variables. Bilingual keys use the `*Ar` suffix (`titleAr`, `descriptionAr`) — keep that
  convention for any new content field
- No TypeScript strictness anywhere yet (there is no `tsconfig`-level checking in the build);
  adding `astro check` is a prerequisite for any rule claiming type safety. Until then, tests
  by build, not by type checker

## Rendering rules

- The site is fully static. Do not add a server adapter. The one candidate for a runtime is a
  form endpoint; if that happens, prefer a hosted form service over an adapter, and say in the
  commit why the hosted path was rejected
- Verify changes against the built `dist/` HTML, never against `astro dev` — dev renders
  on demand and hides missing content. Grep `dist/` for a phrase from the changed page
- Build must stay green after every change: `npx astro build`. There is no stronger automated
  check yet; treat "build passed" as the minimum bar, not proof of correctness

## Content truth rules (same standard as TEW)

- **No numeric or certification claim ships without client confirmation.** This covers the
  "800+ professionals" stat, ISO 9001/14001/45001 claims, the client-count numbers, and any
  "in-house" or "no outsourcing" statement. The values currently in `src/data` were written
  for the demo round and must be re-verified before real launch
- **Never re-add fabricated client names.** `clients.json` was emptied deliberately after the
  2026-09 audit. Real names land in the JSON when the client provides them, and the homepage
  "Trusted by" block and `/en/clients` both already render conditionally on a non-empty list —
  do not hardcode a placeholder company to make the carousel look alive
- No stock photography. Placeholder blocks keep a fixed aspect ratio and an explicit label
- Arabic content must be **real Arabic**. The 2026-10-17 audit found Chinese (其他) and French
  (maintenant) tokens embedded inside Arabic strings in `src/i18n/ar.json` and
  `src/data/services.json` — that's what machine translation output looks like when nobody
  checks it. Any Arabic string you write or import, you or a reviewer must be able to read

## i18n rules

- Arabic is incomplete: only `/ar/` exists. Do not ship the lang switcher on pages it
  cannot serve → the switcher currently falls back to `/en/`, which is acceptable navigation
  but not acceptable as an "Arabic site" claim. Do not call the site bilingual in client
  communication until sub-pages exist or the switcher is hidden
- New text areas must ship `*Ar` keys from day one, same as the existing data files

## Git workflow

- Branch: `feat/`, `fix/`, `chore/` prefixes off `main`
- Commits: imperative subject, one logical change. Import history started 2026-10-17
  (`7630f30`) — the prior .git shell was corrupt, so there is no history before this
- Never commit `node_modules/`, `dist/`, or `.astro/` (gitignored)
- Update `memory.md` after any decision and `phases.md` after any phase change

## Form rules (until a real endpoint exists)

- The WhatsApp deep link is the only delivery path. Do not present the success message
  ("message sent successfully") as reliably delivered anywhere else — it currently fires even
  when the user cancels the WhatsApp tab. Fixing this is part of the form phase, not a bug to
  carry into launch
- Before go-live: honeypot + service-side spam filtering are mandatory on any public form
- Client-side validation only today (there is no server). The moment any endpoint exists,
  re-validate server-side too

## Must follow

- [ ] Verify content changes by grepping built `dist/` HTML, not the dev server
- [ ] Never commit a real secret — the site needs none
- [ ] No new dependency without a user-visible reason; `gsap`, `react-hook-form`, `zod`,
      `@hookform/resolvers` are already unused and are slated for removal, not use
- [ ] Back up before any destructive/data-loss operation (git is the backup; there is no remote)
- [ ] Verify a phase gate with evidence before marking it passed
- [ ] Update `memory.md` after any decision, and `phases.md` after any phase change
