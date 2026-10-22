# Legacy asset import — what was used, and what was refused

**Date:** 2026-10-21 · **Source:** `crompton-website.zip` (old CodeIgniter site)

The client supplied the previous PHP site as a ZIP. It is a multi-site CodeIgniter
tree that served `cromptonintl.com`, `merlyneqatar.com` and `mgnqatar.com`.

The archive is **not** a clean photo library. It mixes genuine company photography
with commercial stock — villas, office fit-outs, model headshots and one image with
a stock-site **"ADD BANNER"** badge burned into it. `SHOOT-LIST.md` forbids
substituting stock for Crompton's own operation, so the import is an explicit
allow-list rather than a copy of the folder.

## Verdict by folder

| Folder | Files | Verdict | Why |
|---|---|---|---|
| `hero/` | 20 | **Partly used** (6) | Real construction/crew scenes. Some duplicates (`- Copy`, leading-dash variants). |
| `about/` | 12 | **Partly used** (2) | `lab.jpg` (crew boarding company bus in Doha) and `labc.jpg` (MEP worker) are genuine operational shots. `about-01…09` are stock tool flat-lays and model workers. |
| `projects/` | 24 | **Refused** | Every image is stock real-estate photography — Bali villas, a Shanghai tower (Oriental Pearl visible), hotel interiors. None is Crompton work in Qatar. |
| `team/` | 7 | **Refused** | Six of seven are Western stock model headshots presented as staff. `sajipaul.jpeg` is a real person but is a passport-style shot on a blue field. |
| `testimonial/` | 6 | **Refused** | Stock portrait models; no attributable quotes. |
| `news/` | 27 | **Refused** | Stock, mostly 60–80px thumbnails. `news-22.jpg` carries an unlicensed **"ADD BANNER"** placeholder badge. |
| `clients/` | 26 | **Published** | Genuine client logos (Al-Futtaim, Siemens, Midmac, CRCC, Descon, Voltas, Al-Balagh…). Published on the client's instruction — see below. |
| `sisters/` | 6 | **Staged only** | Genuine group logos, but the old page paired `s2.jpg` with the caption "Crompton Catering" while the file is the Merlyne mark. Captions must be re-checked, not trusted. |
| `bg/`, `png-icon/`, `png-img/`, `igen/` | 65 | **Not used** | UI decoration from the old template; superseded by the new design system. |

## What was integrated

Produced by `scripts/import-legacy-assets.py`, cropped to the aspect ratio of the
slot each one fills, converted to WebP (q84), metadata stripped.

| Output | Source | Page / slot |
|---|---|---|
| `hero/slide-01…06.webp` | `hero-05`, `hero-03`, `hero-10`, `lab`, `hero-07`, `hero-01` | Home hero carousel (EN + AR) |
| `about/crew-mobilisation.webp` | `about/lab.jpg` | About — portrait slot |
| `about/mep-worker.webp` | `about/labc.jpg` | Reserved |
| `gallery/workers.webp` | `hero/hero-08.jpg` | Gallery — Workers |
| `gallery/transportation.webp` | `about/lab.jpg` | Gallery — Transportation, Home operations card |
| `gallery/works.webp` | `hero/hero-03.jpg` | Gallery — Projects |
| `services/blue-collar.webp` | `hero/hero-01.jpg` | Services — Blue Collar |
| `services/project-based.webp` | `hero/hero-10.jpg` | Services — Project-Based |
| `services/outsourcing.webp` | `hero/hero-09.jpg` | Services — Outsourcing |
| `industries/site.webp` | `hero/hero-03.jpg` | Industries — banner |
| `hse/ppe.webp` | `hero/hero-07.jpg` | HSE — PPE in use |

Total 17 published images, ~1.4 MB. Every one carries real alt text; `public/images/manifest.json`
records source, dimensions, hash and provenance.

Slots with no honest photograph keep their labelled placeholder: accommodation,
training, office, docal-role services, client wall. A placeholder is honest; a
substitute photo is not.

The hero is a six-frame cross-fade carousel (`src/components/HeroCarousel.astro`),
the equivalent of the Owl Carousel on the old site. It advances every 6s, pauses on
hover or focus, stops in a background tab, and does not autoplay when the reader
prefers reduced motion. Slide 4 (the bus) is a 846×363 native crop, so it is softer
than the rest at full width — the shoot replaces it.

## Provenance caveat — read before go-live

These files come from the company's own former website, which is a reasonable
basis for reuse. It is **not proof of authorship**: several frames in the old tree
were stock, so any individual frame may be too. The crew lineup, the bus in Doha
and the MEP shots look like the company's own operation; confirm with the client
before launch, and prefer new photography from the shoot list where it exists.

Resolution is another limit: the hero sources are **1920×800**, below the
**2560×1100** the brief asks for. They are sharp at 1280 CSS px and soft on a
wide retina display. Acceptable as an interim; not a substitute for the shoot.

## Client logos

`public/images/clients/` holds 26 logos, trimmed to their ink bounds (not padded
into a uniform canvas, which made every mark render tiny) and written onto white
so they sit cleanly on the page's white tiles. `src/data/clients.json` is generated
alongside them with name, sector and path.

Names were read from the artwork, since the old site published the logos without
captions. **Check them against the client's own list before launch** — the sector
labels are ours, not theirs.

The page previously stated that logos appear "with written permission" and left
the cells empty. That claim has been removed rather than printed on the client's
behalf; the published copy now says only that the marks belong to their owners and
identify companies supplied. If a client objects, delete their entry from
`clients.json` and re-run the script.

## Re-running the import

```bash
unzip -q crompton-website.zip -d /tmp/legacy
python3 scripts/import-legacy-assets.py --source /tmp/legacy/crompton-website --clients
```

Add an entry to `PHOTOS` in the script to import another frame. Nothing is
imported implicitly — a file has to be named to be used.
