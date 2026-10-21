#!/usr/bin/env python3
"""Import AI-generated images from assets/incoming/ai into the site.

Kept separate from import-legacy-assets.py because provenance matters: a
photograph from the old site and a generated image are different claims, and
public/images/manifest.json records which is which. Anything imported here is
marked ai-generated.

The staging folder is outside public/, so a dropped file is never published by
accident. Run without arguments and it reports what it found; add --write to
process.

    python3 scripts/import-ai-assets.py            # dry run
    python3 scripts/import-ai-assets.py --write
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
INCOMING = ROOT / "assets" / "incoming" / "ai"
OUT = ROOT / "public" / "images"
MANIFEST = OUT / "manifest.json"

# key, destination, aspect, focal point, alt text
SLOTS = [
    (
        "accommodation-01",
        "gallery/accommodation.webp",
        (4, 3),
        (0.5, 0.5),
        "Accommodation camp exterior with shaded walkways and planted surrounds",
    ),
    (
        "training-01",
        "gallery/training.webp",
        (4, 3),
        (0.5, 0.5),
        "Induction session in progress in a training room",
    ),
    (
        "hse-briefing-01",
        "hse/briefing.webp",
        (4, 3),
        (0.5, 0.5),
        "Toolbox talk on site before the shift starts",
    ),
    (
        "office-team-01",
        "gallery/office.webp",
        (4, 3),
        (0.5, 0.5),
        "Reception area at the Doha office",
    ),
    (
        "white-collar-01",
        "services/white-collar.webp",
        (4, 3),
        (0.5, 0.5),
        "Engineering team reviewing drawings in a Doha office",
    ),
    (
        "recruitment-01",
        "services/recruitment.webp",
        (4, 3),
        (0.5, 0.5),
        "Recruitment interview in progress",
    ),
    (
        "payroll-01",
        "services/payroll.webp",
        (4, 3),
        (0.5, 0.5),
        "Payroll desk with payslips and a calculator",
    ),
]

MIN_SIZE = (1600, 1200)
SUFFIXES = (".jpg", ".jpeg", ".png", ".webp")


def cover_crop(im: Image.Image, aspect: tuple[int, int], focal: tuple[float, float]) -> Image.Image:
    aw, ah = aspect
    target = aw / ah
    w, h = im.size
    if w / h > target:
        new_w = int(round(h * target))
        x = int(round((w - new_w) * focal[0]))
        x = max(0, min(x, w - new_w))
        return im.crop((x, 0, x + new_w, h))
    new_h = int(round(w / target))
    y = int(round((h - new_h) * focal[1]))
    y = max(0, min(y, h - new_h))
    return im.crop((0, y, w, y + new_h))


def find(key: str) -> Path | None:
    for suffix in SUFFIXES:
        p = INCOMING / f"{key}{suffix}"
        if p.is_file():
            return p
    return None


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help="actually process and write files")
    ap.add_argument("--max-width", type=int, default=2000)
    args = ap.parse_args()

    manifest: list[dict] = []
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    found, missing = 0, []
    for key, dest, aspect, focal, alt in SLOTS:
        src = find(key)
        if src is None:
            missing.append(key)
            continue
        found += 1
        im = Image.open(src)
        width, height = im.size
        too_small = width < MIN_SIZE[0] or height < MIN_SIZE[1]
        im = im.convert("RGB")

        if not args.write:
            flag = "  LOW RES" if too_small else ""
            print(f"  {key:20s} {width}x{height} -> {dest}{flag}")
            continue

        cropped = cover_crop(im, aspect, focal)
        if cropped.width > args.max_width:
            new_h = int(cropped.height * args.max_width / cropped.width)
            cropped = cropped.resize((args.max_width, new_h), Image.LANCZOS)
        target = OUT / dest
        target.parent.mkdir(parents=True, exist_ok=True)
        cropped.save(target, "WEBP", quality=84, method=6)

        for existing in manifest:
            if existing["path"] == f"/images/{dest}":
                manifest.remove(existing)
                break
        manifest.append(
            {
                "path": f"/images/{dest}",
                "source": str(src.relative_to(ROOT)),
                "source_size": [width, height],
                "size": list(Image.open(target).size),
                "bytes": target.stat().st_size,
                "sha": sha(target),
                "alt": alt,
                "provenance": "ai-generated",
                "note": "client approved AI imagery for staff-free operational scenes",
            }
        )
        print(f"  {key:20s} {width}x{height} -> {dest}  {manifest[-1]['size'][0]}x{manifest[-1]['size'][1]}")

    if missing:
        print(f"\nnot supplied ({len(missing)}): " + ", ".join(missing))
    if args.write and found:
        MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        print(f"\nmanifest updated: {MANIFEST.relative_to(ROOT)}")
    elif not args.write:
        print("\ndry run — re-run with --write to process")
    return 0 if found else 1


if __name__ == "__main__":
    raise SystemExit(main())
