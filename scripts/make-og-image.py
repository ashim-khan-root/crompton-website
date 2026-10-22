#!/usr/bin/env python3
"""
Build the social share card: public/images/og/og-cromton-group.jpg (1200x630).

Why this exists: the head has an og:image tag, and WhatsApp/LinkedIn are the two
places a Cromton link actually gets looked at. A missing og:image renders as a bare
URL with no title card.

Design constraints come from design.md, not from taste:
  - navy #1a365d ground, gold #d69e2e accent, warm paper #fbfaf7 type
  - the mark is the real geometry from src/components/Logo.tsx, rendered through
    rsvg-convert so it is the brand's own arc and keystone, not a redrawing
  - no invented numbers, no stock photo, no faces. Nothing on this card is a claim
    the site does not already make in text.

Typography is set with the same two families the site self-hosts, downloaded here as
TTF (the build ships woff2). The card is committed, so this script is a reproducer,
not a build step — it needs network access, the site build does not.

  python3 scripts/make-og-image.py
"""
from __future__ import annotations

import io
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "og" / "og-cromton-group.jpg"

W, H = 1200, 630
NAVY = (26, 54, 93)
GOLD = (214, 158, 46)
PAPER = (251, 250, 247)
MUTED = (185, 194, 207)
RULE = (255, 255, 255, 12)

UA_TTF = "Mozilla/4.0"  # old UA makes Google Fonts return TTF instead of woff2

FONTS = {
    "PJS-ExtraBold": ("Plus+Jakarta+Sans:wght@800", 0),
    "Inter-Regular": ("Inter:wght@400", 0),
    "Inter-SemiBold": ("Inter:wght@600", 0),
}

# The mark: straight from Logo.tsx (`M36.30 32.60 A15 15 0 1 1 36.99 16.50` +
# keystone rect). Drawn white on the navy ground, which is the `tone="dark"` variant.
MARK_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="{size}" height="{size}">
  <path d="M36.30 32.60 A15 15 0 1 1 36.99 16.50" stroke="#ffffff" stroke-width="6.5"
        stroke-linecap="round" fill="none"/>
  <rect x="30.5" y="20.75" width="7.5" height="6.5" rx="1.5" fill="#d69e2e"/>
</svg>"""


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

    # Mark, rasterised from the real vector.
    with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False) as fh:
        fh.write(MARK_SVG.format(size=104))
        svg_path = fh.name
    mark_png = subprocess.run(
        ["rsvg-convert", "-w", "104", "-h", "104", svg_path],
        check=True,
        capture_output=True,
    ).stdout
    mark = Image.open(io.BytesIO(mark_png)).convert("RGBA")
    img.paste(mark, (80, 84), mark)

    f_word = ImageFont.truetype(str(ttf["PJS-ExtraBold"]), 76)
    f_sub = ImageFont.truetype(str(ttf["Inter-SemiBold"]), 22)
    f_lead = ImageFont.truetype(str(ttf["Inter-Regular"]), 34)
    f_site = ImageFont.truetype(str(ttf["Inter-SemiBold"]), 25)

    # Wordmark lockup: CROMTON over GROUP, to the right of the mark.
    # Align the cap top to the mark's top rather than the text box origin — PIL's
    # y is the ascender, so drawing at 88 sits the caps visibly low.
    word_x = 80 + 104 + 28
    cap_offset = f_word.getbbox("C")[1]
    word_y = 84 + 6 - cap_offset
    word_x_end = tracked_text(draw, (word_x, word_y), "CROMTON", f_word, PAPER, tracking=-0.01)
    group_y = word_y + f_word.getbbox("CROMTON")[3] + 10
    tracked_text(draw, (word_x + 3, group_y), "GROUP", f_sub, MUTED, tracking=0.30)

    # Gold rule separating lockup from the statement.
    draw.rectangle([80, 268, 80 + 88, 268 + 4], fill=GOLD)

    lead = "Manpower supply & contracting"
    draw.text((80, 300), lead, font=f_lead, fill=PAPER)
    draw.text((80, 346), "Doha, Qatar", font=f_lead, fill=MUTED)

    # Footer line: domain only. No phone, no stat, no certification badge.
    draw.rectangle([80, 486, W - 80, 487], fill=(255, 255, 255, 40))
    draw.text((80, 512), "cromtongroup.com", font=f_site, fill=GOLD)

    # Guard against silent overflow — a card that clips "contracting" looks broken
    # and nobody notices until it is on LinkedIn.
    checks = [
        ("wordmark", word_x_end, W - 80),
        ("lead", 80 + text_width(f_lead, lead), W - 80),
        ("domain", 80 + text_width(f_site, "cromtongroup.com"), W - 80),
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
