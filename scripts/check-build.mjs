#!/usr/bin/env node
/**
 * Assert the built site carries the things that are invisible in a browser but
 * decide whether a share card renders and whether a crawler sees one page or two.
 *
 * There is no typecheck in this project, so `npm run build` succeeding only means it
 * compiled. This script is the part that checks the output.
 *
 *   npm run check:build        (after npm run build)
 *
 * Each check names the defect it prevents. Every one of them failed at least once
 * against a deliberately broken dist before it was trusted.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://cromptonqatar.com';

const failures = [];
const notes = [];

const fail = (check, detail) => failures.push(`${check}: ${detail}`);
const ok = (check) => notes.push(`  ok   ${check}`);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Width/height from a JPEG's first SOFn marker — no image library needed. */
function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

if (!existsSync(DIST)) {
  console.error('dist/ is missing — run `npm run build` first.');
  process.exit(1);
}

// ---------------------------------------------------------------- 404 + robots
if (!existsSync(path.join(DIST, '404.html'))) fail('404 page', 'dist/404.html is missing');
else {
  const html = await readFile(path.join(DIST, '404.html'), 'utf8');
  if (!/name="robots" content="noindex/.test(html)) fail('404 page', 'not marked noindex');
  else ok('404 page exists and is noindex');
}

if (!existsSync(path.join(DIST, 'robots.txt'))) fail('robots.txt', 'dist/robots.txt is missing');
else {
  const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
  if (!robots.includes(`${SITE}/sitemap-index.xml`)) fail('robots.txt', 'does not point at the sitemap');
  else ok('robots.txt points at the sitemap');
}

// -------------------------------------------------------------------- sitemap
const sitemapFiles = (await readdir(DIST)).filter((f) => f.startsWith('sitemap-') && f.endsWith('.xml'));
if (!sitemapFiles.length) fail('sitemap', 'no sitemap-*.xml in dist');
else {
  const xml = await Promise.all(sitemapFiles.map((f) => readFile(path.join(DIST, f), 'utf8')));
  const locs = xml.join('\n').match(/<loc>[^<]+<\/loc>/g)?.map((l) => l.slice(5, -6)) ?? [];
  const bad = locs.filter((u) => u === `${SITE}/` || u === `${SITE}/404/` || u === `${SITE}/404.html`);
  if (bad.length) fail('sitemap', `lists non-content URLs: ${bad.join(', ')}`);
  if (!locs.some((u) => u === `${SITE}/en/`)) fail('sitemap', 'does not list the English homepage');
  if (!locs.some((u) => u === `${SITE}/ar/`)) fail('sitemap', 'does not list the Arabic homepage');
  if (!failures.some((f) => f.startsWith('sitemap'))) ok(`sitemap lists ${locs.length} real URLs, no redirect`);
}

// ----------------------------------------------------------------- HTML pages
const pages = (await walk(DIST)).filter((f) => f.endsWith('.html'));
const ogImagePath = path.join(DIST, 'images', 'og', 'og-crompton-international.jpg');

for (const file of pages) {
  const rel = `/${path.relative(DIST, file)}`;
  const html = await readFile(file, 'utf8');

  // `/index.html` is Astro's meta-refresh stub for the `/` → `/en/` redirect. It never
  // renders, so it needs no canonical or share card — but it must stay out of the index.
  if (/http-equiv="refresh"/.test(html)) {
    if (!/name="robots" content="noindex"/.test(html)) fail('redirect stub', `${rel} is not noindex`);
    continue;
  }

  // canonical: exactly one, absolute, and pointing at this page's own address
  const canonicals = html.match(/<link rel="canonical" href="([^"]+)"/g) ?? [];
  const is404 = rel === '/404.html';
  if (is404) {
    // A 404 is served for arbitrary paths, so a canonical would claim one URL for all of
    // them. It carries none on purpose.
    if (canonicals.length) fail('canonical', '404.html carries a canonical, which cannot be right for every path');
  } else if (canonicals.length !== 1) {
    fail('canonical', `${rel} has ${canonicals.length} canonical tags`);
  } else {
    const href = canonicals[0].match(/href="([^"]+)"/)[1];
    const expected = rel.replace(/index\.html$/, '');
    if (!href.startsWith(SITE)) fail('canonical', `${rel} is not absolute: ${href}`);
    else if (!new URL(href).pathname.endsWith(expected)) {
      fail('canonical', `${rel} points at ${new URL(href).pathname}, expected ${expected}`);
    }
  }

  // share card
  for (const tag of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
    if (!html.includes(`property="${tag}"`)) fail('social card', `${rel} has no ${tag}`);
  }
  if (!html.includes('name="twitter:card"')) fail('social card', `${rel} has no twitter:card`);
  if (html.includes('property="og:image"') && !html.includes('/images/og/og-crompton-international.jpg')) {
    fail('social card', `${rel} og:image does not point at the generated card`);
  }

  // hreflang only where a translation exists
  const isHome = rel === '/en/index.html' || rel === '/ar/index.html';
  const alts = html.match(/rel="alternate" hreflang="/g) ?? [];
  if (isHome && alts.length !== 3) fail('hreflang', `${rel} has ${alts.length} alternates, expected 3`);
  if (!isHome && alts.length !== 0) fail('hreflang', `${rel} advertises ${alts.length} alternates with no Arabic page`);

  // third-party font hosting
  if (/fonts\.(googleapis|gstatic)\.com/.test(html)) fail('fonts', `${rel} still references Google Fonts`);
}
if (!failures.some((f) => f.startsWith('canonical'))) ok(`canonical absolute and self-referential on ${pages.length} pages`);
if (!failures.some((f) => f.startsWith('social card'))) ok('og/twitter tags on every page');
if (!failures.some((f) => f.startsWith('hreflang'))) ok('hreflang on the en/ar homepage pair only');

