#!/usr/bin/env python3
"""
Build the social share card: public/images/og/og-crompton-international.jpg (1200x630).

Why this exists: the head has an og:image tag, and WhatsApp/LinkedIn are the two
places a Crompton link actually gets looked at. A missing og:image renders as a bare
URL with no title card.

Design constraints come from design.md, not from taste:
  - navy #0c2340 ground, warm accent #e8621c rule, white type
  - the mark is public/brand/mark-white.png, cut from the client's 1193x839
    master and recoloured for a dark ground by scripts/prepare-brand.py. The
    name and subtitle are set in Plus Jakarta, because the header lockup's
    wordmark only exists as 350x60 pixels
  - no invented numbers, no stock photo, no faces. Nothing on this card is a claim
    the site does not already make in text.

Typography is set with the same two families the site self-hosts, downloaded here as
TTF (the build ships woff2). The card is committed, so this script is a reproducer,
not a build step — it needs network access, the site build does not.

  python3 scripts/make-og-image.py
"""
from __future__ import annotations

import sys
import tempfile
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "og" / "og-crompton-international.jpg"

W, H = 1200, 630
NAVY = (12, 35, 64)      # #0c2340 site navy ground
RED = (232, 98, 28)      # #e8621c warm accent, the rule under the lockup
PAPER = (255, 255, 255)
MUTED = (186, 187, 214)
RULE = (255, 255, 255, 12)

UA_TTF = "Mozilla/4.0"  # old UA makes Google Fonts return TTF instead of woff2

FONTS = {
    "Inter-Regular": ("Inter:wght@400", 0),
    "Inter-SemiBold": ("Inter:wght@600", 0),
}

# The client's whole lockup, recoloured for a navy ground by scripts/prepare-brand.py.
# Using the real lockup rather than re-typesetting the name keeps the card's wordmark
# identical to the one in the header — a set wordmark in a different face is a second,
# slightly wrong logo.
LOCKUP = ROOT / "public" / "brand" / "lockup-white.png"


def fetch_ttf(query: str, tmp: Path) -> Path:
    """Download one weight as TTF through Google's CSS API."""
    css_url = f"https://fonts.googleapis.com/css2?family={query}&display=swap"
    req = urllib.request.Request(css_url, headers={"User-Agent": UA_TTF})
    css = urllib.request.urlopen(req, timeout=30).read().decode()

    import re

    url = re.search(r"url\((https://[^)]+\.ttf)\)", css)
    if not url:
        sys.exit(f"no TTF returned for {query} — Google's API changed shape")

    name = f"{query.split(':')[0].replace('+', '-')}-{query.split('wght@')[-1]}.ttf"
    dest = tmp / name
    req = urllib.request.Request(url.group(1), headers={"User-Agent": UA_TTF})
    dest.write_bytes(urllib.request.urlopen(req, timeout=30).read())
    return dest


def tracked_text(draw, xy, text, font, fill, tracking=0.0):
    """PIL has no letter-spacing; draw glyph by glyph. tracking is in em."""
    x, y = xy
    space = tracking * font.size
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + space
    return x - space - xy[0]


def text_width(font, text, tracking=0.0):
    return sum(font.getlength(c) for c in text) + tracking * font.size * max(len(text) - 1, 0)


def main() -> None:
    tmp = Path(tempfile.mkdtemp(prefix="cromton-og-"))
    ttf = {k: fetch_ttf(q, tmp) for k, (q, _) in FONTS.items()}

    img = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img, "RGBA")

    # Engineered grid, same idea as the hero: 56px cells, barely visible.
    for x in range(0, W, 56):
        draw.line([(x, 0), (x, H)], fill=RULE, width=1)
    for y in range(0, H, 56):
        draw.line([(0, y), (W, y)], fill=RULE, width=1)

    # The client's own lockup, already recoloured for a dark ground.
    lockup = Image.open(LOCKUP).convert("RGBA")
    lockup.thumbnail((520, 520), Image.LANCZOS)
    img.paste(lockup, (80, 82), lockup)
    lockup_edge = 80 + lockup.width

    f_lead = ImageFont.truetype(str(ttf["Inter-Regular"]), 34)
    f_site = ImageFont.truetype(str(ttf["Inter-SemiBold"]), 25)

    # Brand red rule separating the mark from the statement.
    draw.rectangle([80, 268, 80 + 88, 268 + 4], fill=RED)

    lead = "Manpower supply & contracting"
    draw.text((80, 300), lead, font=f_lead, fill=PAPER)
    draw.text((80, 346), "Doha, Qatar", font=f_lead, fill=MUTED)

    # Footer line: domain only. No phone, no stat, no certification badge.
    draw.rectangle([80, 486, W - 80, 487], fill=(255, 255, 255, 40))
    draw.text((80, 512), "cromptonqatar.com", font=f_site, fill=PAPER)

    # Guard against silent overflow — a card that clips "contracting" looks broken
    # and nobody notices until it is on LinkedIn.
    checks = [
        ("lockup", lockup_edge, W - 80),
        ("lead", 80 + text_width(f_lead, lead), W - 80),
        ("domain", 80 + text_width(f_site, "cromptonqatar.com"), W - 80),
    ]
    bad = [(n, edge) for n, edge, limit in checks if edge > limit]
    if bad:
        sys.exit(f"text overflows the safe area: {bad}")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "JPEG", quality=92, optimize=True, progressive=True)

    print(f"wrote {OUT.relative_to(ROOT)}  {W}x{H}  {OUT.stat().st_size / 1024:.0f} KiB")
    for name, edge, limit in checks:
        print(f"  {name:<9} right edge {edge:>4}px (limit {limit})")


if __name__ == "__main__":
    main()
