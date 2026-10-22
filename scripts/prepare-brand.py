#!/usr/bin/env python3
"""
Build the brand assets from the client's own logo art in the legacy site.

Source of truth is the client's own artwork, vendored into this repo so the build does not
depend on the ZIP sitting somewhere in /tmp:

  assets/staging/brand/globe-mark.png    1193x839, the globe alone, real alpha
  assets/staging/brand/header-lockup.png  350x60, the header lockup with the wordmark baked in

Both were copied out of the ZIP of the old CodeIgniter site (`assets/img/png-icon/logo-element.png`
and `assets/img/logo/logo.png`), which is the only place the real logo exists — nobody has
supplied a vector. `--source` still accepts an extracted legacy tree if they need re-importing.

Outputs (public/brand/):
  lockup.png         the full header lockup, cleaned, 2x, transparent ground
  lockup-white.png   same lockup recoloured for dark grounds (all ink -> white, red kept)
  mark.png           the globe alone, trimmed from the high-res master
  mark-white.png     the globe recoloured for dark grounds
  favicon-32.png     from the mark, on the brand navy
  apple-touch-icon.png  180px, from the mark, on the brand navy

Cleaning is not decoration: the header PNG is a 350x60 JPEG-ish raster with 1401
distinct colours and grey compression noise. Every pixel here is snapped to one of
the four brand colours, and the white ground is turned into real transparency, so the
logo can sit on white, on navy, or in the OG card without a white box around it.

    python3 scripts/prepare-brand.py                      # from assets/staging/brand/
    python3 scripts/prepare-brand.py --source <legacy tree>   # re-import from the old site
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "brand"

RED = (244, 4, 16)      # #f40410 — the logo's own red, never changed
NAVY = (12, 11, 97)     # #0c0b61 — the logo's own indigo, never changed
TILE = (12, 35, 64)     # #0c2340 — site navy, used as the icon ground
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)


def alpha_from_white(px: tuple[int, int, int]) -> int:
    """How far a white-ground pixel is from white, in 0-255.

    Using the largest single-channel deviation rather than luminance matters: a
    luminance formula reads saturated red as half-transparent and the swoosh
    washes out to pink.
    """
    d = max(255 - px[0], 255 - px[1], 255 - px[2])
    return min(255, round(d * 255 / 250))


def unpremultiply(px: tuple[int, int, int], a: int) -> tuple[int, int, int]:
    if a == 0:
        return WHITE
    af = a / 255
    return tuple(
        max(0, min(255, round((c - 255 * (1 - af)) / af))) for c in px
    )  # type: ignore[return-value]


def classify(rgb: tuple[int, int, int]) -> tuple[int, int, int]:
    r, g, b = rgb
    if r - max(g, b) > 45:
        return RED
    if b - r > 25 or (b > 55 and b > g + 20):
        return NAVY
    return BLACK


def clean_on_white(img: Image.Image) -> Image.Image:
    """Turn a white-background raster into a transparent, palette-snapped RGBA."""
    img = img.convert("RGB")
    w, h = img.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    src, dst = img.load(), out.load()
    assert src is not None and dst is not None
    for y in range(h):
        for x in range(w):
            px = src[x, y]  # type: ignore[index]
            a = alpha_from_white(px)
            if a < 10:            # white ground, and the halo around the ink
                continue
            dst[x, y] = (*classify(unpremultiply(px, a)), a)  # type: ignore[index]
    return out


def to_white_ink(img: Image.Image) -> Image.Image:
    """Reverse variant for dark grounds: every ink but the red becomes white.

    The globe is navy and the wordmark black; on a navy footer both would vanish.
    Keeping the red and inverting the rest is the only change that preserves the mark.
    """
    out = img.copy()
    px = out.load()
    assert px is not None
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]  # type: ignore[index, misc]
            if a == 0:
                continue
            if (r, g, b) != RED:
                px[x, y] = (*WHITE, a)  # type: ignore[index]
    return out


def upscale(img: Image.Image, factor: float) -> Image.Image:
    w, h = img.size
    return img.resize((round(w * factor), round(h * factor)), Image.LANCZOS)


def verify(original: Image.Image, rebuilt: Image.Image) -> float:
    """Composite the cleaned asset back onto white and diff it against the source.

    This is the only honest check that cleaning did not change the logo: colour
    snapping or a bad alpha shows up as a large mean error here.
    """
    flat = Image.new("RGB", rebuilt.size, WHITE)
    flat.paste(rebuilt, (0, 0), rebuilt)
    a = original.convert("RGB")
    b = flat
    total = 0
    n = 0
    for (pa, pb) in zip(a.getdata(), b.getdata()):
        total += sum(abs(x - y) for x, y in zip(pa, pb))
        n += 1
    return total / (n * 3)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--source",
        help="extracted legacy site root; defaults to the copies in assets/staging/brand/",
    )
    args = ap.parse_args()

    if args.source:
        src = Path(args.source)
        lockup_png = src / "assets/img/logo/logo.png"
        element_png = src / "assets/img/png-icon/logo-element.png"
    else:
        staging = ROOT / "assets" / "staging" / "brand"
        lockup_png = staging / "header-lockup.png"
        element_png = staging / "globe-mark.png"
    for p in (lockup_png, element_png):
        if not p.exists():
            sys.exit(f"missing source art: {p}")

    OUT.mkdir(parents=True, exist_ok=True)

    # --- header lockup -------------------------------------------------------
    raw = Image.open(lockup_png).convert("RGB")
    cleaned = clean_on_white(raw)
    err = verify(raw, cleaned)
    if err > 12:
        sys.exit(f"cleaning drifted from the source (mean abs error {err:.1f}/255) — inspect before shipping")
    print(f"lockup cleaned, mean abs error vs source {err:.1f}/255")

    bbox = cleaned.getbbox()
    assert bbox is not None
    cleaned = cleaned.crop(bbox)

    lockup = upscale(cleaned, 2.0)
    lockup.save(OUT / "lockup.png", optimize=True)
    to_white_ink(cleaned).resize(lockup.size, Image.LANCZOS).save(OUT / "lockup-white.png", optimize=True)
    print(f"  lockup.png / lockup-white.png  {lockup.size[0]}x{lockup.size[1]}")

    # --- mark, from the high-res master -------------------------------------
    el = Image.open(element_png).convert("RGBA")
    # The master already has alpha and the right flat colours; just trim and
    # normalise the few off-palette pixels left by its own antialiasing.
    ebbox = el.getbbox()
    assert ebbox is not None
    el = el.crop(ebbox)

    mark = Image.new("RGBA", el.size, (0, 0, 0, 0))
    sp, dp = el.load(), mark.load()
    assert sp is not None and dp is not None
    for y in range(el.size[1]):
        for x in range(el.size[0]):
            r, g, b, a = sp[x, y]  # type: ignore[index, misc]
            if a == 0:
                continue
            dp[x, y] = (*classify((r, g, b)), a)  # type: ignore[index]

    # 640px wide is still ~4x the largest use (the JSON-LD logo, which crawlers fetch)
    # and keeps a 1.4MB master out of the repo's public bytes. The full-res source
    # stays in assets/staging/brand/ for anyone who needs it.
    mark.thumbnail((640, 640), Image.LANCZOS)
    mark.save(OUT / "mark.png", optimize=True)
    to_white_ink(mark).save(OUT / "mark-white.png", optimize=True)
    print(f"  mark.png / mark-white.png  {mark.size[0]}x{mark.size[1]}")

    # --- icons --------------------------------------------------------------
    for size, name in ((32, "favicon-32.png"), (180, "apple-touch-icon.png")):
        pad = 0.12
        inner = round(size * (1 - 2 * pad))
        m = mark.copy()
        m.thumbnail((inner, inner), Image.LANCZOS)
        tile = Image.new("RGB", (size, size), TILE)
        tile.paste(m, ((size - m.size[0]) // 2, (size - m.size[1]) // 2), m)
        tile.save(OUT / name, optimize=True)
    print("  favicon-32.png / apple-touch-icon.png")

    total = sum((OUT / f).stat().st_size for f in
                ("lockup.png", "lockup-white.png", "mark.png", "mark-white.png",
                 "favicon-32.png", "apple-touch-icon.png"))
    print(f"total {total / 1024:.0f} KiB in public/brand/")


if __name__ == "__main__":
    main()