// -------------------------------------------------------------- fonts on disk
const cssFiles = (await walk(path.join(DIST, '_astro'))).filter((f) => f.endsWith('.css'));
const css = (await Promise.all(cssFiles.map((f) => readFile(f, 'utf8')))).join('\n');
const fontRefs = [...new Set(css.match(/\/fonts\/[\w.-]+\.woff2/g) ?? [])];

if (!fontRefs.length) fail('fonts', 'no self-hosted @font-face url() in the built CSS');
for (const ref of fontRefs) {
  if (!existsSync(path.join(DIST, ref))) fail('fonts', `${ref} is referenced but not in dist`);
}
if (/fonts\.(googleapis|gstatic)\.com/.test(css)) fail('fonts', 'built CSS still loads Google Fonts');
if (!failures.some((f) => f.startsWith('fonts'))) ok(`${fontRefs.length} self-hosted font files resolve`);

// ------------------------------------------------------------- the share card
if (!existsSync(ogImagePath)) fail('og image', 'dist/images/og/og-crompton-international.jpg is missing');
else {
  const size = jpegSize(await readFile(ogImagePath));
  const bytes = (await stat(ogImagePath)).size;
  if (!size) fail('og image', 'is not a readable JPEG');
  else if (size.width !== 1200 || size.height !== 630) {
    fail('og image', `is ${size.width}x${size.height}, expected 1200x630`);
  } else if (bytes > 300 * 1024) fail('og image', `is ${(bytes / 1024).toFixed(0)} KiB, over the 300 KiB budget`);
  else ok(`og image 1200x630, ${(bytes / 1024).toFixed(0)} KiB`);
}

