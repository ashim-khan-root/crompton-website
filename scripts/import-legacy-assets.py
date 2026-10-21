#!/usr/bin/env python3
"""Import usable photography from the legacy Crompton PHP site into this Astro site.

The legacy archive is a CodeIgniter tree that served several group companies. It
mixed genuine company photography with commercial stock (villas, office fit-outs,
model headshots). Bulk-copying it would publish stock as if it were the company's
own work, which SHOOT-LIST.md rules out.

So this script imports an explicit allow-list, crops each image to the aspect ratio
of the slot it fills, and records provenance for every file in manifest.json. Add
an entry to PHOTOS to import another image; nothing is imported implicitly.

Usage:
    python3 scripts/import-legacy-assets.py --source /path/to/extracted/legacy
    python3 scripts/import-legacy-assets.py --source ... --clients   # logo wall

Outputs:
    public/images/<group>/<name>.webp      (published)
    public/images/manifest.json
    assets/staging/client-logos/           (NOT published — pending permission)
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images"
# Staged, deliberately outside public/: a third-party logo must not be fetchable
# from the live site before the company has agreed to be named.
STAGING = ROOT / "assets" / "staging" / "client-logos"

# destination, source (relative to --source), aspect (w, h), focal point, alt text
PHOTOS = [
    (
        "hero/crew-site.webp",
        "assets/img/hero/hero-05.jpg",
        (21, 9),
        (0.5, 0.5),
        "Cromton Group workforce lined up in company uniform before deployment",
    ),
    (
        "hero/site-works.webp",
        "assets/img/hero/hero-03.jpg",
        (21, 9),
        (0.5, 0.5),
        "Construction works under a tower crane in Qatar",
    ),
    (
        "about/crew-mobilisation.webp",
        "assets/img/about/lab.jpg",
        (5, 4),
        (0.5, 0.5),
        "Workers boarding a company bus for site mobilisation in Doha",
    ),
    (
        "about/mep-worker.webp",
        "assets/img/about/labc.jpg",
        (5, 4),
        (0.5, 0.5),
        "Electro-mechanical technician at work",
    ),
    (
        "gallery/workers.webp",
        "assets/img/hero/hero-08.jpg",
        (4, 3),
        (0.45, 0.5),
        "Electrician terminating wiring in a distribution board",
    ),
    (
        "gallery/transportation.webp",
        "assets/img/about/lab.jpg",
        (4, 3),
        (0.55, 0.5),
        "Company transport collecting workers for site rotation",
    ),
    (
        "gallery/works.webp",
        "assets/img/hero/hero-03.jpg",
        (4, 3),
        (0.5, 0.5),
        "Building under construction, tower crane overhead",
    ),
    (
        "services/blue-collar.webp",
        "assets/img/hero/hero-01.jpg",
        (4, 3),
        (0.62, 0.45),
        "Skilled worker using an angle grinder with full PPE",
    ),
    (
        "services/project-based.webp",
        "assets/img/hero/hero-10.jpg",
        (4, 3),
        (0.5, 0.5),
        "Steel fixers working on a reinforcement deck",
    ),
    (
        "services/outsourcing.webp",
        "assets/img/hero/hero-09.jpg",
        (4, 3),
        (0.5, 0.5),
        "Plasterer finishing an internal wall",
    ),
    (
        "industries/site.webp",
        "assets/img/hero/hero-03.jpg",
        (21, 9),
        (0.5, 0.5),
        "Construction site in Qatar",
    ),
    (
        "hse/ppe.webp",
        "assets/img/hero/hero-07.jpg",
        (4, 3),
        (0.55, 0.5),
        "Welders wearing helmets, gloves and eye protection",
    ),
]

# Logos are padded, never cropped: cropping a wordmark cuts the company name.
LOGOS = "assets/img/clients"


def cover_crop(im: Image.Image, aspect: tuple[int, int], focal: tuple[float, float]) -> Image.Image:
    """Scale to cover the target aspect, then crop around the focal point."""
    aw, ah = aspect
    target = aw / ah
    w, h = im.size
    if w / h > target:  # too wide, trim sides
        new_w = int(round(h * target))
        x = int(round((w - new_w) * focal[0]))
        box = (max(0, min(x, w - new_w)), 0, max(0, min(x, w - new_w)) + new_w, h)
    else:  # too tall, trim top/bottom
        new_h = int(round(w / target))
        y = int(round((h - new_h) * focal[1]))
        box = (0, max(0, min(y, h - new_h)), w, max(0, min(y, h - new_h)) + new_h)
    return im.crop(box)


def save(im: Image.Image, dest: Path, width: int | None = None) -> None:
    if width and im.width > width:
        height = int(round(im.height * width / im.width))
        im = im.resize((width, height), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=84, method=6)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True, help="extracted legacy site root (contains assets/img)")
    ap.add_argument("--clients", action="store_true", help="also export the client logo wall (padded, not cropped)")
    ap.add_argument("--max-width", type=int, default=2000)
    args = ap.parse_args()

    src = Path(args.source).expanduser().resolve()
    if not (src / "assets" / "img").is_dir():
        print(f"error: {src}/assets/img not found — pass the extracted site root")
        return 2

    manifest: list[dict] = []
    missing: list[str] = []

    for dest, rel, aspect, focal, alt in PHOTOS:
        p = src / rel
        if not p.is_file():
            missing.append(rel)
            continue
        im = Image.open(p)
        src_size = im.size
        im = im.convert("RGB")
        im = cover_crop(im, aspect, focal)
        target = OUT / dest
        save(im, target, args.max_width)
        manifest.append(
            {
                "path": f"/images/{dest}",
                "source": rel,
                "source_size": list(src_size),
                "size": list(Image.open(target).size),
                "bytes": target.stat().st_size,
                "sha": sha(target),
                "alt": alt,
                "provenance": "legacy-site",
            }
        )
        print(f"  {dest:38s} {src_size[0]}x{src_size[1]} -> {manifest[-1]['size'][0]}x{manifest[-1]['size'][1]}")

    if args.clients:
        logos = sorted((src / LOGOS).glob("*.jpg"))
        for i, p in enumerate(logos, 1):
            im = Image.open(p).convert("RGB")
            # pad onto a 3:2 white canvas so no wordmark is cut
            # fit inside 3:2 with 8% margin
            canvas = Image.new("RGB", (1200, 800), "white")
            im.thumbnail((int(1200 * 0.84), int(800 * 0.84)), Image.LANCZOS)
            canvas.paste(im, ((1200 - im.width) // 2, (800 - im.height) // 2))
            dest = STAGING / f"client-{i:02d}.webp"
            dest.parent.mkdir(parents=True, exist_ok=True)
            save(canvas, dest)
            manifest.append(
                {
                    "path": f"(staged) assets/staging/client-logos/client-{i:02d}.webp",
                    "source": f"{LOGOS}/{p.name}",
                    "source_size": list(Image.open(p).size),
                    "size": [1200, 800],
                    "bytes": dest.stat().st_size,
                    "sha": sha(dest),
                    "alt": "Client logo",
                    "provenance": "legacy-site",
                    "note": "third-party logo — needs written permission before publication",
                }
            )
        print(f"  client logos: {len(logos)}")

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    total = sum(m["bytes"] for m in manifest)
    print(f"\n{len(manifest)} files, {total / 1024:.0f} KB -> {OUT}")
    if missing:
        print(f"missing sources ({len(missing)}): " + ", ".join(missing))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
