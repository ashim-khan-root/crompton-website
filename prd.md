# Project Requirements Document

Client: Crompton International — manpower supply and workforce solutions, Doha, Qatar
Project: `projects/crompton-website/`
Status: usable demo, content-incomplete. Git repaired 2026-10-17 (prior .git had no objects/refs; full history starts at commit `7630f30`).

## Overview

A bilingual (EN/AR) marketing and lead-capture site for a Qatar manpower-supply company. The
site's job is to prove capability to commercial buyers — white-collar and blue-collar staffing,
project-based workforce, recruitment and payroll — and convert that proof into contact. The
conversion paths are a contact form, a manpower-request form variant, phone and WhatsApp.

It is built as a static Astro site so it can be served from anywhere with zero server cost, and
so a sales conversation can start from a link the client can send in a tender reply.

## Audience

Primary: procurement, HR and project managers at Qatari construction, industrial and facility
management companies who need verified workers fast.
Secondary: job seekers looking for positions in Qatar.

## User Stories

- As a procurement manager, I want to see service categories and industries covered at a glance,
  so I can decide within 30 seconds whether Crompton International supplies my requirement.
- As a client coordinator, I want to send a manpower request (role + quantity) directly from the
  site, so that I don't have to draft an email from scratch.
- As a job seeker, I want to see open roles and apply, so that I know where to send my CV.
- As an Arabic-speaking buyer, I want the site in Arabic, so that I can evaluate the company in
  my working language.
- As a compliance officer, I want evidence of licenses and certifications before shortlisting.

## Functional Requirements

- [x] 12 content pages in English (about, services, industries, workforce, clients, careers,
      contact, hse, gallery, certificates, news) plus home
- [x] Arabic homepage at `/ar/`
- [x] Language switcher in navbar
- [ ] Arabic sub-pages (12 more pages) — the switcher currently navigates to English fallbacks
- [x] Contact form with company/phone/email/message fields
- [x] Manpower request form variant with role category and headcount fields
- [ ] Form submissions delivered somewhere the company actually reads — **the form currently
      opens WhatsApp with a prefilled message; there is no backend, email, or CRM**
- [x] WhatsApp floating button, click-to-call phone links
- [ ] Client logo wall (data file exists, `clients.json` is empty by deliberate decision — see
      Known blockers)
- [ ] Photo gallery (placeholder tiles, awaiting client photos)
- [ ] Certificate scans / verifiable badges (awaiting client documents)
- [ ] News section with real posts (3 hardcoded entries inline, no CMS)
- [ ] Job listings connected to an intake channel other than email

## Non-Functional Requirements

- Performance: static output, no server round trips for content; Google Fonts via CDN with
  `display=swap`. Target LCP < 2.5s on 4G. Images are the known risk once real photography lands.
- SEO: per-page title/description, OG tags, sitemap, `https://cromptonqatar.com` canonical base.
  hreflang alternates are missing (see Known blockers).
- Accessibility: semantic landmarks, labelled form fields, focus styles via Tailwind defaults.
  No automated a11y test yet.
- i18n: EN/AR strings live beside content as `*Ar` keys in `src/data/*.json`. Arabic body text
  uses Noto Sans Arabic via `[dir="rtl"]` selectors.
- Scalability: content lives in JSON data files, not templates; new pages are new files.

## Success Criteria

- [ ] A real buyer enquiry reaches the company (not just WhatsApp) at least once
- [ ] Client review completed: all 12 EN pages fact-checked against company reality
- [ ] Arabic全覆盖 (full coverage) or the switcher hidden until it exists
- [ ] Zero placeholder tiles ("Coming Soon") visible on the live site
- [ ] Certificate claims (ISO 9001/14001/45001, Qatar Civil Defence) verified against documents

## Out of Scope

- No e-commerce, no login, no pricing.
- No CMS for news/jobs — JSON files are the CMS until volume justifies one.
- No i18n routing framework beyond Astro's built-in locale prefixes.
- No server adapter. If the form needs a real endpoint, use a hosted form service (Web3Forms or
  equivalent) so the deployment stays 100% static.

## Known blockers

- **Empty `clients.json` is deliberate.** Fabricated client names were removed after an earlier
  audit (see `.agent/daily.md` 2026-09 session). Real names get dropped into the JSON and the
  carousel renders them; do not re-add placeholder companies.
- **Form delivery needs a company decision**: which inbox/number receives leads, and whether
  WhatsApp handoff stays as a secondary path (recommended: keep it, add form delivery).
- **Arabic contamination found 2026-10-17**: `src/i18n/ar.json` and `src/data/services.json`
  contain machine-translation artifacts (Chinese `其他`, French `maintenant` embedded in Arabic
  strings). `src/i18n/{en,ar}.json` are also **dead code — imported nowhere**. Fix or delete
  during the form/Arabic phases.
- `DEPLOY.md` references `/home/aiworker/ai-worker/crompton-website/` — stale path from the
  remote worker host; this project lives at `projects/crompton-website`.
- `react-hook-form`, `zod`, `@hookform/resolvers`, `gsap` are in `package.json` but unused.