// ------------------------------------------------------------------ brand assets
/** Width/height straight from a PNG's IHDR chunk. */
function pngSize(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const BRAND = {
  'brand/lockup.png': [680, 118],
  'brand/lockup-white.png': [680, 118],
  'brand/mark.png': [640, 451],
  'brand/mark-white.png': [640, 451],
  'brand/favicon-32.png': [32, 32],
  'brand/apple-touch-icon.png': [180, 180],
};

for (const [rel, [w, h]] of Object.entries(BRAND)) {
  const file = path.join(DIST, rel);
  if (!existsSync(file)) {
    fail('brand', `${rel} is missing — run scripts/prepare-brand.py`);
    continue;
  }
  const size = pngSize(await readFile(file));
  if (!size) fail('brand', `${rel} is not a readable PNG`);
  else if (size.width !== w || size.height !== h) {
    fail('brand', `${rel} is ${size.width}x${size.height}, expected ${w}x${h}`);
  }
}
if (!failures.some((f) => f.startsWith('brand'))) ok(`${Object.keys(BRAND).length} brand assets present at the expected sizes`);

// The header lockup is the one image every page must carry; a page that lost it
// renders a bar with no logo at all, which no build error would catch.
for (const file of pages) {
  const rel = `/${path.relative(DIST, file)}`;
  const html = await readFile(file, 'utf8');
  if (/http-equiv="refresh"/.test(html)) continue;
  if (!html.includes('/brand/lockup.png')) fail('brand', `${rel} does not render the header lockup`);
  if (html.includes('/favicon.svg')) fail('brand', `${rel} still points at the retired favicon.svg`);
  if (!html.includes('content="#0c2340"')) fail('brand', `${rel} theme-color is not the site navy`);
}
if (!failures.some((f) => f.startsWith('brand'))) ok('every page renders the lockup, no retired icon, brand theme-color');

// ------------------------------------------------------------ palette contrast
// The palette is four client colours plus derived shades. Whether the pairs the site
// actually puts text on survive AA is arithmetic, not opinion — so assert it here
// rather than trusting whoever picked the tint.
const { default: tw } = await import(path.join(ROOT, 'tailwind.config.js'));
const C = tw.theme.extend.colors;

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const TEXT = 4.5; // AA for body-size text
const PAIRS = [
  ['ink on paper', C.ink.DEFAULT, C.paper.DEFAULT, TEXT],
  ['ink-muted on paper', C.ink.muted, C.paper.DEFAULT, TEXT],
  ['ink-faint on paper', C.ink.faint, C.paper.DEFAULT, TEXT],
  ['ink-muted on paper-2', C.ink.muted, C.paper[2], TEXT],
  ['ink-faint on paper-2', C.ink.faint, C.paper[2], TEXT],
  ['primary on paper', C.primary[500], C.paper.DEFAULT, TEXT],
  ['secondary-600 on paper', C.secondary[600], C.paper.DEFAULT, TEXT],
  ['secondary-700 on paper', C.secondary[700], C.paper.DEFAULT, TEXT],
  ['accent on paper', C.accent, C.paper.DEFAULT, TEXT],
  ['white on primary-500', '#ffffff', C.primary[500], TEXT],
  ['white on primary-700', '#ffffff', C.primary[700], TEXT],
  ['navy on secondary-400 (button)', C.primary[500], C.secondary[400], TEXT],
  ['white on ground', '#ffffff', C.ground, TEXT],
  ['secondary-300 on ground (labels)', C.secondary[300], C.ground, TEXT],
];

for (const [name, a, b, min] of PAIRS) {
  const ratio = contrast(a, b);
  if (ratio < min) fail('contrast', `${name} is ${ratio.toFixed(2)}:1, needs ${min}:1`);
}
if (!failures.some((f) => f.startsWith('contrast'))) {
  ok(`${PAIRS.length} text pairs meet AA (lowest ${Math.min(...PAIRS.map(([, a, b]) => contrast(a, b))).toFixed(2)}:1)`);
}

// The brand accent at 400 is 3.4:1 on white — fine for marks, rules and large type,
// not for body copy. If it ever clears the body threshold, the darker steps exist for
// nothing and someone should say so rather than leave three shades doing one job.
const accentOnWhite = contrast(C.secondary[400], C.paper.DEFAULT);
if (accentOnWhite >= TEXT) {
  notes.push(`  note ${C.secondary[400]} clears AA on its own (${accentOnWhite.toFixed(2)}:1) — the action shade could be collapsed`);
}
if (contrast(C.secondary[400], C.ground) >= TEXT) {
  notes.push(`  note ${C.secondary[400]} clears AA on the navy ground (${contrast(C.secondary[400], C.ground).toFixed(2)}:1); the 300 tint is kept for 11px labels, not for compliance`);
}

// --------------------------------------------------------------------- report
console.log(`checked ${pages.length} pages in dist/`);
for (const n of notes) console.log(n);

if (failures.length) {
  console.error(`\n${failures.length} FAILED`);
  for (const f of failures) console.error(`  FAIL ${f}`);
  process.exit(1);
}
console.log('\nall checks passed');
